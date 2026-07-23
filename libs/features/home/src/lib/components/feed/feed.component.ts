import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent, UiButton } from '@fe/ui';
import { HomeFacade } from '../../data-access/home.facade';

@Component({
  standalone: true,
  imports: [CommonModule, PostCardComponent, UiButton],
  selector: 'fe-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  private homeFacade = inject(HomeFacade);

  posts = this.homeFacade.posts;
  activeTab = signal<'posts' | 'videos' | 'shop' | 'stories'>('posts');
  searchQuery = signal('');

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

  ngOnInit(): void {
    this.homeFacade.loadFeed();
  }

  selectTab(tabId: 'posts' | 'videos' | 'shop' | 'stories') {
    this.activeTab.set(tabId);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
  }

  onCreatePost(): void {
    // Placeholder for future create-post flow.
    console.log('Open create post drawer or modal');
  }

  onToggleLike(postId: string): void {
    this.homeFacade.toggleLike(postId);
  }
}
