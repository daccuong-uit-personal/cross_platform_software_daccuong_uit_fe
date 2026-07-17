/**
 * @fileoverview Post Card Component
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '@fe/domain/social';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="post-card" *ngIf="post">
      <div class="post-card-header">
        <div class="post-author">
          <div class="avatar" [style.background-image]="'url(' + post.author.avatar + ')'" ></div>
          <div class="author-info">
            <div class="author-name-row">
              <span class="author-name">{{ post.author.fullName || post.author.username }}</span>
              <span class="author-handle">@{{ post.author.username }}</span>
              <span class="post-bullet">·</span>
              <span class="post-time">{{ formatDate(post.createdAt) }}</span>
            </div>
            <p class="author-secondary" *ngIf="post.author.bio">{{ post.author.bio }}</p>
          </div>
        </div>

        <button type="button" class="more-btn" aria-label="Thêm tùy chọn" (click)="onMoreOptions()">···</button>
      </div>

      <p class="post-text">{{ post.content }}</p>

      <div class="post-tags" *ngIf="post.hashtags.length || post.mentions.length">
        <span class="tag" *ngFor="let tag of post.hashtags">#{{ tag }}</span>
        <span class="tag mention" *ngFor="let mention of post.mentions">@{{ mention }}</span>
      </div>

      <div class="post-media" *ngIf="post.images.length">
        <img *ngFor="let image of post.images" [src]="image" alt="Post media" />
      </div>

      <div class="post-actions">
        <button class="action-btn action-like" [class.liked]="post.isLiked" type="button" (click)="onToggleLike()">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </span>
          <span class="count" *ngIf="post.likesCount">{{ post.likesCount }}</span>
        </button>
        <button class="action-btn action-comment" type="button" (click)="onComment()">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span class="count" *ngIf="post.commentsCount">{{ post.commentsCount }}</span>
        </button>
        <button class="action-btn action-retweet" type="button" (click)="onShare()">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 7 23 1 17 1" />
              <path d="M20 14a9 9 0 0 0-9-9H1" />
              <polyline points="1 17 1 23 7 23" />
              <path d="M4 10a9 9 0 0 0 9 9h11" />
            </svg>
          </span>
          <span class="count" *ngIf="post.sharesCount">{{ post.sharesCount }}</span>
        </button>
        <button class="action-btn action-stock" type="button">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </span>
        </button>
        <button class="action-btn action-views" type="button">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <span class="count">{{ post.viewsCount ?? 0 }}</span>
        </button>
        <button class="action-btn action-share" type="button" (click)="onToggleBookmark()">
          <span class="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v3a3 3 0 0 0 3 3h10" />
              <polyline points="16 6 21 12 16 18" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      .post-card {
        width: 100%;
        padding: calc(16px * var(--padding-scale, 1));
        display: flex;
        flex-direction: column;
        gap: calc(14px * var(--padding-scale, 1));
        background: var(--color-surface-base, #ffffff);
        border: 1px solid var(--color-border-subtle, rgba(148, 163, 184, 0.24));
        border-radius: 8px;
        transition: background 0.2s ease;
      }
      .post-card:hover {
        background: var(--color-surface-subtle, rgba(29, 155, 240, 0.04));
      }
      .post-card-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: calc(12px * var(--padding-scale, 1));
      }
      .post-author {
        display: flex;
        gap: calc(12px * var(--padding-scale, 1));
      }
      .avatar {
        min-width: calc(48px * var(--padding-scale, 1));
        width: calc(48px * var(--padding-scale, 1));
        height: calc(48px * var(--padding-scale, 1));
        border-radius: 50%;
        background-color: var(--color-surface-subtle, #f3f4f6);
        background-size: cover;
        background-position: center;
        flex-shrink: 0;
      }
      .author-info {
        display: flex;
        flex-direction: column;
        gap: calc(2px * var(--padding-scale, 1));
        min-width: 0;
      }
      .author-name-row {
        display: flex;
        flex-wrap: wrap;
        gap: calc(8px * var(--padding-scale, 1));
        align-items: center;
      }
      .author-name {
        font-size: var(--font-size-body);
        font-weight: 700;
        color: var(--color-text-base, #0f172a);
      }
      .author-handle,
      .post-time,
      .post-bullet {
        font-size: var(--font-size-caption);
        color: var(--color-text-muted, rgba(0, 0, 0, 0.6));
        font-weight: 500;
      }
      .author-secondary {
        margin: 0;
        color: var(--color-text-muted, rgba(0, 0, 0, 0.68));
        font-size: var(--font-size-caption);
        line-height: 1.45;
      }
      .more-btn {
        border: none;
        background: transparent;
        color: var(--color-text-muted, rgba(0, 0, 0, 0.55));
        font-size: var(--font-size-caption);
        cursor: pointer;
        padding: calc(6px * var(--padding-scale, 1));
        border-radius: 9999px;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .more-btn:hover {
        background: rgba(15, 23, 42, 0.04);
      }
      .post-text {
        margin: 0;
        font-size: var(--font-size-body);
        line-height: 1.75;
        color: var(--color-text-base, #0f172a);
        word-break: break-word;
      }
      .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: calc(10px * var(--padding-scale, 1));
      }
      .tag {
        font-size: var(--font-size-caption);
        color: var(--color-brand-primary, #1d9bf0);
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      .tag:hover {
        opacity: 0.85;
      }
      .post-media {
        display: grid;
        gap: calc(10px * var(--padding-scale, 1));
        margin-top: calc(6px * var(--padding-scale, 1));
        width: 100%;
      }
      .post-media img {
        width: 100%;
        height: auto;
        max-height: calc(450px * var(--padding-scale, 1));
        border-radius: calc(20px * var(--padding-scale, 1));
        object-fit: cover;
      }
      .post-actions {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: calc(10px * var(--padding-scale, 1));
        padding-top: calc(4px * var(--padding-scale, 1));
      }
      .post-actions .action-btn {
        display: inline-flex;
        align-items: center;
        gap: calc(6px * var(--padding-scale, 1));
        border: none;
        background: transparent;
        color: var(--color-text-muted, rgba(107, 114, 128, 0.85));
        cursor: pointer;
        font-size: var(--font-size-caption);
        padding: calc(8px * var(--padding-scale, 1)) calc(12px * var(--padding-scale, 1));
        border-radius: 9999px;
        white-space: nowrap;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .post-actions .action-btn:hover {
        background: rgba(29, 155, 240, 0.08);
        color: var(--color-text-base, #0f172a);
      }
      .post-actions .action-btn .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: calc(18px * var(--padding-scale, 1));
        height: calc(18px * var(--padding-scale, 1));
      }
      .post-actions .action-btn .icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .post-actions .action-btn .count {
        color: var(--color-text-muted, rgba(107, 114, 128, 0.72));
        font-size: var(--font-size-caption);
      }
      .post-actions .action-like:hover {
        background: rgba(249, 24, 128, 0.12);
      }
      .post-actions .action-like.liked {
        color: rgb(249, 24, 128);
      }
      .post-actions .action-like.liked .icon svg {
        fill: rgb(249, 24, 128);
        stroke: rgb(249, 24, 128);
      }
      .post-actions .action-retweet:hover {
        background: rgba(23, 191, 99, 0.12);
      }
      .post-actions .action-share:hover,
      .post-actions .action-stock:hover,
      .post-actions .action-views:hover,
      .post-actions .action-comment:hover {
        background: rgba(15, 23, 42, 0.06);
      }
    `
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
