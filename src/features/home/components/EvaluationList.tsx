import { formatDistanceToNow } from 'date-fns';
import { ClipboardList, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useDismissEvaluation } from '../hooks/useEvaluationMutations';
import type { Evaluation } from '../types/evaluation.types';

interface EvaluationListProps {
  evaluations: Evaluation[];
  isLoading: boolean;
  onSelect: (evaluation: Evaluation, index: number) => void;
}

export function EvaluationList({ evaluations, isLoading, onSelect }: EvaluationListProps) {
  const { mutate: dismiss, isPending: dismissing } = useDismissEvaluation();

  if (isLoading) {
    return (
      <div className="space-y-2 p-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
      </div>
    );
  }

  if (evaluations.length === 0) {
    return <EmptyState icon={ClipboardList} title="No pending evaluations" className="m-6" />;
  }

  return (
    <div className="divide-y divide-border">
      {evaluations.map((ev, idx) => (
        <div
          key={ev.id}
          className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
          onClick={() => onSelect(ev, idx)}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback>{ev.candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">{ev.candidate.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {ev.candidate.position} · {ev.jobTitle}
            </p>
          </div>

          <div className="hidden sm:block text-right shrink-0">
            <p className="text-xs text-muted-foreground">
              Requested by <span className="text-foreground">{ev.requestedBy}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(ev.requestedAt, { addSuffix: true })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            disabled={dismissing}
            onClick={e => { e.stopPropagation(); dismiss(ev.id); }}
            aria-label="Dismiss evaluation"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
