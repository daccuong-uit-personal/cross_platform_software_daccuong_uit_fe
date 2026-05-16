import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { UiButton, UiCard } from '@fe/ui';

@Component({
  standalone: true,
  selector: 'feat-dashboard-main',
  imports: [CommonModule, RouterModule, UiCard, UiButton],
  template: `
    <div class="flex min-h-screen w-full items-center justify-center p-6">
      <lib-card class="max-w-3xl">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-surface-subtle pb-8 mb-8">
          <div class="flex items-center gap-4">
             <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary text-3xl">
                👤
             </div>
             <div>
                <h1 class="text-3xl font-bold tracking-tight text-text-base">Dashboard</h1>
                <p class="text-text-muted">Welcome back, <span class="font-bold text-brand-primary">{{ userDisplayName }}</span></p>
             </div>
          </div>
          <lib-button type="button" (click)="logout()" class="!w-auto !px-6 !h-12 !rounded-xl !bg-red-50 !text-red-600 hover:!bg-red-100 hover:shadow-none">
            Sign out
          </lib-button>
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-2xl bg-brand-primary/5 p-6 border border-brand-primary/10">
            <h3 class="text-lg font-bold text-brand-primary mb-2">Platform Status</h3>
            <ul class="space-y-3">
              <li class="flex items-center gap-2 text-sm text-text-base">
                <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
                Authenticated session active
              </li>
              <li class="flex items-center gap-2 text-sm text-text-base">
                <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
                API Client configured
              </li>
              <li class="flex items-center gap-2 text-sm text-text-base">
                <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
                Design system synchronized
              </li>
            </ul>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-text-base">Quick Start</h3>
            <p class="text-sm text-text-muted leading-relaxed">
              Use the Social Commerce platform to build your shop, manage products, and grow your audience.
            </p>
            <lib-button>Explore Studio</lib-button>
          </div>
        </div>
      </lib-card>
    </div>
  `,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get userDisplayName() {
    const user = this.authService.user();
    return user?.displayName || user?.username || user?.email || 'creator';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
