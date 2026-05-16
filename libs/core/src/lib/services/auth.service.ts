import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap, catchError, of, switchMap } from 'rxjs';
import { urlConfig } from '../config/url-config';

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

  login(credentials: Record<string, unknown>) {
    return this.api.post<AuthResponse>(urlConfig.auth.login, credentials).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.fetchProfile())
    );
  }

  register(data: Record<string, unknown>) {
    return this.api.post<AuthResponse>(urlConfig.auth.register, data).pipe(
      tap(res => this.storeTokens(res)),
      switchMap(() => this.fetchProfile())
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

    return this.api.post<AuthResponse>(urlConfig.auth.refresh, { refreshToken }).pipe(
      tap(res => this.storeTokens(res)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      // Optimistically set a dummy user to unblock guards immediately
      this._user.set({ id: 'loading', email: '' });
      
      this.fetchProfile().subscribe({
        error: (err) => {
          console.error('[AuthService] checkAuth failed:', err);
          // Only clear state. error.interceptor handles actual 401 logouts.
          this._user.set(null); 
        }
      });
    }
  }

  private storeTokens(res: AuthResponse) {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
  }

  private fetchProfile() {
    return this.api.get<User>(urlConfig.profile.me).pipe(
      tap(user => this._user.set(user))
    );
  }
}

