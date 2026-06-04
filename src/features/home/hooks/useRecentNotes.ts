import { useQuery } from '@tanstack/react-query';
import { notesService } from '../services/notes.service';

export function useRecentNotes() {
  return useQuery({
    queryKey: ['home', 'recent-notes'],
    queryFn: () => notesService.getRecent(),
    staleTime: 1000 * 60 * 5,
  });
}
