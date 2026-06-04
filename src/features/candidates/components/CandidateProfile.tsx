import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Download, Mail, MapPin, Phone, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCandidateById } from '../hooks/useCandidates';
import { useAddProfileNote } from '../hooks/useCandidateMutations';
import type { CandidateOrigin, CandidateStatus } from '../types/candidate.types';

const STATUS_VARIANT: Record<CandidateStatus, 'default' | 'warning' | 'info' | 'success' | 'destructive'> = {
  new: 'info', in_review: 'warning', interview: 'default', offer: 'success', hired: 'success', rejected: 'destructive',
};
const STATUS_LABEL: Record<CandidateStatus, string> = {
  new: 'New', in_review: 'In Review', interview: 'Interview', offer: 'Offer', hired: 'Hired', rejected: 'Rejected',
};
const ORIGIN_LABEL: Record<CandidateOrigin, string> = {
  direct: 'Direct', referral: 'Referred', linkedin: 'LinkedIn', job_board: 'Job Board', agency: 'Agency',
};

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: candidate, isLoading } = useCandidateById(id ?? '');
  const { mutate: addNote, isPending: addingNote } = useAddProfileNote(id ?? '');
  const [noteText, setNoteText] = useState('');

  if (isLoading) return <div className="p-6 space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}</div>;
  if (!candidate) return <div className="p-6 text-center text-sm text-muted-foreground">Candidate not found.</div>;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(noteText.trim(), { onSuccess: () => setNoteText('') });
  };

  return (
    <div className="print-area mx-auto max-w-3xl p-6 space-y-6">
      {/* Toolbar — hidden when printing */}
      <div className="no-print flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2" onClick={() => navigate('/candidates')}>
          <ArrowLeft className="h-3.5 w-3.5" /> Candidates
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
          <Download className="h-3.5 w-3.5" />
          Save as PDF
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarFallback className="text-lg">{candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{candidate.name}</h1>
            <Badge variant={STATUS_VARIANT[candidate.status]}>{STATUS_LABEL[candidate.status]}</Badge>
            <Badge variant="secondary">{ORIGIN_LABEL[candidate.origin]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{candidate.position}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{candidate.email}</span>
            {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{candidate.phone}</span>}
            {candidate.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.location}</span>}
          </div>
        </div>
        <p className="shrink-0 text-xs text-muted-foreground">Applied {format(candidate.appliedAt, 'MMM d, yyyy')}</p>
      </div>

      {/* Roles */}
      {candidate.roles.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Roles</p>
          <div className="flex flex-wrap gap-2">
            {candidate.roles.map(r => <Badge key={r} variant="secondary">{r}</Badge>)}
          </div>
        </div>
      )}

      {/* Tags */}
      {candidate.tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {candidate.tags.map(tag => <span key={tag} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground">{tag}</span>)}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Notes</p>
        <div className="space-y-3">
          {candidate.profileNotes.map(note => (
            <div key={note.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold text-foreground">{note.authorName}</span>
                <span className="text-xs text-muted-foreground">· {format(note.createdAt, 'MMM d, yyyy')}</span>
              </div>
              <p className="text-sm text-foreground">{note.content}</p>
            </div>
          ))}
          <div className="no-print flex gap-2">
            <input
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Add a note…"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNote()}
            />
            <Button size="sm" variant="outline" onClick={handleAddNote} disabled={addingNote}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
