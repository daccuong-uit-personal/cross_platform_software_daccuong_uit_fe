import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiLanguageSelector } from '@fe/ui';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'auth-login-language-selector',
  imports: [CommonModule, UiLanguageSelector, RouterModule],
  template: `
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-surface-base border-t border-border-subtle">

      <!-- Row 1: "Bạn không có tài khoản? Đăng ký" -->
      <div class="w-full py-4 flex justify-center items-center text-sm">
        <span style="color: var(--color-text-muted);">Bạn không có tài khoản?</span>
        <a routerLink="/auth/register" class="ml-1 font-bold hover:underline" style="color: #fe2c55;">
          Đăng ký
        </a>
      </div>

      <!-- Row 2: Language + theme toggle (left) | copyright (right) -->
      <div class="px-6 pb-5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Language selector — plain text, no border -->
          <lib-language-selector />

          <!-- Theme toggle button -->
          <button
            (click)="themeToggled.emit()"
            class="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity whitespace-nowrap"
            style="color: var(--color-text-base); background: none; border: none; cursor: pointer; padding: 0;"
          >
            <span>{{ isDark ? 'Chế độ sáng' : 'Chế độ tối' }}</span>
            <span style="font-size: 16px;">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>

        <div class="text-xs font-normal" style="color: var(--color-text-muted); opacity: 0.7;">© 2026 TikTok</div>
      </div>

    </div>
  `,
})
export class LoginLanguageSelector {
  @Input() isDark = false;
  @Output() themeToggled = new EventEmitter<void>();
}