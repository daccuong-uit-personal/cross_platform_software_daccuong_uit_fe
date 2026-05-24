# Skill: API Integration & Type Safety

**Agent Owner:** API Integration Agent  
**Last Updated:** May 2026  
**Priority:** Critical for backend synchronization

---

## Overview

This skill ensures frontend seamlessly integrates with backend APIs through typed contracts, error handling, and consistent request/response patterns. The frontend **trusts** backend contract and avoids duplicating backend business logic.

## Core Principles

1. **Backend is Source of Truth**: Frontend consumes backend contract, never replicates business logic
2. **Type Safety First**: Generate TypeScript types from OpenAPI/Swagger
3. **Consistent Error Handling**: Standardized error interceptor
4. **Request/Response Normalization**: Map backend DTOs to frontend models
5. **Token & Auth Management**: Centralized in auth service and interceptor

---

## API Service Pattern

### HttpClient Wrapper (ApiService)

```typescript
// libs/core/src/lib/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = '/api'; // From environment
  
  /**
   * GET request
   * @param endpoint API endpoint (without base URL)
   * @param options Optional HttpClient options
   */
  get<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(catchError(err => this.handleError(err)));
  }
  
  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(catchError(err => this.handleError(err)));
  }
  
  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(catchError(err => this.handleError(err)));
  }
  
  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(catchError(err => this.handleError(err)));
  }
  
  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    this.errorService.handleError(error);
    return throwError(() => error);
  }
}
```

---

## Domain Service Pattern

### Service with API Integration

```typescript
// libs/domain/social/src/lib/services/social-post.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@fe/core';
import { Observable } from 'rxjs';

export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
}

export interface CreatePostRequest {
  content: string;
  mediaUrls?: string[];
}

export interface PostResponse {
  success: boolean;
  data: Post;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class SocialPostService {
  private readonly api = inject(ApiService);
  
  posts = signal<Post[]>([]);
  loading = signal(false);
  
  /**
   * Fetch posts for feed
   */
  getFeed(limit = 20, offset = 0): Observable<Post[]> {
    return this.api.get<Post[]>(
      `/social/posts?limit=${limit}&offset=${offset}`
    );
  }
  
  /**
   * Create a new post
   */
  createPost(data: CreatePostRequest): Observable<PostResponse> {
    return this.api.post<PostResponse>('/social/posts', data);
  }
  
  /**
   * Like a post
   */
  likePost(postId: string): Observable<{ success: boolean }> {
    return this.api.post(`/social/posts/${postId}/like`, {});
  }
  
  /**
   * Delete a post
   */
  deletePost(postId: string): Observable<{ success: boolean }> {
    return this.api.delete(`/social/posts/${postId}`);
  }
}
```

---

## Error Handling

### Error Model

```typescript
// libs/core/src/lib/models/error.model.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  traceId?: string;
}

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Error Interceptor

```typescript
// libs/core/src/lib/interceptors/error.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly errorService = inject(ErrorService);
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry({
        count: 1,
        delay: (error, retryCount) => {
          // Exponential backoff
          return throwError(() => 
            new Error(`Retry ${retryCount} failed`)
          );
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Map backend errors to app errors
        const appError = this.mapHttpError(error);
        this.errorService.setError(appError);
        return throwError(() => appError);
      })
    );
  }
  
  private mapHttpError(error: HttpErrorResponse) {
    let code = 'UNKNOWN_ERROR';
    let message = 'An unexpected error occurred';
    
    if (error.error?.code) {
      code = error.error.code;
      message = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          code = 'UNAUTHORIZED';
          message = 'Authentication required';
          break;
        case 403:
          code = 'FORBIDDEN';
          message = 'Access denied';
          break;
        case 404:
          code = 'NOT_FOUND';
          message = 'Resource not found';
          break;
        case 422:
          code = 'VALIDATION_ERROR';
          message = error.error?.message || 'Invalid input';
          break;
        case 500:
          code = 'SERVER_ERROR';
          message = 'Server error occurred';
          break;
      }
    }
    
    return {
      code,
      message,
      statusCode: error.status,
      details: error.error?.details,
      timestamp: new Date().toISOString(),
      traceId: error.headers.get('x-trace-id') || undefined
    };
  }
}
```

---

## Authentication Integration

### Auth Service Pattern

```typescript
// libs/core/src/lib/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
  
  private tokenSubject = new BehaviorSubject<AuthToken | null>(
    this.getStoredToken()
  );
  token$ = this.tokenSubject.asObservable();
  
  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<{ user: User; token: AuthToken }> {
    return this.http.post<{ user: User; token: AuthToken }>('/api/auth/login', {
      email,
      password
    }).pipe(
      tap(({ user, token }) => {
        this.setToken(token);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }
  
  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<{ user: User; token: AuthToken }> {
    return this.http.post<{ user: User; token: AuthToken }>('/api/auth/register', data)
      .pipe(
        tap(({ user, token }) => {
          this.setToken(token);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        })
      );
  }
  
  /**
   * Logout
   */
  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', {}).pipe(
      tap(() => {
        this.clearAuth();
      })
    );
  }
  
  /**
   * Get current token
   */
  getToken(): AuthToken | null {
    return this.tokenSubject.value;
  }
  
  private setToken(token: AuthToken) {
    localStorage.setItem('auth_token', JSON.stringify(token));
    this.tokenSubject.next(token);
  }
  
  private getStoredToken(): AuthToken | null {
    const token = localStorage.getItem('auth_token');
    return token ? JSON.parse(token) : null;
  }
  
  private clearAuth() {
    localStorage.removeItem('auth_token');
    this.tokenSubject.next(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName?: string;
}
```

### Auth Interceptor

```typescript
// libs/core/src/lib/interceptors/auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
    }
    
    return next.handle(request);
  }
}
```

---

## Type Generation from OpenAPI

### Setup OpenAPI Generator

```bash
# Install openapi-generator
npm install -D @openapitools/openapi-generator-cli

# Generate types from backend Swagger
npx openapi-generator-cli generate \
  -i http://localhost:3000/api-docs/swagger.json \
  -g typescript-fetch \
  -o libs/core/src/lib/models/generated
```

### Generated Type Usage

```typescript
// Use generated types from OpenAPI
import { CreatePostRequest, PostResponse } from '../models/generated';

@Injectable({ providedIn: 'root' })
export class PostService {
  createPost(data: CreatePostRequest): Observable<PostResponse> {
    return this.api.post<PostResponse>('/posts', data);
  }
}
```

---

## API Endpoint Conventions

### RESTful Patterns

```typescript
// GET - Fetch resources
GET /api/posts                    // List posts
GET /api/posts/{postId}           // Get single post
GET /api/posts?limit=20&offset=0  // Pagination

// POST - Create resources
POST /api/posts                   // Create post
POST /api/posts/{postId}/like     // Action endpoint

// PUT - Update resources
PUT /api/posts/{postId}           // Full update

// PATCH - Partial update
PATCH /api/posts/{postId}         // Partial update

// DELETE - Remove resources
DELETE /api/posts/{postId}        // Delete post
```

---

## Response Standardization

### Expected Backend Response Format

```typescript
// Success response
{
  "success": true,
  "data": { /* resource data */ },
  "meta": {
    "pagination": { "total": 100, "page": 1, "limit": 20 },
    "timestamp": "2026-05-23T10:30:00Z",
    "traceId": "abc-123-def"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { "email": ["Invalid email format"] }
  }
}
```

---

## Best Practices

### ✅ DO

- Use typed observables from API service
- Implement error interceptor for consistent error handling
- Use auth interceptor for token injection
- Generate types from backend OpenAPI/Swagger
- Map backend DTOs to frontend models
- Log errors with trace IDs
- Implement retry logic with exponential backoff
- Use environment config for API base URL

### ❌ DON'T

- Hardcode API URLs in services
- Assume backend responses without typing
- Duplicate backend validation logic
- Forget to handle 401/403 auth errors
- Make API calls directly from components
- Ignore error responses
- Store sensitive tokens in localStorage without encryption

---

## References

- [Backend CRUD Modules](../api/backend-contracts.md)
- [Frontend Playbook](../ai-context/frontend-ai-playbook.md)
- [API Service Implementation](../../libs/core/src/lib/services/api.service.ts)
- [Angular HttpClient Docs](https://angular.io/guide/http)
