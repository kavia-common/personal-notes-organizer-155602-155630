import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes.service';
import { NoteListComponent } from './note-list.component';
import { NoteEditorComponent } from './note-editor.component';

/**
 * Notes page container: shows the list and the editor panel.
 */
@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, NoteListComponent, NoteEditorComponent],
  templateUrl: './notes-page.component.html',
  styleUrl: './notes-page.component.css',
})
export class NotesPageComponent {
  showEditorOnMobile = signal(false);
  public notes = inject(NotesService);

  // PUBLIC_INTERFACE
  onCreateNew(): void {
    // Initialize an empty draft
    this.notes.selectNote(null);
    this.showEditorOnMobile.set(true);
  }

  // PUBLIC_INTERFACE
  onSelectNote(): void {
    this.showEditorOnMobile.set(true);
  }

  // PUBLIC_INTERFACE
  onCloseEditor(): void {
    this.showEditorOnMobile.set(false);
  }
}
