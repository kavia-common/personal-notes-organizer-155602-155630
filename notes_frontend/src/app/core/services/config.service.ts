import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Application configuration structure loaded at runtime.
 */
export interface AppConfig {
  /** Base URL for the backend REST API (e.g., https://api.example.com). */
  apiBaseUrl: string;
  /** Optional public site URL for redirects and external links. */
  siteUrl?: string;
}

/**
 * Service responsible for loading and exposing the application configuration.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);
  private _config: AppConfig | null = null;

  /**
   * Load configuration from the runtime asset file.
   * This must be called during APP_INITIALIZER before the app bootstraps.
   */
  // PUBLIC_INTERFACE
  async load(): Promise<void> {
    try {
      const cfg = await this.http
        .get<AppConfig>('/assets/app-config.json', { responseType: 'json' as const })
        .toPromise();
      this._config = cfg ?? { apiBaseUrl: '' };
    } catch {
      console.warn('ConfigService: Failed to load app-config.json, using defaults.');
      this._config = { apiBaseUrl: '' };
    }
  }

  /**
   * Returns the loaded configuration object.
   */
  // PUBLIC_INTERFACE
  get config(): AppConfig {
    if (!this._config) {
      // Safeguard; should be loaded by APP_INITIALIZER
      this._config = { apiBaseUrl: '' };
    }
    return this._config;
  }

  /**
   * Returns the configured API base URL or an empty string if unset.
   */
  // PUBLIC_INTERFACE
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl ?? '';
  }

  /**
   * Returns the configured site URL or undefined.
   */
  // PUBLIC_INTERFACE
  get siteUrl(): string | undefined {
    return this.config.siteUrl;
  }
}
