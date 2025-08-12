import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Note } from '../../models/note.model';
import { Category } from '../../models/category.model';

/**
 * Manages notes and categories data and UI state.
 */
@Injectable({ providedIn: 'root' })
export class NotesService {
  private api = inject(ApiService);

  private _notes$ = new BehaviorSubject<Note[]>([]);
  private _categories$ = new BehaviorSubject<Category[]>([]);
  private _selectedNoteId$ = new BehaviorSubject<string | null>(null);
  private _selectedCategoryId$ = new BehaviorSubject<string | null>(null);
  private _search$ = new BehaviorSubject<string>('');

  // PUBLIC_INTERFACE
  get notes$(): Observable<Note[]> {
    return this._notes$.asObservable();
  }

  // PUBLIC_INTERFACE
  get categories$(): Observable<Category[]> {
    return this._categories$.asObservable();
  }

  // PUBLIC_INTERFACE
  get selectedNote$(): Observable<Note | null> {
    return this._selectedNoteId$.pipe(
      switchMap((id) =>
        this._notes$.pipe(map((ns) => (id ? ns.find((n) => n.id === id) ?? null : null)))
      )
    );
  }

  // PUBLIC_INTERFACE
  get selectedCategoryId$(): Observable<string | null> {
    return this._selectedCategoryId$.asObservable();
  }

  // PUBLIC_INTERFACE
  get search$(): Observable<string> {
    return this._search$.asObservable();
  }

  /**
   * Load notes and categories from the backend.
   */
  // PUBLIC_INTERFACE
  loadAll(): Observable<void> {
    return this.api.get<Note[]>('/api/notes').pipe(
      tap((notes) => this._notes$.next(notes)),
      switchMap(() => this.api.get<Category[]>('/api/categories')),
      tap((cats) => this._categories$.next(cats)),
      map(() => void 0),
      catchError((err) => {
        console.error('Failed to load data', err);
        this._notes$.next([]);
        this._categories$.next([]);
        return of(void 0);
      })
    );
  }

  /**
   * Create a new note.
   */
  // PUBLIC_INTERFACE
  createNote(partial: Pick<Note, 'title' | 'content' | 'categoryId'>): Observable<Note> {
    return this.api.post<Note>('/api/notes', partial).pipe(
      tap((note) => this._notes$.next([note, ...this._notes$.value]))
    );
  }

  /**
   * Update an existing note.
   */
  // PUBLIC_INTERFACE
  updateNote(id: string, changes: Partial<Note>): Observable<Note> {
    return this.api.put<Note>(`/api/notes/${id}`, changes).pipe(
      tap((updated) =>
        this._notes$.next(this._notes$.value.map((n) => (n.id === id ? updated : n)))
      )
    );
  }

  /**
   * Delete a note by id.
   */
  // PUBLIC_INTERFACE
  deleteNote(id: string): Observable<void> {
    return this.api.delete<void>(`/api/notes/${id}`).pipe(
      tap(() => {
        this._notes$.next(this._notes$.value.filter((n) => n.id !== id));
        if (this._selectedNoteId$.value === id) {
          this._selectedNoteId$.next(null);
        }
      })
    );
  }

  /**
   * Create a new category.
   */
  // PUBLIC_INTERFACE
  createCategory(name: string): Observable<Category> {
    return this.api.post<Category>('/api/categories', { name }).pipe(
      tap((cat) => this._categories$.next([...this._categories$.value, cat]))
    );
  }

  /**
   * Rename a category.
   */
  // PUBLIC_INTERFACE
  renameCategory(id: string, name: string): Observable<Category> {
    return this.api.put<Category>(`/api/categories/${id}`, { name }).pipe(
      tap((updated) =>
        this._categories$.next(
          this._categories$.value.map((c) => (c.id === id ? updated : c))
        )
      )
    );
  }

  /**
   * Delete a category.
   */
  // PUBLIC_INTERFACE
  deleteCategory(id: string): Observable<void> {
    return this.api.delete<void>(`/api/categories/${id}`).pipe(
      tap(() => {
        this._categories$.next(this._categories$.value.filter((c) => c.id !== id));
        // Unassign notes from this category
        const notes = this._notes$.value.map((n) =>
          n.categoryId === id ? { ...n, categoryId: null } : n
        );
        this._notes$.next(notes);
        if (this._selectedCategoryId$.value === id) {
          this._selectedCategoryId$.next(null);
        }
      })
    );
  }

  /**
   * Select a note by id for editing.
   */
  // PUBLIC_INTERFACE
  selectNote(id: string | null): void {
    this._selectedNoteId$.next(id);
  }

  /**
   * Select the active category filter.
   */
  // PUBLIC_INTERFACE
  selectCategory(id: string | null): void {
    this._selectedCategoryId$.next(id);
  }

  /**
   * Update the search string used to filter notes.
   */
  // PUBLIC_INTERFACE
  setSearch(term: string): void {
    this._search$.next(term);
  }
}
