import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '../services/notes.service';

const NOTES_KEY = ['home', 'recent-notes'];

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      notesService.update(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useAddReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      notesService.addReply(noteId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}
