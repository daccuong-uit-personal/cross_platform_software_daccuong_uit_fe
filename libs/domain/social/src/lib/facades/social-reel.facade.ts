import { Injectable, signal, computed, inject } from '@angular/core';
import { SocialReelService } from '../services/social-reel.service';
import { ReelItem, ReelComment, CreateReelPayload } from '../models/social-reel.models';
import { catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocialReelFacade {
  private reelService = inject(SocialReelService);

  reels = signal<ReelItem[]>([]);
  friendReels = signal<ReelItem[]>([]);
  isFriendReelsLoading = signal(false);
  currentIndex = signal(0);
  showComments = signal(false);
  newComment = signal('');
  isFollowing = signal<Record<string, boolean>>({});

  currentReel = computed(() => this.reels()[this.currentIndex()]);

  constructor() {
    this.loadReels();
    this.loadFriendReels();
  }

  loadReels() {
    this.reelService.getDiscoverReels().pipe(take(1)).subscribe({
      next: (response) => {
        const items = response.data.map((r: any) => ({
          id: r.id,
          author: r.author?.displayName || r.author?.username || 'Unknown',
          avatar: r.author?.avatarUrl || '',
          description: r.content,
          music: '♪ Trending',
          likes: r.likeCount,
          comments: r.commentCount,
          shares: r.shareCount,
          saves: 0,
          liked: r.isLikedByCurrentUser,
          saved: r.isBookmarkedByCurrentUser,
          videoUrl: r.videoUrl,
          thumbnailUrl: r.thumbnailUrl || r.coverUrl,
          userId: r.author?.id,
          thumbnailColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          commentList: []
        }));
        this.reels.set(items);
      },
      error: (err) => {
        console.error('Error loading reels', err);
      }
    });
  }

  loadFriendReels() {
    this.isFriendReelsLoading.set(true);
    this.reelService.getFriendReels().pipe(take(1)).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : (response?.data ?? []);
        const items: ReelItem[] = data.map((r: any) => ({
          id: r.id,
          author: r.author?.displayName || r.author?.username || 'Unknown',
          avatar: r.author?.avatarUrl || '',
          description: r.content || r.description || '',
          music: r.music || '♪ Trending',
          likes: r.likeCount ?? 0,
          comments: r.commentCount ?? 0,
          shares: r.shareCount ?? 0,
          saves: 0,
          liked: r.isLikedByCurrentUser ?? false,
          saved: r.isBookmarkedByCurrentUser ?? false,
          videoUrl: r.videoUrl || '',
          thumbnailUrl: r.thumbnailUrl || r.coverUrl,
          userId: r.author?.id,
          thumbnailColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          commentList: []
        }));
        this.friendReels.set(items);
        this.isFriendReelsLoading.set(false);
      },
      error: () => {
        // Nếu API chưa có, fallback về mảng rỗng
        this.friendReels.set([]);
        this.isFriendReelsLoading.set(false);
      }
    });
  }

  createReel(payload: CreateReelPayload) {
    return this.reelService.createReel(payload);
  }

  loadCommentsForReel(reelId: string) {
    this.reelService.getReelComments(reelId).pipe(take(1)).subscribe({
      next: (response) => {
        const comments = response.data.map((c: any) => ({
          id: c.id,
          author: c.author?.displayName || c.author?.username || 'Unknown',
          avatar: c.author?.avatarUrl || '',
          text: c.content,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          likes: c.likeCount,
          liked: c.isLikedByCurrentUser
        }));

        this.reels.update((list) =>
          list.map((r) => r.id === reelId ? { ...r, commentList: comments } : r)
        );
      },
      error: (err) => {
        console.error('Error loading comments', err);
      }
    });
  }

  toggleLike() {
    const reel = this.currentReel();
    if (!reel) return;

    const originalLiked = reel.liked;
    const reelId = reel.id;

    // Optimistic update
    this.reels.update((list) =>
      list.map((r) =>
        r.id === reelId
          ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );

    const request = originalLiked
      ? this.reelService.unlikeReel(reelId)
      : this.reelService.likeReel(reelId);

    request.pipe(take(1)).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error toggling like', err);
        // Revert optimistic update
        this.reels.update((list) =>
          list.map((r) =>
            r.id === reelId
              ? { ...r, liked: originalLiked, likes: originalLiked ? r.likes + 1 : r.likes - 1 }
              : r
          )
        );
      }
    });
  }

  toggleSave() {
    this.reels.update((list) =>
      list.map((r, i) =>
        i === this.currentIndex()
          ? { ...r, saved: !r.saved, saves: r.saved ? r.saves - 1 : r.saves + 1 }
          : r
      )
    );
  }

  toggleComments() {
    this.showComments.update((v) => !v);
    const reel = this.currentReel();
    if (this.showComments() && reel && reel.commentList.length === 0) {
      this.loadCommentsForReel(reel.id);
    }
  }

  closeComments() {
    this.showComments.set(false);
  }

  toggleFollow(reelId: string) {
    this.isFollowing.update((map) => ({ ...map, [reelId]: !map[reelId] }));
  }

  isFollowingAuthor(reelId: string): boolean {
    return this.isFollowing()[reelId] ?? false;
  }

  toggleCommentLike(commentId: string) {
    const reel = this.currentReel();
    if (!reel) return;

    const comment = reel.commentList.find((c) => c.id === commentId);
    if (!comment) return;

    const originalLiked = comment.liked;

    // Optimistic update
    this.reels.update((list) =>
      list.map((r, i) =>
        i === this.currentIndex()
          ? {
            ...r,
            commentList: r.commentList.map((c) =>
              c.id === commentId
                ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                : c
            ),
          }
          : r
      )
    );

    const request = originalLiked
      ? this.reelService.unlikeComment(commentId)
      : this.reelService.likeComment(commentId);

    request.pipe(take(1)).subscribe({
      next: () => { },
      error: (err) => {
        console.error('Error toggling comment like', err);
        // Revert on error
        this.reels.update((list) =>
          list.map((r, i) =>
            i === this.currentIndex()
              ? {
                ...r,
                commentList: r.commentList.map((c) =>
                  c.id === commentId
                    ? { ...c, liked: originalLiked, likes: originalLiked ? c.likes + 1 : c.likes - 1 }
                    : c
                ),
              }
              : r
          )
        );
      }
    });
  }

  submitComment() {
    const text = this.newComment().trim();
    if (!text) return;

    const reel = this.currentReel();
    if (!reel) return;

    this.reelService.submitComment(reel.id, text).pipe(take(1)).subscribe({
      next: (response) => {
        const c = response;
        const newC: ReelComment = {
          id: c.id,
          author: c.author?.displayName || c.author?.username || 'Bạn',
          avatar: c.author?.avatarUrl || '',
          text: c.content,
          timeAgo: 'Vừa xong',
          likes: c.likeCount,
          liked: c.isLikedByCurrentUser,
        };

        this.reels.update((list) =>
          list.map((r) =>
            r.id === reel.id
              ? {
                ...r,
                commentList: [newC, ...r.commentList],
                comments: r.comments + 1,
              }
              : r
          )
        );
        this.newComment.set('');
      },
      error: (err) => {
        console.error('Error submitting comment', err);
      }
    });
  }

  goToPrev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  goToNext() {
    if (this.currentIndex() < this.reels().length - 1) {
      this.currentIndex.update((i) => i + 1);

      if (this.showComments()) {
        const nextReel = this.currentReel();
        if (nextReel && nextReel.commentList.length === 0) {
          this.loadCommentsForReel(nextReel.id);
        }
      }
    }
  }

  goToReel(index: number) {
    this.currentIndex.set(index);
    if (this.showComments()) {
      const reel = this.currentReel();
      if (reel && reel.commentList.length === 0) {
        this.loadCommentsForReel(reel.id);
      }
    }
  }
}
