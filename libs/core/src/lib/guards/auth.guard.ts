import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard to prevent unauthenticated users from accessing protected routes.
 * Redirects to /auth/login if not logged in.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // In a real app, this should check the signal or state
  // Since we rely on token existence for now, we check the computed signal or local storage
  if (authService.isAuthenticated() || localStorage.getItem('token')) {
    return true;
  }

  // Not logged in, redirect to login
  return router.createUrlTree(['/auth/login']);
};
