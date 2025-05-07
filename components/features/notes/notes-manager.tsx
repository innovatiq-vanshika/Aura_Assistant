"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Trash2, Tag, Calendar, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Note } from '@/lib/types/notes-types';
import { notesService } from '@/lib/services/notes-service';

export default function NotesManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    // Load notes
    const savedNotes = notesService.getNotes();
    setNotes(savedNotes);
  }, []);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    notesService.saveNotes(updatedNotes);
    
    // Select the new note and enter edit mode
    setSelectedNote(newNote);
    setEditMode(true);
    setEditedTitle(newNote.title);
    setEditedContent(newNote.content);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    notesService.saveNotes(updatedNotes);
    
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setEditMode(false);
    }
  };

  const saveChanges = () => {
    if (!selectedNote) return;
    
    const updatedNote: Note = {
      ...selectedNote,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    );
    
    setNotes(updatedNotes);
    setSelectedNote(updatedNote);
    notesService.saveNotes(updatedNotes);
    setEditMode(false);
  };

  const cancelEdit = () => {
    if (selectedNote) {
      setEditedTitle(selectedNote.title);
      setEditedContent(selectedNote.content);
    }
    setEditMode(false);
  };

  const filteredNotes = notes.filter(note => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerSearchTerm) ||
      note.content.toLowerCase().includes(lowerSearchTerm)
    );
  });

  // Formats the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <Button size="sm" onClick={createNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-18rem)]">
            <div className="px-4 pb-4 space-y-2">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedNote && selectedNote.id === note.id
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setSelectedNote(note);
                      setEditedTitle(note.title);
                      setEditedContent(note.content);
                      setEditMode(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{note.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedNote(note);
                              setEditedTitle(note.title);
                              setEditedContent(note.content);
                              setEditMode(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {note.content || 'No content'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(note.updatedAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No notes found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        {selectedNote ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {editMode ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-semibold"
                    placeholder="Note title"
                  />
                ) : (
                  <CardTitle>{selectedNote.title}</CardTitle>
                )}
                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <Button size="sm" onClick={saveChanges}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditMode(true)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => deleteNote(selectedNote.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Last updated {formatDate(selectedNote.updatedAt)}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-24rem)]">
                {editMode ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[300px] border-none focus-visible:ring-0 resize-none"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none">
                    {selectedNote.content || (
                      <p className="text-muted-foreground italic">No content</p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <Pencil className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No Note Selected</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Select a note from the list or create a new one to get started
            </p>
            <Button className="mt-4" onClick={createNewNote}>
              <Plus className="h-4 w-4 mr-2" />
              Create a New Note
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}