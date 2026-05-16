import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { UiButton, UiCard } from '@fe/ui';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  selector: 'feat-auth-register',
  imports: [CommonModule, FormsModule, RouterModule, UiCard, UiButton, TranslocoModule],
  template: `
    <div class="flex min-h-screen w-full items-center justify-center p-6" *transloco="let t">
      <lib-card class="max-w-md">
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-3xl font-bold text-white shadow-glow">
            SC
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-text-base">Create account</h1>
          <p class="mt-2 text-text-muted">Join our creator community today</p>
        </div>

        @if (errorMessage) {
          <div class="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="grid gap-6">
          <div class="space-y-2">
            <label for="username" class="text-sm font-semibold text-text-base">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              [(ngModel)]="credentials.username"
              placeholder="creator123"
              class="h-12 w-full rounded-xl border border-surface-subtle bg-white/50 px-4 text-text-base outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-text-base">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="credentials.email"
              placeholder="name@example.com"
              class="h-12 w-full rounded-xl border border-surface-subtle bg-white/50 px-4 text-text-base outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-semibold text-text-base">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="credentials.password"
              placeholder="••••••••"
              class="h-12 w-full rounded-xl border border-surface-subtle bg-white/50 px-4 text-text-base outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
              required
            />
          </div>

          <lib-button type="submit" [disabled]="isLoading" class="mt-2">
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </lib-button>
        </form>

        <div class="mt-8 text-center text-sm">
          <span class="text-text-muted">Already have an account?</span>
          <a routerLink="/auth/login" class="ml-1 font-bold text-brand-primary transition-colors hover:text-brand-primary-hover">
            Sign in
          </a>
        </div>
      </lib-card>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    username: '',
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  onSubmit() {
    if (!this.credentials.username || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please complete all fields to continue.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.message || 'Unable to register. Please try again.';
      }
    });
  }
}
