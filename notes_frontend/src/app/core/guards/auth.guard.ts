import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that ensures a user is authenticated.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  /**
   * Determines whether a route can be activated based on authentication.
   */
  // PUBLIC_INTERFACE
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
