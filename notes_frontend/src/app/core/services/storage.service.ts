import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Safe storage abstraction to handle SSR gracefully.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId: object = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private get ls(): Storage | null {
    if (!this.isBrowser) return null;
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Retrieve a value from localStorage by key.
   */
  // PUBLIC_INTERFACE
  get(key: string): string | null {
    const ls = this.ls;
    if (!ls) return null;
    try {
      return ls.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Store a key/value pair in localStorage.
   */
  // PUBLIC_INTERFACE
  set(key: string, value: string): void {
    const ls = this.ls;
    if (!ls) return;
    try {
      ls.setItem(key, value);
    } catch {
      // ignore
    }
  }

  /**
   * Remove a key from localStorage.
   */
  // PUBLIC_INTERFACE
  remove(key: string): void {
    const ls = this.ls;
    if (!ls) return;
    try {
      ls.removeItem(key);
    } catch {
      // ignore
    }
  }

  /**
   * Clear localStorage.
   */
  // PUBLIC_INTERFACE
  clear(): void {
    const ls = this.ls;
    if (!ls) return;
    try {
      ls.clear();
    } catch {
      // ignore
    }
  }
}
