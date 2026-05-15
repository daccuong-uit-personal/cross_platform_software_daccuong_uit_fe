import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'core';
import { UiButton } from 'ui';
import { UiCard } from 'ui';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterModule, UiCard, UiButton],
  template: `
    <lib-card class="dashboard-card">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p class="placeholder">Logged in as {{ userDisplayName }}</p>
        </div>
        <lib-button type="button" (click)="logout()">Sign out</lib-button>
      </div>

      <div class="dashboard-content">
        <p>Use the Social Commerce platform to build your shop, manage products, and grow your audience. This dashboard is the first step to validate the auth flow through the Gateway.</p>

        <ul class="dashboard-list">
          <li>Authenticated session is active</li>
          <li>API requests should include bearer token automatically</li>
          <li>Register/login flows work through the shared auth service</li>
        </ul>
      </div>
    </lib-card>
  `,
  styles: [
    `
      .dashboard-header {
        display: flex;
        gap: var(--space-4);
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
      }
      .placeholder {
        color: var(--color-text-secondary);
        margin-top: var(--space-1);
      }
      .dashboard-content {
        color: var(--color-text-secondary);
        line-height: var(--line-height-relaxed);
      }
      .dashboard-list {
        margin-top: var(--space-6);
        padding-left: var(--space-4);
        list-style-type: disc;
        color: var(--color-text-primary);
      }
    `
  ]
})
export class DashboardPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  get userDisplayName() {
    const user = this.authService.user();
    return user?.displayName || user?.username || user?.email || 'creator';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
