import { formatDistanceToNow } from 'date-fns';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRetrieveEvaluation } from '../hooks/useEvaluationMutations';
import type { Evaluation } from '../types/evaluation.types';

interface DismissedTableProps {
  evaluations: Evaluation[];
}

export function DismissedTable({ evaluations }: DismissedTableProps) {
  const { mutate: retrieve, isPending } = useRetrieveEvaluation();

  if (evaluations.length === 0) return null;

  return (
    <div className="border-t border-border">
      <div className="px-6 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dismissed ({evaluations.length})
        </p>
      </div>
      <div className="divide-y divide-border">
        {evaluations.map(ev => (
          <div key={ev.id} className="flex items-center gap-4 px-6 py-3 opacity-60 hover:opacity-80 transition-opacity">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{ev.candidate.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {ev.jobTitle} · {formatDistanceToNow(ev.requestedAt, { addSuffix: true })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-xs"
              disabled={isPending}
              onClick={() => retrieve(ev.id)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retrieve
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
