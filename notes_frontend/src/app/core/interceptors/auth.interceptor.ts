import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor to add Authorization header when token exists.
 */
@Injectable({ providedIn: 'root' })
export class AuthInterceptor {
  private auth = inject(AuthService);

  /**
   * Intercepts HTTP requests and attaches the Bearer token if present.
   */
  // PUBLIC_INTERFACE
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token;
    if (!token) return next.handle(req);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(authReq);
  }
}
