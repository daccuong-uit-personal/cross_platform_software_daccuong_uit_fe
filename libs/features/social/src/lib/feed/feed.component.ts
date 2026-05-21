/**
 * @fileoverview Feed Feature Component
 * Main feed component for displaying posts with infinite scroll
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@libs/domain/social';
import { SocialPostService } from '@libs/domain/social';
import { PostCardComponent } from '@libs/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  template: `
    <div class="feed-container">
      <!-- Feed Header -->
      <div class="feed-header">
        <h1>Feed</h1>
        <div class="feed-tabs">
          <button class="tab-btn" [class.active]="feedType === 'personal'" (click)="switchFeed('personal')">
            For You
          </button>
          <button class="tab-btn" [class.active]="feedType === 'discover'" (click)="switchFeed('discover')">
            Discover
          </button>
        </div>
      </div>

      <!-- Create Post Section (placeholder) -->
      <div class="create-post-section">
        <img src="https://i.pravatar.cc/150?img=12" alt="You" class="user-avatar" />
        <div class="input-wrapper">
          <input
            type="text"
            class="post-input"
            placeholder="What's on your mind?"
            (click)="onCreatePost()"
          />
          <div class="post-options">
            <button class="option-btn" title="Add images">📷</button>
            <button class="option-btn" title="Add video">🎥</button>
            <button class="option-btn" title="Add emoji">😊</button>
          </div>
        </div>
      </div>

      <!-- Posts Feed -->
      <div class="posts-feed">
        <app-post-card
          *ngFor="let post of posts"
          [post]="post"
          (toggleLike)="onToggleLike(post.id)"
          (toggleBookmark)="onToggleBookmark(post.id)"
          (comment)="onComment(post.id)"
          (share)="onShare(post.id)"
          (reply)="onReply(post.id, $event)"
        />
      </div>

      <!-- Loading Indicator -->
      <div class="loading" *ngIf="isLoading">
        <span class="spinner"></span>
        <p>Loading posts...</p>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && posts.length === 0">
        <p>📭 No posts yet. Follow users to see their posts!</p>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div #infiniteScroll class="infinite-scroll-trigger"></div>
    </div>
  `,
  styles: [
    `
      .feed-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 16px;
      }

      .feed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 12px;
      }

      .feed-header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 800;
      }

      .feed-tabs {
        display: flex;
        gap: 16px;
      }

      .tab-btn {
        background: none;
        border: none;
        font-size: 15px;
        font-weight: 600;
        color: #666;
        cursor: pointer;
        padding: 8px 0;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;

        &.active {
          color: #0066cc;
          border-bottom-color: #0066cc;
        }

        &:hover {
          color: #000;
        }
      }

      .create-post-section {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        margin-bottom: 16px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .input-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .post-input {
        width: 100%;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 15px;
        transition: border-color 0.2s ease;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: #0066cc;
          background: #f9f9f9;
        }

        &::placeholder {
          color: #999;
        }
      }

      .post-options {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .option-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.2s ease;

        &:hover {
          background: #f0f0f0;
        }
      }

      .posts-feed {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        color: #666;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #f0f0f0;
        border-top-color: #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 12px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        color: #999;
        font-size: 16px;
      }

      .infinite-scroll-trigger {
        height: 1px;
      }
    `,
  ],
})
export class FeedComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  feedType: 'personal' | 'discover' = 'personal';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private postService: SocialPostService) {}

  ngOnInit(): void {
    this.loadFeed();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchFeed(type: 'personal' | 'discover'): void {
    this.feedType = type;
    this.posts = [];
    this.loadFeed();
  }

  loadFeed(): void {
    this.isLoading = true;
    this.postService
      .getFeed(this.feedType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (feed) => {
          this.posts = feed.posts;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onToggleLike(postId: string): void {
    this.postService
      .toggleLike(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onToggleBookmark(postId: string): void {
    this.postService
      .toggleBookmark(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onComment(postId: string): void {
    console.log('Comment on post:', postId);
  }

  onShare(postId: string): void {
    this.postService
      .sharePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onReply(postId: string, text: string): void {
    console.log('Reply to post:', postId, 'Text:', text);
  }

  onCreatePost(): void {
    console.log('Create post clicked');
    // Navigate to create post page
  }
}
