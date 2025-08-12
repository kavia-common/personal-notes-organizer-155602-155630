import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../core/services/notes.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

/**
 * Sidebar listing categories and allowing creation.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private notes = inject(NotesService);

  categories$: Observable<Category[]> = this.notes.categories$;
  selectedCategoryId$ = this.notes.selectedCategoryId$;
  newCategoryName = '';

  // PUBLIC_INTERFACE
  selectCategory(id: string | null): void {
    this.notes.selectCategory(id);
  }

  // PUBLIC_INTERFACE
  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.notes.createCategory(name).subscribe(() => {
      this.newCategoryName = '';
    });
  }
}
