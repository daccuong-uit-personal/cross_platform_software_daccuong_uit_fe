import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Global Error Interceptor
 * Standardizes error handling and manages authentication failures (401/403).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        // Handle specific status codes
        if (error.status === 401) {
          // Token might be expired, trigger logout or refresh
          authService.logout();
          // Optionally redirect to login or attempt refresh
        }
      }

      console.error('[API Error]', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
