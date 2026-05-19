import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { appConfig } from '../config/app-config';
import { CacheService } from './cache.service';

export interface ApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  context?: HttpContext;
  cache?: boolean | number; // Enable cache or specify TTL in ms
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheService);
  private readonly apiBase = appConfig.apiUrl;

  private unwrap<T>(source: Observable<unknown>): Observable<T> {
    return source.pipe(
      map(res => {
        const response = res as Record<string, unknown>;
        // Handle double wrapping: { data: { data: { ... } } }
        if (response && response['data'] && (response['data'] as Record<string, unknown>)['data'] !== undefined) {
          return (response['data'] as Record<string, unknown>)['data'] as T;
        }
        // Handle single wrapping: { data: { ... } }
        if (response && response['data'] !== undefined) {
          return response['data'] as T;
        }
        return res as T;
      })
    );
  }

  /**
   * Remove cache option from ApiOptions to avoid passing to HttpClient
   */
  private sanitizeOptions(options?: ApiOptions): Omit<ApiOptions, 'cache'> {
    if (!options) return {};
    const { cache, ...sanitized } = options;
    return sanitized;
  }

  /**
   * Generate cache key from path and params
   */
  private getCacheKey(path: string, params?: HttpParams | Record<string, unknown>): string {
    let key = path;
    if (params) {
      if (params instanceof HttpParams) {
        key += `?${params.toString()}`;
      } else {
        key += `?${JSON.stringify(params)}`;
      }
    }
    return key;
  }

  get<T>(path: string, options?: ApiOptions): Observable<T> {
    const cacheKey = this.getCacheKey(path, options?.params);
    const cacheConfig = options?.cache;

    // Check cache first
    if (cacheConfig) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) {
        return of(cached);
      }
    }

    // Fetch from API
    const sanitized = this.sanitizeOptions(options);
    return this.unwrap<T>(this.http.get(`${this.apiBase}${path}`, sanitized)).pipe(
      map(data => {
        // Store in cache if enabled
        if (cacheConfig) {
          const ttl = typeof cacheConfig === 'number' ? cacheConfig : undefined;
          this.cache.set(cacheKey, data, ttl);
        }
        return data;
      })
    );
  }

  post<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    const sanitized = this.sanitizeOptions(options);
    return this.unwrap<T>(this.http.post(`${this.apiBase}${path}`, body, sanitized));
  }

  put<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    const sanitized = this.sanitizeOptions(options);
    return this.unwrap<T>(this.http.put(`${this.apiBase}${path}`, body, sanitized));
  }

  patch<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    const sanitized = this.sanitizeOptions(options);
    return this.unwrap<T>(this.http.patch(`${this.apiBase}${path}`, body, sanitized));
  }

  delete<T>(path: string, options?: ApiOptions): Observable<T> {
    const sanitized = this.sanitizeOptions(options);
    return this.unwrap<T>(this.http.delete(`${this.apiBase}${path}`, sanitized));
  }
}

