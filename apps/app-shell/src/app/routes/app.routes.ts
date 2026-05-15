import { Route } from '@angular/router';
import { DashboardPage, LoginPage, RegisterPage } from './pages';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', component: DashboardPage },
  { path: '**', redirectTo: 'login' },
];
