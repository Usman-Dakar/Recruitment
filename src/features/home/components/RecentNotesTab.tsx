import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentNotes } from '../hooks/useRecentNotes';
import { NoteCard } from './NoteCard';

export function RecentNotesTab() {
  const { data: notes = [], isLoading } = useRecentNotes();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      n =>
        n.content.toLowerCase().includes(q) ||
        n.candidateName.toLowerCase().includes(q) ||
        n.authorName.toLowerCase().includes(q),
    );
  }, [notes, search]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent Notes</h2>
          <p className="text-xs text-muted-foreground">Notes from all candidate profiles</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 w-52 pl-8 text-sm"
            placeholder="Search notes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 space-y-3">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {search ? 'No notes match your search.' : 'No notes yet.'}
          </p>
        ) : (
          filtered.map(note => <NoteCard key={note.id} note={note} />)
        )}
      </div>
    </div>
  );
}
