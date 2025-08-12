import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { AuthResponse } from '../../models/auth.model';
import { User } from '../../models/user.model';

/**
 * Service handling authentication state and requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'pno-token';
  private readonly userKey = 'pno-user';
  private api = inject(ApiService);
  private storage = inject(StorageService);
  private _user$ = new BehaviorSubject<User | null>(this.readUser());

  /**
   * Observable of the current authenticated user.
   */
  // PUBLIC_INTERFACE
  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  /**
   * Returns the current token if available.
   */
  // PUBLIC_INTERFACE
  get token(): string | null {
    return this.storage.get(this.tokenKey);
  }

  /**
   * Returns whether the user is authenticated.
   */
  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Perform user login with email/password.
   */
  // PUBLIC_INTERFACE
  login(email: string, password: string): Observable<User> {
    return this.api.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((resp) => this.persistAuth(resp)),
      map((resp) => resp.user),
      catchError((err) => {
        console.error('Login failed', err);
        throw err;
      })
    );
  }

  /**
   * Perform user signup.
   */
  // PUBLIC_INTERFACE
  signup(name: string, email: string, password: string): Observable<User> {
    return this.api.post<AuthResponse>('/api/auth/signup', { name, email, password }).pipe(
      tap((resp) => this.persistAuth(resp)),
      map((resp) => resp.user),
      catchError((err) => {
        console.error('Signup failed', err);
        throw err;
      })
    );
  }

  /**
   * Clears auth information and logs out.
   */
  // PUBLIC_INTERFACE
  logout(): void {
    this.storage.remove(this.tokenKey);
    this.storage.remove(this.userKey);
    this._user$.next(null);
  }

  private persistAuth(resp: AuthResponse): void {
    this.storage.set(this.tokenKey, resp.token);
    this.storage.set(this.userKey, JSON.stringify(resp.user));
    this._user$.next(resp.user);
  }

  private readUser(): User | null {
    const raw = this.storage.get(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
