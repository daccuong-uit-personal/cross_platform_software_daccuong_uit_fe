import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOCK_POSTS } from '@fe/domain/social';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'fe-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts = MOCK_POSTS;
  activeTab = signal<'posts' | 'videos' | 'shop' | 'stories'>('posts');
  searchQuery = signal('');

  filteredPosts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.posts;
    }

    return this.posts.filter((post) => {
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
        return 'Feed video';
      case 'shop':
        return 'Feed shop';
      case 'stories':
        return 'Đọc truyện';
      default:
        return 'Feed bài viết';
    }
  });
  feedMeta = computed(() =>
    this.searchQuery().trim()
      ? `Kết quả tìm kiếm cho "${this.searchQuery()}"`
      : 'Tất cả bài đăng'
  );

  tabs = [
    { id: 'posts', label: 'Feed bài viết' },
    { id: 'videos', label: 'Feed video' },
    { id: 'shop', label: 'Shop' },
    { id: 'stories', label: 'Đọc truyện' },
  ] as const;

  ngOnInit(): void {}

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
}
