import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, StickyNote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useJobNotes } from '../hooks/useJobs';
import { useAddJobNote, useDeleteJobNote } from '../hooks/useJobMutations';

interface JobNotesProps { jobId: string; }

export function JobNotes({ jobId }: JobNotesProps) {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: notes, isLoading } = useJobNotes(jobId);
  const { mutate: addNote, isPending: isAdding } = useAddJobNote(jobId);
  const { mutate: deleteNote } = useDeleteJobNote(jobId);

  const handleAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addNote(trimmed, { onSuccess: () => setDraft('') });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
  };

  if (isLoading) return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-36" /><Skeleton className="h-10 w-full" /></div></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-6 overflow-y-auto">
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          placeholder="Add a note… (Ctrl+Enter to submit)"
          className="resize-none text-sm"
          rows={3}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-end">
          <Button size="sm" disabled={!draft.trim() || isAdding} onClick={handleAdd}>
            {isAdding ? 'Adding…' : 'Add note'}
          </Button>
        </div>
      </div>

      {!notes?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <StickyNote className="mb-3 h-8 w-8 opacity-40" />
          <p className="text-sm">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="flex gap-3 group">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">{note.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{note.authorName}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(note.createdAt, { addSuffix: true })}</span>
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
