import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes.service';
import { FormsModule } from '@angular/forms';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category.model';
import { Note } from '../../models/note.model';

/**
 * Note editor component with title, content, and category selection.
 */
@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css',
})
export class NoteEditorComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  private notes = inject(NotesService);

  categories: Category[] = [];
  noteId: string | null = null;
  title = '';
  content = '';
  categoryId: string | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    combineLatest([this.notes.selectedNote$, this.notes.categories$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([note, cats]) => {
        this.categories = cats;
        if (note) {
          this.noteId = note.id;
          this.title = note.title;
          this.content = note.content;
          this.categoryId = note.categoryId ?? null;
        } else {
          // New note draft
          this.noteId = null;
          this.title = '';
          this.content = '';
          this.categoryId = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // PUBLIC_INTERFACE
  save(): void {
    const payload: Pick<Note, 'title' | 'content' | 'categoryId'> = {
      title: this.title,
      content: this.content,
      categoryId: this.categoryId ?? null,
    };
    if (!this.noteId) {
      this.notes.createNote(payload).subscribe((note) => {
        this.notes.selectNote(note.id);
      });
    } else {
      this.notes.updateNote(this.noteId, payload).subscribe();
    }
  }

  // PUBLIC_INTERFACE
  delete(): void {
    if (!this.noteId) return;
    const g: any = globalThis as any;
    const ok = g && typeof g.confirm === 'function' ? g.confirm('Delete this note?') : true;
    if (!ok) return;
    this.notes.deleteNote(this.noteId).subscribe(() => {
      this.close.emit();
    });
  }

  // PUBLIC_INTERFACE
  cancel(): void {
    this.close.emit();
  }
}
