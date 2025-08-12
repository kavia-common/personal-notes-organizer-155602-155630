import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes.service';
import { combineLatest, map } from 'rxjs';
import { Note } from '../../models/note.model';

/**
 * Displays notes filtered by search and category.
 */
@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css',
})
export class NoteListComponent {
  @Output() selectNote = new EventEmitter<void>();
  private notes = inject(NotesService);

  vm$ = combineLatest([
    this.notes.notes$,
    this.notes.search$,
    this.notes.selectedCategoryId$,
  ]).pipe(
    map(([notes, search, cat]) => {
      const s = search.trim().toLowerCase();
      let filtered = notes;
      if (cat) filtered = filtered.filter((n) => n.categoryId === cat);
      if (s) {
        filtered = filtered.filter(
          (n) => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s)
        );
      }
      // sort latest updated first
      filtered = filtered.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      return filtered;
    })
  );

  // PUBLIC_INTERFACE
  choose(note: Note): void {
    this.notes.selectNote(note.id);
    this.selectNote.emit();
  }
}
