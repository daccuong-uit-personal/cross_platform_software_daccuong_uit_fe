import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent, UiButton, CreatePostModalComponent, SkeletonCardComponent, CommentThreadPanelComponent, CommentThreadTarget } from '@fe/ui';
import { HomeFacade } from '../../data-access/home.facade';
import { AuthService } from '@fe/core';
import { Comment, CreateCommentPayload, Post, SocialCommentService } from '@fe/domain/social';
import { insertCommentIntoTree, mergeCommentsWithServer, replaceOptimisticComment } from '@fe/domain/social';

@Component({
  standalone: true,
  imports: [CommonModule, PostCardComponent, UiButton, CreatePostModalComponent, SkeletonCardComponent, CommentThreadPanelComponent],
  selector: 'fe-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  private homeFacade = inject(HomeFacade);
  private authService = inject(AuthService);
  private socialCommentService = inject(SocialCommentService);

  posts = this.homeFacade.posts;
  isLoading = this.homeFacade.isLoading;
  error = this.homeFacade.error;
  activeTab = signal<'posts' | 'videos' | 'shop' | 'stories'>('posts');
  searchQuery = signal('');
  isCreatePostModalOpen = signal(false);
  isCommentPanelOpen = signal(false);
  selectedCommentTarget = signal<CommentThreadTarget | null>(null);
  selectedComments = signal<Comment[]>([]);
  postToShare = signal<Post | undefined>(undefined);
  currentUser = computed(() => this.authService.user());

  filteredPosts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const currentPosts = this.posts();
    if (!query) {
      return currentPosts;
    }

    return currentPosts.filter((post) => {
      const content = post.content?.toLowerCase() ?? '';
      const author = post.author.fullName?.toLowerCase() ?? post.author.username?.toLowerCase() ?? '';
      const hashtags = post.hashtags?.join(' ').toLowerCase() ?? '';
      const mentions = post.mentions?.join(' ').toLowerCase() ?? '';
      return [content, author, hashtags, mentions].some((value) => value.includes(query));
    });
  });

  displayedPostsCount = computed(() => this.filteredPosts().length);
  feedTitle = computed(() => {
    switch (this.activeTab()) {
      case 'videos':
        return 'Video';
      case 'shop':
        return 'Shop';
      case 'stories':
        return 'Truyện';
      default:
        return 'Bài đăng';
    }
  });
  feedMeta = computed(() =>
    this.searchQuery().trim()
      ? `Kết quả tìm kiếm cho "${this.searchQuery()}"`
      : ''
  );

  tabs = [
    { id: 'posts', label: 'Bài đăng' },
    { id: 'videos', label: 'Video' },
    { id: 'shop', label: 'Shop' },
    { id: 'stories', label: 'Truyện' },
  ] as const;

  // Show 3 skeleton cards while loading
  skeletonItems = [1, 2, 3];

  ngOnInit(): void {
    this.homeFacade.loadFeed();
    this.authService.checkAuth();
  }

  selectTab(tabId: 'posts' | 'videos' | 'shop' | 'stories') {
    this.activeTab.set(tabId);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  onCreatePost(): void {
    this.isCreatePostModalOpen.set(true);
  }

  onCloseCreatePost(): void {
    this.isCreatePostModalOpen.set(false);
    this.postToShare.set(undefined);
  }

  onSubmitPost(event: any): void {
    this.homeFacade.createPost(event);
    this.isCreatePostModalOpen.set(false);
    this.postToShare.set(undefined);
  }

  onOpenShareModal(post: Post): void {
    // If this post is itself a repost, share the original post instead
    const postToShare = post.originalPost ?? post;
    this.postToShare.set(postToShare);
    this.isCreatePostModalOpen.set(true);
  }

  onToggleLike(postId: string): void {
    this.homeFacade.toggleLike(postId);
  }

  onOpenComments(post: Post): void {
    this.selectedCommentTarget.set({
      id: post.id,
      type: 'post',
      title: post.content?.slice(0, 60) || 'Bài viết',
      description: post.author?.fullName ? `Đăng bởi ${post.author.fullName}` : undefined,
      previewImage: post.images?.[0],
      badge: 'Bài đăng',
      post,
    });
    this.selectedComments.set([]);
    this.isCommentPanelOpen.set(true);

    this.socialCommentService.getComments(post.id).subscribe((comments) => {
      this.selectedComments.update((currentComments) => mergeCommentsWithServer(currentComments, comments));
    });
  }

  onCloseCommentPanel(): void {
    this.isCommentPanelOpen.set(false);
    this.selectedCommentTarget.set(null);
    this.selectedComments.set([]);
  }

  onSubmitComment(payload: CreateCommentPayload): void {
    const optimisticId = `optimistic-${Date.now()}`;
    const currentUser = this.authService.user();
    const optimisticComment: Comment = {
      id: optimisticId,
      author: {
        id: currentUser?.userId ?? currentUser?.id ?? 'me',
        username: currentUser?.username ?? 'me',
        fullName: currentUser?.displayName ?? currentUser?.username ?? 'Bạn',
        avatar: 'https://i.pravatar.cc/150?img=12',
        bio: '',
        followers: 0,
        following: 0,
        postsCount: 0,
        isFollowing: false,
        isFollowedBy: false,
        isBlocked: false,
        isMuted: false,
      },
      postId: payload.postId,
      content: payload.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      mentionedUsers: payload.mentionedUserIds ?? payload.mentionedUsers ?? [],
      mentionRanges: payload.mentionRanges ?? [],
      replyCount: 0,
      parentId: payload.replyToCommentId ?? null,
    };

    this.selectedComments.update((comments) => {
      if (payload.replyToCommentId) {
        return insertCommentIntoTree(comments, optimisticComment, payload.replyToCommentId);
      }

      return [optimisticComment, ...comments];
    });

    this.socialCommentService.createComment(payload).subscribe({
      next: (comment) => {
        this.selectedComments.update((comments) => {
          if (!comment?.id) {
            return comments;
          }

          return replaceOptimisticComment(comments, optimisticId, {
            ...optimisticComment,
            ...comment,
            author: comment.author ?? optimisticComment.author,
            replies: comment.replies ?? [],
            mentionedUsers: comment.mentionedUsers ?? optimisticComment.mentionedUsers,
            mentionRanges: comment.mentionRanges ?? optimisticComment.mentionRanges,
            parentId: comment.parentId ?? optimisticComment.parentId,
          });
        });
      },
      error: () => {
        this.selectedComments.update((comments) => comments.filter((item) => item.id !== optimisticId));
      },
    });
  }

  retryLoad(): void {
    this.homeFacade.loadFeed();
  }

  trackByPostId(_index: number, post: any): string {
    return post.id;
  }
}
