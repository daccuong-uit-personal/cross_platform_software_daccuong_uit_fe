/**
 * @fileoverview Follow Button Component
 */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-follow-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="follow-button"
      [class.following]="isFollowing"
      (click)="onToggleFollow()"
      [disabled]="isLoading"
    >
      <span class="button-text">{{ isFollowing ? 'Following' : 'Follow' }}</span>
    </button>
  `,
  styles: [
    `
      .follow-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: var(--button-height, 1.75rem);
        min-height: var(--button-height, 1.75rem);
        padding: var(--button-padding-y, 0.2rem) var(--button-padding-x, 0.5rem);
        border: 1px solid var(--color-border-subtle, #d0d7de);
        border-radius: var(--button-radius, 0.375rem);
        background-color: transparent;
        color: var(--color-text-base, #0f172a);
        font-family: var(--font-family-ui, 'Inter', system-ui, sans-serif);
        font-weight: var(--button-font-weight, 400);
        cursor: pointer;
        transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: var(--button-font-size, 0.8125rem);
        line-height: 1;
      }

      .follow-button:hover:not(:disabled) {
        background-color: var(--color-surface-subtle, #f3f4f6);
      }

      .follow-button.following {
        border-color: var(--color-brand-primary, #1d9bf0);
        color: var(--color-brand-primary, #1d9bf0);
        background-color: transparent;
      }

      .follow-button.following:hover:not(:disabled) {
        background-color: rgba(29, 155, 240, 0.06);
      }

      .follow-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .button-text {
        display: block;
      }
    `,
  ],
})
export class FollowButtonComponent implements OnInit {
  @Input() isFollowing = false;
  @Input() isLoading = false;
  @Output() toggleFollow = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialize if needed
  }

  onToggleFollow(): void {
    this.toggleFollow.emit();
  }
}
