import { ArrowLeft, Mail, MapPin, Phone, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSearchParams } from 'react-router-dom';
import { useCandidateById } from '@/features/candidates/hooks/useCandidates';
import type { Evaluation } from '../types/evaluation.types';
import { EvaluationForm } from './EvaluationForm';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const ORIGIN_LABEL: Record<string, string> = {
  direct: 'Direct', referral: 'Referral',
  linkedin: 'LinkedIn', job_board: 'Job board', agency: 'Agency',
};

interface CandidatePanelProps {
  candidateId: string;
  candidateName: string;
}

function CandidatePanel({ candidateId, candidateName }: CandidatePanelProps) {
  const { data: candidate, isLoading } = useCandidateById(candidateId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  }

  const name = candidate?.name ?? candidateName;
  const initials = getInitials(name);

  return (
    <div className="flex flex-col gap-5 p-6 overflow-y-auto">
      {/* Identity */}
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{candidate?.position ?? '—'}</p>
          {candidate && (
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="secondary" className="text-xs">{candidate.status.replace('_', ' ')}</Badge>
              <span className="text-xs text-muted-foreground">
                {ORIGIN_LABEL[candidate.origin] ?? candidate.origin}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contact */}
      {candidate && (
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Contact
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{candidate.phone}</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{candidate.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 shrink-0" />
            <span>Applied {format(candidate.appliedAt, 'MMM d, yyyy')}</span>
          </div>
          {candidate.referredBy && (
            <div className="text-xs text-muted-foreground">
              Referred by <span className="font-medium text-foreground">{candidate.referredBy}</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {candidate && candidate.tags.length > 0 && (
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Tag className="h-3 w-3" /> Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Roles */}
      {candidate && candidate.roles.length > 0 && (
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Roles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.roles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">{role}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Profile notes count */}
      {candidate && candidate.profileNotes.length > 0 && (
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Profile notes
          </p>
          <p className="text-sm">
            {candidate.profileNotes.length} note{candidate.profileNotes.length !== 1 ? 's' : ''} on candidate profile
          </p>
          <p className="text-xs text-muted-foreground">
            View the full candidate profile for details.
          </p>
        </div>
      )}

      {/* No data fallback */}
      {!candidate && !isLoading && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">Candidate profile unavailable.</p>
        </div>
      )}
    </div>
  );
}

interface EvaluationPanelProps {
  evaluation: Evaluation;
  onBack: () => void;
  onComplete: () => void;
}

export function EvaluationPanel({ evaluation, onBack, onComplete }: EvaluationPanelProps) {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumb header */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={onBack}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Evaluations
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{evaluation.candidate.name}</span>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSearchParams({})}>
            Overview
          </Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={onBack}>
            Evaluations
          </Button>
        </div>
      </div>

      {/* Dual panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Candidate info */}
        <div className="w-[45%] overflow-y-auto border-r border-border bg-muted/10">
          <div className="border-b border-border px-6 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Candidate — {evaluation.candidate.name}
            </p>
          </div>
          <CandidatePanel
            candidateId={evaluation.candidate.id}
            candidateName={evaluation.candidate.name}
          />
        </div>

        {/* Right: Evaluation form */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <EvaluationForm evaluation={evaluation} onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
}
