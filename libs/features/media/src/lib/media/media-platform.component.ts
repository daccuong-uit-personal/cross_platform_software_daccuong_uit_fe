import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { MediaService } from '@fe/domain/media';
import { UiButton, UiCard } from '@fe/ui';

export interface MediaItem {
  id: string;
  originalName?: string;
  status?: string;
  type?: string;
  createdAt?: string;
}

@Component({
  standalone: true,
  selector: 'feat-media-platform',
  imports: [CommonModule, RouterModule, UiCard, UiButton],
  template: `
    <div class="min-h-screen p-6 bg-surface-base">
      <div class="max-w-5xl mx-auto space-y-6">
        <lib-card class="space-y-6 p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-text-base">Media Platform</h1>
              <p class="text-sm text-text-muted">Upload, preview and manage your creator media assets.</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <a routerLink="/home" class="inline-flex items-center rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-surface-subtle">Home</a>
              <a routerLink="/profile" class="inline-flex items-center rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-surface-subtle">Profile</a>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section class="space-y-4 rounded-3xl border border-border-subtle bg-surface-muted p-6">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h2 class="text-xl font-semibold text-text-base">Upload new media</h2>
                  <p class="text-sm text-text-muted">Supported via the backend media API. Choose a file to send to the service.</p>
                </div>
                <lib-button type="button" class="!px-5 !py-3" [disabled]="isUploading" (click)="selectFile(fileInput)">{{ isUploading ? 'Uploading...' : 'Upload file' }}</lib-button>
              </div>

              <input #fileInput type="file" accept="image/*,video/*" (change)="onFileSelected($event)" class="hidden" />
              <div class="rounded-2xl border border-border-subtle bg-surface-base px-4 py-3 text-sm text-text-base">
                <p class="text-sm text-text-muted">Choose a file using the button above.</p>
              </div>

              <div *ngIf="message" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{{ message }}</div>
              <div *ngIf="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{{ error }}</div>
            </section>

            <section class="space-y-4 rounded-3xl border border-border-subtle bg-surface-muted p-6">
              <h2 class="text-xl font-semibold text-text-base">Usage notes</h2>
              <p class="text-sm text-text-muted">Files uploaded here are stored through the media service. Use the list to verify status and delete outdated assets.</p>
              <p class="text-sm text-text-base"><strong>Stored token:</strong> {{ tokenPreview }}</p>
            </section>
          </div>

          <div class="rounded-3xl border border-border-subtle bg-surface-base p-6">
            <h2 class="text-lg font-semibold text-text-base">My media assets</h2>
            <p class="text-sm text-text-muted">The list refreshes after successful uploads.</p>

            <div class="mt-6 space-y-4">
              <div *ngIf="mediaItems.length === 0; else mediaList" class="rounded-2xl border border-border-subtle bg-surface-muted p-6 text-sm text-text-muted">
                No media assets found yet.
              </div>
              <ng-template #mediaList>
                <div class="space-y-4">
                  <div *ngFor="let item of mediaItems" class="rounded-3xl border border-border-subtle bg-surface-base p-4">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p class="font-semibold text-text-base">{{ item.originalName || item.id }}</p>
                        <p class="text-sm text-text-muted">Type: {{ item.type || 'unknown' }} · Status: {{ item.status || 'unknown' }}</p>
                      </div>
                      <div class="flex flex-wrap items-center gap-2">
                        <a [href]="getPreviewUrl(item.id)" target="_blank" class="text-brand-primary text-sm font-semibold">Preview</a>
                        <button type="button" class="rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-surface-subtle" (click)="removeItem(item.id)">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </lib-card>
      </div>
    </div>
  `,
})
export class MediaPlatformComponent {
  private authService = inject(AuthService);
  private mediaService = inject(MediaService);

  mediaItems: MediaItem[] = [];
  isUploading = false;
  message = '';
  error = '';

  constructor() {
    effect(() => {
      const userId = this.authService.user()?.id;
      if (userId) {
        this.loadMedia(userId);
      }
    });
  }

  get tokenPreview() {
    return localStorage.getItem('token') ? 'stored in localStorage' : 'not available';
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const userId = this.authService.user()?.id;

    if (!file) {
      return;
    }

    if (!userId) {
      this.error = 'User chưa được xác thực. Vui lòng đăng nhập lại.';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    this.isUploading = true;
    this.message = '';
    this.error = '';

    this.mediaService.uploadMedia(formData).subscribe({
      next: () => {
        this.message = 'Upload thành công. Danh sách media đã được cập nhật.';
        this.loadMedia(userId);
        target.value = '';
      },
      error: () => {
        this.error = 'Upload thất bại. Vui lòng thử lại.';
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  loadMedia(userId: string) {
    this.mediaService.getMediaList(userId, 'ready', undefined, 1, 20).subscribe({
      next: (items) => {
        this.mediaItems = items ?? [];
      },
      error: () => {
        this.error = 'Không thể tải danh sách media. Vui lòng thử lại.';
        this.mediaItems = [];
      },
    });
  }

  removeItem(mediaId: string) {
    this.mediaService.deleteMedia(mediaId).subscribe({
      next: () => {
        this.message = 'Media đã được xóa.';
        const userId = this.authService.user()?.id;
        if (userId) {
          this.loadMedia(userId);
        }
      },
      error: () => {
        this.error = 'Không thể xóa media. Vui lòng thử lại.';
      },
    });
  }

  selectFile(input: HTMLInputElement) {
    input.click();
  }

  getPreviewUrl(mediaId: string) {
    return this.mediaService.getPreviewUrl(mediaId);
  }
}
