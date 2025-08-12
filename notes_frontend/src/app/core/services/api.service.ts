import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

/**
 * Generic API service to perform HTTP operations against the configured backend.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private get base(): string {
    return this.config.apiBaseUrl?.replace(/\/+$/, '') ?? '';
  }

  /**
   * Performs a GET request.
   */
  // PUBLIC_INTERFACE
  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const url = `${this.base}${path}`;
    const httpParams = params
      ? new HttpParams({ fromObject: Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) })
      : undefined;
    return this.http.get<T>(url, { params: httpParams });
  }

  /**
   * Performs a POST request.
   */
  // PUBLIC_INTERFACE
  post<T>(path: string, body: unknown): Observable<T> {
    const url = `${this.base}${path}`;
    return this.http.post<T>(url, body);
  }

  /**
   * Performs a PUT request.
   */
  // PUBLIC_INTERFACE
  put<T>(path: string, body: unknown): Observable<T> {
    const url = `${this.base}${path}`;
    return this.http.put<T>(url, body);
  }

  /**
   * Performs a DELETE request.
   */
  // PUBLIC_INTERFACE
  delete<T>(path: string): Observable<T> {
    const url = `${this.base}${path}`;
    return this.http.delete<T>(url);
  }
}
