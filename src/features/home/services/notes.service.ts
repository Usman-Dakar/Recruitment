import type { CandidateNote } from '../types/note.types';
import { mockGetRecentNotes, mockUpdateNote, mockDeleteNote, mockAddReply } from './notes.mock';

export const notesService = {
  getRecent: (): Promise<CandidateNote[]> => mockGetRecentNotes(),
  update: (id: string, content: string): Promise<void> => mockUpdateNote(id, content),
  delete: (id: string): Promise<void> => mockDeleteNote(id),
  addReply: (noteId: string, content: string): Promise<void> => mockAddReply(noteId, content),
};
