import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { KanbanColumnDef } from '@/components/ui/kanban-board';
import { useMoveToStage } from '@/features/candidates';
import type { Candidate } from '@/features/candidates';

const STATUS_VARIANT = {
  new: 'info', in_review: 'warning', interview: 'default',
  offer: 'success', hired: 'success', rejected: 'destructive',
} as const;

const STATUS_LABEL = {
  new: 'New', in_review: 'In Review', interview: 'Interview',
  offer: 'Offer', hired: 'Hired', rejected: 'Rejected',
} as const;

interface JobKanbanCardProps {
  candidate: Candidate;
  columns: KanbanColumnDef<Candidate>[];
}

export function JobKanbanCard({ candidate, columns }: JobKanbanCardProps) {
  const navigate = useNavigate();
  const { mutate: moveToStage, isPending } = useMoveToStage();

  return (
    <div className="bg-white rounded-lg border border-border p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2.5 cursor-pointer group">
      <div className="flex items-start justify-between gap-2" onClick={() => navigate(`/candidates/${candidate.id}`)}>
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-[10px]">{candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{candidate.name}</p>
            <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[candidate.status]} className="text-[10px] shrink-0 mt-0.5">
          {STATUS_LABEL[candidate.status]}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Applied {format(candidate.appliedAt, 'MMM d')}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            disabled={isPending}
            onClick={e => e.stopPropagation()}
          >
            Move <ChevronRight className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {columns
              .filter(col => col.id !== candidate.stageId)
              .map(col => (
                <DropdownMenuItem
                  key={col.id}
                  onClick={e => { e.stopPropagation(); moveToStage({ candidateId: candidate.id, stageId: col.id }); }}
                >
                  {col.color && (
                    <span className="h-2 w-2 rounded-full shrink-0 mr-2" style={{ backgroundColor: col.color }} />
                  )}
                  {col.title}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
