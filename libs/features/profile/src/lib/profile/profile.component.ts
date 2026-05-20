import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@fe/core';
import { ProfileService } from '@fe/domain/profile';
import { UiButton, UiCard, UiInput } from '@fe/ui';

@Component({
  standalone: true,
  selector: 'feat-profile-page',
  imports: [CommonModule, FormsModule, RouterModule, UiCard, UiButton, UiInput],
  template: `
    <div class="min-h-screen p-6 bg-surface-base">
      <div class="max-w-3xl mx-auto space-y-6">
        <lib-card class="space-y-6 p-6">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-text-base">My Profile</h1>
              <p class="text-sm text-text-muted">Update your creator profile and save it to the identity service.</p>
            </div>
            <button (click)="goBack()" class="inline-flex items-center rounded-xl border border-border-subtle px-4 py-2 text-sm font-semibold text-text-base transition hover:bg-surface-subtle">
              Back
            </button>
          </div>

          <form class="grid gap-6" (ngSubmit)="save()">
            <lib-input label="Email" placeholder="Email" type="email" [disabled]="true" [(ngModel)]="email" name="email"></lib-input>
            <lib-input label="Display Name" placeholder="Display name" [(ngModel)]="displayName" name="displayName"></lib-input>
            <lib-input label="Username" placeholder="username" [(ngModel)]="username" name="username"></lib-input>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm text-text-muted">Your profile is kept in local state and refreshed from the identity API.</div>
              <lib-button type="submit" [disabled]="saving" class="!w-full sm:!w-auto !px-6 !py-3">
                {{ saving ? 'Saving...' : 'Save Profile' }}
              </lib-button>
            </div>

            @if (status) {
              <div class="rounded-2xl border border-surface-subtle bg-surface-muted p-4 text-sm text-text-base">{{ status }}</div>
            }
          </form>
        </lib-card>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  displayName = '';
  username = '';
  email = '';
  status = '';
  saving = false;

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.displayName = user.displayName ?? '';
        this.username = user.username ?? '';
        this.email = user.email ?? '';
      }
    });
  }

  save() {
    const user = this.authService.user();
    if (!user?.id) {
      this.status = 'Please sign in again before updating your profile.';
      return;
    }

    this.saving = true;
    this.status = '';

    this.profileService
      .updateProfile(user.id, {
        displayName: this.displayName,
        username: this.username,
      })
      .subscribe({
        next: () => {
          this.status = 'Profile saved successfully.';
          this.authService.checkAuth();
        },
        error: () => {
          this.status = 'Unable to save profile. Please try again.';
        },
        complete: () => {
          this.saving = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
