import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StorageService } from './storage.service';

/**
 * Manages application theme (light/dark) using HTML data attribute.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'pno-theme';
  private storage = inject(StorageService);
  private document: Document | null = inject(DOCUMENT, { optional: true });

  /**
   * Get current theme from storage or default to light.
   */
  // PUBLIC_INTERFACE
  getTheme(): 'light' | 'dark' {
    const saved = this.storage.get(this.key);
    return saved === 'dark' ? 'dark' : 'light';
  }

  /**
   * Apply the specified theme and persist it.
   */
  // PUBLIC_INTERFACE
  setTheme(theme: 'light' | 'dark'): void {
    const doc = this.document ?? globalThis.document ?? null;
    if (doc?.documentElement) {
      doc.documentElement.setAttribute('data-theme', theme);
    }
    this.storage.set(this.key, theme);
  }

  /**
   * Toggle between light and dark themes.
   */
  // PUBLIC_INTERFACE
  toggle(): void {
    this.setTheme(this.getTheme() === 'light' ? 'dark' : 'light');
  }
}
