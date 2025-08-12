import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { SignupComponent } from './features/auth/signup.component';
import { LayoutComponent } from './layout/layout.component';
import { NotesPageComponent } from './features/notes/notes-page.component';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * Application routes:
 * - Authentication: login, signup
 * - Authenticated area (Layout + Notes)
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, title: 'Login - Personal Notes Organizer' },
  { path: 'signup', component: SignupComponent, title: 'Sign Up - Personal Notes Organizer' },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'notes' },
      { path: 'notes', component: NotesPageComponent, title: 'Notes - Personal Notes Organizer' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
