import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NotesService } from '../core/services/notes.service';

/**
 * Application authenticated layout with navbar, sidebar and main area.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  private notes = inject(NotesService);

  ngOnInit(): void {
    // Initial data load for notes and categories
    this.notes.loadAll().subscribe();
  }
}
