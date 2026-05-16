import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { UiButton, UiCard } from '@fe/ui';
import { TranslocoModule } from '@jsverse/transloco';
import { toast } from 'ngx-sonner';

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

        <form (ngSubmit)="onSubmit()" class="grid gap-6">
          <div class="space-y-2">
            <label for="username" class="text-sm font-semibold text-text-base" [class.text-red-500]="fieldErrors['username']">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              [(ngModel)]="credentials.username"
              (ngModelChange)="fieldErrors['username'] = false"
              placeholder="creator123"
              class="h-12 w-full rounded-xl border bg-white/50 px-4 text-text-base outline-none transition-all focus:ring-4"
              [ngClass]="fieldErrors['username'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-surface-subtle focus:border-brand-primary focus:ring-brand-primary/10'"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="displayName" class="text-sm font-semibold text-text-base" [class.text-red-500]="fieldErrors['displayName']">Display Name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              [(ngModel)]="credentials.displayName"
              (ngModelChange)="fieldErrors['displayName'] = false"
              placeholder="Your Name"
              class="h-12 w-full rounded-xl border bg-white/50 px-4 text-text-base outline-none transition-all focus:ring-4"
              [ngClass]="fieldErrors['displayName'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-surface-subtle focus:border-brand-primary focus:ring-brand-primary/10'"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-semibold text-text-base" [class.text-red-500]="fieldErrors['email']">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              [(ngModel)]="credentials.email"
              (ngModelChange)="fieldErrors['email'] = false"
              placeholder="name@example.com"
              class="h-12 w-full rounded-xl border bg-white/50 px-4 text-text-base outline-none transition-all focus:ring-4"
              [ngClass]="fieldErrors['email'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-surface-subtle focus:border-brand-primary focus:ring-brand-primary/10'"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-semibold text-text-base" [class.text-red-500]="fieldErrors['password']">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="credentials.password"
              (ngModelChange)="fieldErrors['password'] = false"
              placeholder="••••••••"
              class="h-12 w-full rounded-xl border bg-white/50 px-4 text-text-base outline-none transition-all focus:ring-4"
              [ngClass]="fieldErrors['password'] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-surface-subtle focus:border-brand-primary focus:ring-brand-primary/10'"
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
    displayName: '',
    email: '',
    password: ''
  };

  isLoading = false;
  fieldErrors: Record<string, boolean> = {};

  onSubmit() {
    this.fieldErrors = {}; // Reset errors
    let isValid = true;
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    if (!this.credentials.username || this.credentials.username.length < 3) {
      this.fieldErrors['username'] = true;
      isValid = false;
    }

    if (!this.credentials.displayName || this.credentials.displayName.trim().length === 0) {
      this.fieldErrors['displayName'] = true;
      isValid = false;
    }

    if (!this.credentials.email || !emailRegex.test(this.credentials.email)) {
      this.fieldErrors['email'] = true;
      isValid = false;
    }

    if (!this.credentials.password || this.credentials.password.length < 8) {
      this.fieldErrors['password'] = true;
      isValid = false;
    }

    if (!isValid) {
      toast.error('Please check the highlighted fields.');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success('Account created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        // Global error interceptor handles the API error toast
      }
    });
  }
}

