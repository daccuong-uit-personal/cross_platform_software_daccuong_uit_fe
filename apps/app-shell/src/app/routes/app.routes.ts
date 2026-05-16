import { Route } from '@angular/router';
import { authGuard } from '@fe/core';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  {
    path: 'auth',
    loadChildren: () => import('@fe/features/auth').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@fe/features/dashboard').then((m) => m.dashboardRoutes),
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  { path: '**', redirectTo: 'auth/login' },
];

