import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/services/theme.service';
import { NotesService } from '../core/services/notes.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Top navbar providing search, theme toggle and user controls.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  search = '';

  private theme = inject(ThemeService);
  private notes = inject(NotesService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // PUBLIC_INTERFACE
  onSearchChange(): void {
    this.notes.setSearch(this.search);
  }

  // PUBLIC_INTERFACE
  toggleTheme(): void {
    this.theme.toggle();
  }

  // PUBLIC_INTERFACE
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
