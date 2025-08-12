export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId?: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
