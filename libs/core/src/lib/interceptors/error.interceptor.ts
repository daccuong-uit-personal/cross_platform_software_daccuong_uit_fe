import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';

/**
 * Global Error Interceptor
 * Standardizes error handling and manages authentication failures (401/403).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      // Extract error message from Backend response if available
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Fallback Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }

      // 401 Unauthorized - Token Expired
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        console.warn('[API Error] 401 Unauthorized, attempting to refresh token...');
        
        // Attempt token refresh
        return authService.refresh().pipe(
          switchMap((res) => {
            if (res) {
              // Retry original request with new token
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken}` }
              });
              return next(cloned);
            } else {
              // Refresh failed, logout
              authService.logout();
              toast.error('Session expired, please login again.');
              return throwError(() => new Error('Session expired, please login again.'));
            }
          }),
          catchError((err) => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }

      // Globally toast errors (except 401s which are either refreshed above or ignored)
      if (error.status !== 401) {
        toast.error(errorMessage);
      }

      console.error('[API Error]', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};


