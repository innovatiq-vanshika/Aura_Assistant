export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface NoteTag {
  id: string;
  name: string;
  color: string;
}