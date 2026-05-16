import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { UiButton, UiCard, UiInput } from '@fe/ui';
import { TranslocoModule } from '@jsverse/transloco';
import { toast } from 'ngx-sonner';

@Component({
  standalone: true,
  selector: 'feat-auth-login',
  imports: [CommonModule, FormsModule, RouterModule, UiCard, UiButton, UiInput, TranslocoModule],
  template: `
    <div class="flex min-h-screen w-full items-center justify-center p-6" *transloco="let t">
      <lib-card class="w-full max-w-md">
        <div class="mb-10 text-center">
          <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-3xl font-bold text-white shadow-glow">
            SC
          </div>
          <h1 class="text-h1 text-text-base mb-2">{{ t('common.welcome') }}</h1>
          <p class="text-muted">Sign in to your creator portal</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="grid gap-6">
          <lib-input
            label="Email"
            placeholder="name@example.com"
            type="email"
            name="email"
            [(ngModel)]="credentials.email"
            (ngModelChange)="fieldErrors['email'] = false"
            [error]="fieldErrors['email'] ? 'Please enter a valid email address' : ''"
            required
          />

          <lib-input
            label="Password"
            placeholder="••••••••"
            type="password"
            name="password"
            [(ngModel)]="credentials.password"
            (ngModelChange)="fieldErrors['password'] = false"
            [error]="fieldErrors['password'] ? 'Password is required' : ''"
            required
          />

          <lib-button type="submit" [disabled]="isLoading" class="mt-4">
            {{ isLoading ? 'Authenticating...' : t('common.login') }}
          </lib-button>
        </form>

        <div class="mt-8 text-center text-sm">
          <span class="text-muted">Need an account?</span>
          <a routerLink="/auth/register" class="ml-1 font-bold text-brand-primary transition-colors hover:text-brand-primary-hover">
            Create account
          </a>
        </div>
      </lib-card>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  isLoading = false;
  fieldErrors: Record<string, boolean> = {};

  onSubmit() {
    this.fieldErrors = {}; // Reset errors
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.credentials.email || !emailRegex.test(this.credentials.email)) {
      this.fieldErrors['email'] = true;
      isValid = false;
    }

    if (!this.credentials.password || this.credentials.password.length === 0) {
      this.fieldErrors['password'] = true;
      isValid = false;
    }

    if (!isValid) {
      toast.error('Please check the highlighted fields.');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        // Global error interceptor handles the API error toast
      }
    });
  }
}

