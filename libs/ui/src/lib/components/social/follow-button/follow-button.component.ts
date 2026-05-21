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
        padding: 8px 20px;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        background-color: #fff;
        color: #000;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;

        &:hover:not(:disabled) {
          border-color: #0066cc;
          color: #0066cc;
          background-color: #f0f7ff;
        }

        &.following {
          border-color: #0066cc;
          color: #0066cc;
          background-color: #0066cc;
          color: #fff;

          &:hover:not(:disabled) {
            background-color: #0052a3;
            border-color: #0052a3;
          }
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
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
