"use client";

import { Note } from '../types/notes-types';

class NotesService {
  private storageKey = 'aura-notes';
  
  getNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    
    const storedNotes = localStorage.getItem(this.storageKey);
    return storedNotes ? JSON.parse(storedNotes) : [];
  }
  
  saveNotes(notes: Note[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.storageKey, JSON.stringify(notes));
  }
  
  getNote(id: string): Note | null {
    const notes = this.getNotes();
    return notes.find(note => note.id === id) || null;
  }
  
  createNote(note: Note): Note[] {
    const notes = this.getNotes();
    const updatedNotes = [note, ...notes];
    this.saveNotes(updatedNotes);
    return updatedNotes;
  }
  
  updateNote(updatedNote: Note): Note[] {
    const notes = this.getNotes();
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    this.saveNotes(updatedNotes);
    return updatedNotes;
  }
  
  deleteNote(id: string): Note[] {
    const notes = this.getNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    this.saveNotes(updatedNotes);
    return updatedNotes;
  }
}

export const notesService = new NotesService();