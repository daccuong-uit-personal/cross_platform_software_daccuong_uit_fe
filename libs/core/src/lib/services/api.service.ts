import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { appConfig } from '../config/app-config';

export interface ApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
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

  get<T>(path: string, options?: ApiOptions): Observable<T> {
    return this.unwrap<T>(this.http.get(`${this.apiBase}${path}`, options));
  }

  post<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    return this.unwrap<T>(this.http.post(`${this.apiBase}${path}`, body, options));
  }

  put<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    return this.unwrap<T>(this.http.put(`${this.apiBase}${path}`, body, options));
  }

  patch<T>(path: string, body: unknown = {}, options?: ApiOptions): Observable<T> {
    return this.unwrap<T>(this.http.patch(`${this.apiBase}${path}`, body, options));
  }

  delete<T>(path: string, options?: ApiOptions): Observable<T> {
    return this.unwrap<T>(this.http.delete(`${this.apiBase}${path}`, options));
  }
}

