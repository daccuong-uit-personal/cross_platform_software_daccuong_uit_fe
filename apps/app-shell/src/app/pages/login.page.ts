import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'core';
import { UiButton } from 'ui';
import { UiCard } from 'ui';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, RouterModule, UiCard, UiButton],
  template: `
    <lib-card class="auth-page">
      <h1 class="auth-page__title">Welcome back</h1>
      <p class="auth-page__subtitle">Sign in with your creator account to continue.</p>

      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <form (ngSubmit)="onSubmit()" class="auth-form">
        <div class="form-field">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            [(ngModel)]="credentials.email"
            placeholder="name@example.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-field">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            [(ngModel)]="credentials.password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <lib-button type="submit" [disabled]="isLoading" class="action-button">
          {{ isLoading ? 'Signing in…' : 'Sign in' }}
        </lib-button>
      </form>

      <div class="form-footer">
        <span>Need an account?</span>
        <a routerLink="/register">Create account</a>
      </div>
    </lib-card>
  `,
  styles: [
    `
      .auth-page__subtitle {
        margin-top: var(--space-2);
        margin-bottom: var(--space-6);
        color: var(--color-text-secondary);
        line-height: var(--line-height-relaxed);
      }
      .auth-form {
        display: grid;
        gap: var(--space-4);
      }
      .form-field label {
        display: block;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        margin-bottom: var(--space-2);
      }
      .form-field input {
        width: 100%;
        min-height: 3rem;
        padding: var(--space-3);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border-base);
        background: var(--color-bg-base);
        color: var(--color-text-primary);
        outline: none;
        transition: border var(--transition-fast), box-shadow var(--transition-fast);
      }
      .form-field input:focus {
        border-color: var(--color-border-focus);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
      }
      .error-message {
        color: var(--color-error-500);
        font-size: var(--font-size-sm);
        margin-bottom: var(--space-4);
      }
      .form-footer {
        margin-top: var(--space-6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
      }
      .form-footer a {
        color: var(--color-primary-500);
      }
    `
  ]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.message || 'Unable to login. Please try again.';
      }
    });
  }
}
