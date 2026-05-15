import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap, catchError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
}

export interface AuthResponse {
  accountId: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private _user = signal<User | null>(null);
  
  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());

  login(credentials: any) {
    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(data: any) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  refresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return of(null);

    return this.api.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, we might want to verify the token or fetch user profile from /profiles/me
      // For now, we'll trust the token existence as a starting point
      this._user.set({ id: 'current', email: 'user@example.com', username: 'current_user' });
    }
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    // Ideally fetch profile here or decode JWT
    this._user.set({ id: res.accountId, email: '', username: '' });
  }
}

