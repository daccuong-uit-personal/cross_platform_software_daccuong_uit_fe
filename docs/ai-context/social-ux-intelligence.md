# Skill: Social UX & Feed Intelligence

**Agent Owner:** Social UX & Intelligence Agent  
**Last Updated:** May 2026  
**Priority:** Core for social platform identity

---

## Overview

This skill defines patterns for building social platform UI, replicating proven UX patterns from TikTok/Instagram/X, and implementing intelligent feed algorithms. The social features are central to the platform's value proposition.

## Core Principles

1. **Proven Patterns**: Copy successful UX from established platforms
2. **User-Centric Design**: Every interaction serves a purpose
3. **Engagement Loops**: Encourage sharing, commenting, and discovery
4. **Content Presentation**: Feed, story, and profile layouts optimized
5. **Real-Time Feedback**: Immediate response to user actions

---

## Feed Architecture

### Feed Component Structure

```typescript
// libs/features/home/src/lib/components/feed/feed.component.ts
import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SocialPostService, Post } from '@fe/domain-social';

/**
 * Main feed component - displays infinite scrolling posts
 * Pattern: TikTok/Instagram feed
 */
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, ScrollingModule, PostCardComponent],
  template: `
    <div class="feed-container">
      <cdk-virtual-scroll-viewport 
        itemSize="500"
        class="feed-viewport"
        (scrolledIndexChange)="onScrollEnd($event)">
        
        <!-- Loading state -->
        <div *ngIf="loading()" class="loading-skeleton">
          <app-skeleton-card></app-skeleton-card>
        </div>
        
        <!-- Posts -->
        <div class="post-item"
          *cdkVirtualFor="let post of posts(); trackBy: trackByPostId">
          <app-post-card 
            [post]="post"
            (liked)="onPostLike(post)"
            (commented)="onPostComment(post)"
            (shared)="onPostShare(post)">
          </app-post-card>
        </div>
        
        <!-- Error state -->
        <div *ngIf="error()" class="error-message">
          <p>Failed to load posts</p>
          <button (click)="retry()">Retry</button>
        </div>
        
        <!-- End of feed -->
        <div *ngIf="posts().length > 0 && !hasMore()" class="end-of-feed">
          No more posts to load
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [`
    .feed-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: var(--color-surface-base);
    }
    
    .feed-viewport {
      height: 100vh;
      overflow-y: auto;
    }
    
    .post-item {
      border-bottom: 1px solid var(--color-border-subtle);
    }
  `]
})
export class FeedComponent {
  private readonly postService = inject(SocialPostService);
  
  posts = signal<Post[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  hasMore = signal(true);
  
  private offset = signal(0);
  private pageSize = 20;
  
  constructor() {
    // Auto-load initial posts
    effect(() => {
      this.loadMorePosts();
    });
  }
  
  /**
   * Load more posts when user scrolls to bottom
   */
  onScrollEnd(index: number) {
    const threshold = this.posts().length - 3;
    if (index >= threshold && this.hasMore() && !this.loading()) {
      this.loadMorePosts();
    }
  }
  
  private loadMorePosts() {
    this.loading.set(true);
    this.error.set(null);
    
    this.postService.getFeed(this.pageSize, this.offset())
      .subscribe({
        next: (newPosts) => {
          if (newPosts.length < this.pageSize) {
            this.hasMore.set(false);
          }
          this.posts.update(posts => [...posts, ...newPosts]);
          this.offset.update(o => o + this.pageSize);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load posts');
          this.loading.set(false);
        }
      });
  }
  
  trackByPostId(index: number, post: Post) {
    return post.id;
  }
  
  onPostLike(post: Post) {
    this.postService.likePost(post.id).subscribe();
  }
  
  onPostComment(post: Post) {
    // Open comment modal
  }
  
  onPostShare(post: Post) {
    // Share functionality
  }
  
  retry() {
    this.offset.set(0);
    this.posts.set([]);
    this.hasMore.set(true);
    this.loadMorePosts();
  }
}
```

### Post Card Component

```typescript
// libs/ui/src/lib/components/social/post-card/post-card.component.ts
import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@fe/domain-social';

/**
 * Post Card - Individual post display
 * Pattern: Twitter/Instagram post card
 */
@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="post-card" [attr.aria-label]="'Post by ' + post().author">
      <!-- Header: Author info -->
      <header class="post-header">
        <img 
          [src]="post().authorAvatar"
          [alt]="post().author"
          class="avatar">
        <div class="author-info">
          <strong>{{ post().author }}</strong>
          <span class="username">@{{ post().username }}</span>
          <time class="timestamp">{{ post().createdAt | date }}</time>
        </div>
        <button class="menu-btn" aria-label="More options">⋯</button>
      </header>
      
      <!-- Content -->
      <main class="post-content">
        <p class="text">{{ post().content }}</p>
        <img 
          *ngIf="post().mediaUrl"
          [src]="post().mediaUrl"
          [alt]="'Post media'"
          class="post-media">
      </main>
      
      <!-- Engagement metrics -->
      <div class="engagement-metrics">
        <span>{{ post().likes }} likes</span>
        <span>{{ post().comments }} comments</span>
        <span>{{ post().shares }} shares</span>
      </div>
      
      <!-- Actions -->
      <footer class="post-actions">
        <button 
          class="action-btn"
          [class.active]="isLiked()"
          [attr.aria-label]="isLiked() ? 'Unlike' : 'Like'"
          (click)="toggleLike()">
          <span class="icon">{{ isLiked() ? '❤️' : '🤍' }}</span>
          <span class="count">{{ post().likes }}</span>
        </button>
        
        <button 
          class="action-btn"
          [attr.aria-label]="'Comment'"
          (click)="onComment()">
          <span class="icon">💬</span>
          <span class="count">{{ post().comments }}</span>
        </button>
        
        <button 
          class="action-btn"
          [attr.aria-label]="'Share'"
          (click)="onShare()">
          <span class="icon">↗️</span>
          <span class="count">{{ post().shares }}</span>
        </button>
      </footer>
    </article>
  `,
  styles: [`
    .post-card {
      padding: 1rem;
      border-bottom: 1px solid var(--color-border-subtle);
      transition: background 200ms ease;
    }
    
    .post-card:hover {
      background: var(--color-surface-subtle);
    }
    
    .post-header {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      align-items: flex-start;
    }
    
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .author-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .username {
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    
    .timestamp {
      color: var(--color-text-muted);
      font-size: 0.75rem;
    }
    
    .post-content {
      margin-bottom: 0.75rem;
    }
    
    .text {
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
    }
    
    .post-media {
      width: 100%;
      border-radius: 0.5rem;
      max-height: 500px;
      object-fit: cover;
    }
    
    .engagement-metrics {
      display: flex;
      gap: 1rem;
      padding: 0.75rem 0;
      font-size: 0.875rem;
      color: var(--color-text-muted);
      border-top: 1px solid var(--color-border-subtle);
      border-bottom: 1px solid var(--color-border-subtle);
    }
    
    .post-actions {
      display: flex;
      justify-content: space-around;
      padding: 0.75rem 0;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: 0.25rem;
      transition: color 200ms ease, background 200ms ease;
    }
    
    .action-btn:hover {
      color: var(--color-brand-primary);
      background: var(--color-surface-subtle);
    }
    
    .action-btn.active {
      color: #e74c3c;  /* Red for liked state */
    }
  `]
})
export class PostCardComponent {
  post = input.required<Post>();
  liked = output<void>();
  commented = output<void>();
  shared = output<void>();
  
  isLiked = signal(false);
  
  toggleLike() {
    this.isLiked.update(v => !v);
    this.liked.emit();
  }
  
  onComment() {
    this.commented.emit();
  }
  
  onShare() {
    this.shared.emit();
  }
}
```

---

## UX Patterns from TikTok/Instagram

### Story-Like Experience (Swipeable)

```typescript
// Vertical swipe to navigate between stories/reels
@Component({
  selector: 'app-reels',
  template: `
    <div class="reels-container"
      (swipeDown)="nextReel()"
      (swipeUp)="prevReel()"
      (swipeLeft)="hideActions()"
      (swipeRight)="showMore()">
      
      <video 
        [src]="currentReel.videoUrl"
        autoplay
        muted
        loop
        class="reel-video">
      </video>
      
      <!-- Side actions (Instagram style) -->
      <div class="side-actions">
        <button (click)="like()" [class.active]="isLiked">❤️</button>
        <button (click)="comment()">💬</button>
        <button (click)="share()">↗️</button>
      </div>
    </div>
  `
})
export class ReelsComponent {
  // Implementation for swipeable video feed
}
```

### Bottom Sheet Comments

```typescript
// Modal-like comment drawer from bottom
@Component({
  selector: 'app-comment-sheet',
  template: `
    <div class="comment-sheet" [@slideUp]>
      <div class="sheet-header">
        <button (click)="close()">✕</button>
        <h2>Comments</h2>
      </div>
      
      <div class="comments-list">
        <div *ngFor="let comment of comments; trackBy: trackByCommentId"
          class="comment">
          <img [src]="comment.authorAvatar" class="avatar">
          <div class="comment-content">
            <strong>{{ comment.author }}</strong>
            <p>{{ comment.text }}</p>
            <time>{{ comment.createdAt | date }}</time>
          </div>
          <button (click)="likeComment(comment)">❤️</button>
        </div>
      </div>
      
      <div class="comment-input">
        <input 
          type="text"
          placeholder="Add a comment..."
          [(ngModel)]="newComment"
          (keydown.enter)="postComment()">
      </div>
    </div>
  `
})
export class CommentSheetComponent {
  // Implementation for comment modal
}
```

---

## Trending & Discovery

### Trending Dashboard

```typescript
@Component({
  selector: 'app-trending',
  standalone: true,
  template: `
    <div class="trending-container">
      <h2>Trending Now</h2>
      
      <div class="trending-grid">
        <article *ngFor="let trend of trends; trackBy: trackByTrendId"
          class="trend-card"
          (click)="openTrend(trend)">
          
          <img [src]="trend.previewUrl" class="trend-preview">
          
          <div class="trend-info">
            <h3>#{{ trend.hashtag }}</h3>
            <p class="count">{{ trend.postCount | number }} posts</p>
            <p class="engagement">
              {{ trend.engagement | number }} interactions
            </p>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .trending-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .trend-card {
      position: relative;
      overflow: hidden;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: transform 200ms ease;
    }
    
    .trend-card:hover {
      transform: scale(1.05);
    }
    
    .trend-preview {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .trend-info {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(
        to top,
        rgba(0,0,0,0.8),
        transparent
      );
      color: white;
    }
  `]
})
export class TrendingComponent {
  trends = signal<Trend[]>([]);
  
  trackByTrendId(index: number, trend: Trend) {
    return trend.id;
  }
  
  openTrend(trend: Trend) {
    // Navigate to trending posts
  }
}
```

### Discovery/Explore Page

```typescript
@Component({
  selector: 'app-discover',
  standalone: true,
  template: `
    <div class="discover-container">
      <!-- Search -->
      <input 
        type="search"
        placeholder="Search posts, users, hashtags..."
        (input)="onSearch($event)"
        class="search-input">
      
      <!-- Categories -->
      <div class="categories">
        <button 
          *ngFor="let category of categories"
          [class.active]="selectedCategory() === category"
          (click)="selectCategory(category)"
          class="category-btn">
          {{ category }}
        </button>
      </div>
      
      <!-- Masonry Grid -->
      <div class="posts-masonry">
        <article 
          *ngFor="let post of filteredPosts(); trackBy: trackByPostId"
          class="post-thumbnail">
          <img [src]="post.thumbnail" [alt]="post.title">
          <div class="post-overlay">
            <span class="like-count">❤️ {{ post.likes }}</span>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .posts-masonry {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.5rem;
      column-gap: 0.5rem;
    }
    
    .post-thumbnail {
      position: relative;
      overflow: hidden;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    
    .post-thumbnail img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .post-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: flex-end;
      padding: 0.5rem;
      opacity: 0;
      transition: opacity 200ms ease;
    }
    
    .post-thumbnail:hover .post-overlay {
      opacity: 1;
    }
  `]
})
export class DiscoverComponent {
  selectedCategory = signal('All');
  categories = ['All', 'Music', 'Art', 'Tech', 'Lifestyle'];
  
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
  
  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    // Filter posts by search query
  }
  
  trackByPostId(index: number, post: any) {
    return post.id;
  }
}
```

---

## User Profile

### Profile Header with Stats

```typescript
@Component({
  selector: 'app-profile-header',
  standalone: true,
  template: `
    <div class="profile-header">
      <!-- Cover image -->
      <img [src]="profile().coverUrl" class="cover-image">
      
      <!-- Profile info -->
      <div class="profile-info">
        <img [src]="profile().avatarUrl" class="avatar">
        
        <div class="details">
          <h1>{{ profile().name }}</h1>
          <p class="username">@{{ profile().username }}</p>
          <p class="bio">{{ profile().bio }}</p>
        </div>
        
        <button 
          *ngIf="!isOwnProfile()"
          [class.following]="isFollowing()"
          (click)="toggleFollow()"
          class="follow-btn">
          {{ isFollowing() ? 'Following' : 'Follow' }}
        </button>
      </div>
      
      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <strong>{{ profile().postCount }}</strong>
          <span>Posts</span>
        </div>
        <div class="stat">
          <strong>{{ profile().followers }}</strong>
          <span>Followers</span>
        </div>
        <div class="stat">
          <strong>{{ profile().following }}</strong>
          <span>Following</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-header {
      background: var(--color-surface-base);
    }
    
    .cover-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .profile-info {
      padding: 0 1rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-top: -48px;  /* Overlap with cover */
    }
    
    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      border: 4px solid var(--color-surface-base);
      object-fit: cover;
    }
    
    .details {
      flex: 1;
      padding-top: 1rem;
    }
    
    .username {
      color: var(--color-text-muted);
    }
    
    .bio {
      margin-top: 0.5rem;
      color: var(--color-text-base);
    }
    
    .follow-btn {
      padding: 0.75rem 1.5rem;
      background: var(--color-brand-primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 600;
    }
    
    .follow-btn.following {
      background: var(--color-surface-subtle);
      color: var(--color-text-base);
      border: 1px solid var(--color-border-subtle);
    }
    
    .stats {
      display: flex;
      gap: 2rem;
      padding: 1rem;
      border-top: 1px solid var(--color-border-subtle);
      justify-content: center;
    }
    
    .stat {
      text-align: center;
    }
  `]
})
export class ProfileHeaderComponent {
  profile = input.required<any>();
  isOwnProfile = input<boolean>(false);
  isFollowing = signal(false);
  
  toggleFollow() {
    this.isFollowing.update(v => !v);
  }
}
```

---

## Best Practices

### ✅ DO

- Use proven UX patterns from successful platforms
- Implement virtual scrolling for feeds
- Provide immediate visual feedback
- Use animations for state changes
- Optimize images for mobile
- Implement infinite scroll
- Track engagement metrics
- A/B test layout changes

### ❌ DON'T

- Redesign well-established patterns
- Forget about mobile responsiveness
- Ignore engagement metrics
- Slow down interactions
- Use heavy animations
- Ignore accessibility
- Create confusing navigation
- Forget loading states

---

## References

- [Feed Architecture](./feed-architecture.md) (if needed)
- [Performance Optimization](./performance-qa.md)
- [Frontend Playbook](../ai-context/frontend-ai-playbook.md)
