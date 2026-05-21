/**
 * @fileoverview Post Card Component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@libs/domain/social';
import { FollowButtonComponent } from '../follow-button/follow-button.component';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FollowButtonComponent, LikeButtonComponent],
  template: `
    <div class="post-card" *ngIf="post">
      <!-- Post Header -->
      <div class="post-header">
        <div class="author-info">
          <img [src]="post.author.avatar" [alt]="post.author.fullName" class="avatar" />
          <div class="author-details">
            <h4 class="author-name">{{ post.author.fullName }}</h4>
            <p class="author-username">@{{ post.author.username }}</p>
            <p class="post-time">{{ formatDate(post.createdAt) }}</p>
          </div>
        </div>
        <div class="post-actions">
          <button class="menu-btn" (click)="onMoreOptions()" aria-label="More options">
            ⋯
          </button>
        </div>
      </div>

      <!-- Post Content -->
      <div class="post-content">
        <p class="post-text">{{ post.content }}</p>

        <!-- Hashtags & Mentions -->
        <div class="tags" *ngIf="post.hashtags.length > 0 || post.mentions.length > 0">
          <span class="tag hashtag" *ngFor="let tag of post.hashtags">
            #{{ tag }}
          </span>
          <span class="tag mention" *ngFor="let mention of post.mentions">
            @{{ mention }}
          </span>
        </div>
      </div>

      <!-- Images -->
      <div class="post-media" *ngIf="post.images.length > 0">
        <div class="images-container" [class.multiple]="post.images.length > 1">
          <img
            *ngFor="let image of post.images"
            [src]="image"
            [alt]="post.content"
            class="post-image"
          />
        </div>
      </div>

      <!-- Video -->
      <div class="post-media" *ngIf="post.video">
        <video [src]="post.video" controls class="post-video"></video>
      </div>

      <!-- Post Stats -->
      <div class="post-stats">
        <span class="stat" *ngIf="post.likesCount > 0">
          <strong>{{ post.likesCount }}</strong> likes
        </span>
        <span class="stat" *ngIf="post.commentsCount > 0">
          <strong>{{ post.commentsCount }}</strong> comments
        </span>
        <span class="stat" *ngIf="post.sharesCount > 0">
          <strong>{{ post.sharesCount }}</strong> shares
        </span>
      </div>

      <!-- Post Interactions -->
      <div class="post-interactions">
        <button class="interaction-btn" (click)="onComment()">
          <span class="icon">💬</span>
          <span class="label">Comment</span>
        </button>

        <app-like-button
          [isLiked]="post.isLiked"
          [likesCount]="post.likesCount"
          [showCount]="false"
          (toggleLike)="onToggleLike()"
        />

        <button class="interaction-btn" (click)="onShare()">
          <span class="icon">↗️</span>
          <span class="label">Share</span>
        </button>

        <button
          class="interaction-btn"
          [class.active]="post.isBookmarked"
          (click)="onToggleBookmark()"
        >
          <span class="icon">{{ post.isBookmarked ? '🔖' : '📌' }}</span>
          <span class="label">{{ post.isBookmarked ? 'Saved' : 'Save' }}</span>
        </button>
      </div>

      <!-- Reply Input (placeholder) -->
      <div class="reply-section" *ngIf="showReplyBox">
        <img src="https://i.pravatar.cc/150?img=12" alt="You" class="reply-avatar" />
        <div class="reply-input-wrapper">
          <input
            type="text"
            class="reply-input"
            placeholder="Share your thoughts..."
            (keyup.enter)="onReply($event)"
          />
          <button class="reply-btn" (click)="onReply($event)">Reply</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .post-card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        transition: all 0.2s ease;

        &:hover {
          border-color: #d0d0d0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      }

      .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .author-info {
        display: flex;
        gap: 12px;
        flex: 1;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .author-details {
        flex: 1;
        min-width: 0;
      }

      .author-name {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #000;
      }

      .author-username {
        margin: 2px 0 0 0;
        font-size: 13px;
        color: #666;
      }

      .post-time {
        margin: 4px 0 0 0;
        font-size: 12px;
        color: #999;
      }

      .menu-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        color: #666;
        transition: color 0.2s ease;

        &:hover {
          color: #0066cc;
        }
      }

      .post-content {
        margin-bottom: 12px;
      }

      .post-text {
        margin: 0;
        font-size: 15px;
        line-height: 1.5;
        color: #000;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }

      .tag {
        font-size: 13px;
        padding: 4px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
          background: #e0e0e0;
        }

        &.hashtag {
          color: #0066cc;

          &:hover {
            background: #e6f2ff;
          }
        }

        &.mention {
          color: #0066cc;

          &:hover {
            background: #e6f2ff;
          }
        }
      }

      .post-media {
        margin: 12px -16px 12px -16px;
        padding: 0 16px;
      }

      .images-container {
        display: flex;
        border-radius: 12px;
        overflow: hidden;

        &.multiple {
          gap: 2px;

          .post-image {
            flex: 1;
          }
        }
      }

      .post-image,
      .post-video {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
      }

      .post-stats {
        display: flex;
        gap: 16px;
        padding: 8px 0;
        font-size: 13px;
        color: #666;
        border-bottom: 1px solid #f0f0f0;
      }

      .stat {
        strong {
          color: #000;
        }
      }

      .post-interactions {
        display: flex;
        justify-content: space-around;
        margin-top: 12px;
        padding-top: 8px;
      }

      .interaction-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        padding: 8px 4px;
        border-radius: 6px;
        transition: all 0.2s ease;

        .icon {
          font-size: 16px;
        }

        &:hover {
          background: #f0f0f0;
          color: #0066cc;
        }

        &.active {
          color: #0066cc;
        }
      }

      .reply-section {
        display: flex;
        gap: 12px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
      }

      .reply-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .reply-input-wrapper {
        flex: 1;
        display: flex;
        gap: 8px;
      }

      .reply-input {
        flex: 1;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        transition: border-color 0.2s ease;

        &:focus {
          outline: none;
          border-color: #0066cc;
        }
      }

      .reply-btn {
        padding: 8px 20px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: #0052a3;
        }
      }
    `,
  ],
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() showReplyBox = true;
  @Output() toggleLike = new EventEmitter<void>();
  @Output() toggleBookmark = new EventEmitter<void>();
  @Output() comment = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() reply = new EventEmitter<string>();
  @Output() moreOptions = new EventEmitter<void>();

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString();
  }

  onToggleLike(): void {
    this.toggleLike.emit();
  }

  onToggleBookmark(): void {
    this.toggleBookmark.emit();
  }

  onComment(): void {
    this.comment.emit();
  }

  onShare(): void {
    this.share.emit();
  }

  onReply(event: Event): void {
    const input = (event.target as HTMLInputElement);
    if (input.value.trim()) {
      this.reply.emit(input.value);
      input.value = '';
    }
  }

  onMoreOptions(): void {
    this.moreOptions.emit();
  }
}
