import { KanbanBoard } from '@/components/ui/kanban-board';
import type { KanbanColumnDef } from '@/components/ui/kanban-board';
import { useCandidates } from '@/features/candidates';
import type { Candidate } from '@/features/candidates';
import { usePipelineStages } from '@/features/settings/workflow';
import { JobKanbanCard } from './JobKanbanCard';

interface JobKanbanBoardProps {
  jobId: string;
}

export function JobKanbanBoard({ jobId }: JobKanbanBoardProps) {
  const { data: candidatesData, isLoading: loadingCandidates } = useCandidates({ jobId, perPage: 100 });
  const { data: stages, isLoading: loadingStages } = usePipelineStages();

  const candidates = candidatesData?.data ?? [];
  const sortedStages = (stages ?? []).slice().sort((a, b) => a.order - b.order);

  const columns: KanbanColumnDef<Candidate>[] = sortedStages.map(stage => ({
    id: stage.id,
    title: stage.name,
    color: stage.color,
    items: candidates.filter(c => (c.stageId ?? sortedStages[0]?.id) === stage.id),
  }));

  return (
    <KanbanBoard
      columns={columns}
      keyExtractor={c => c.id}
      renderCard={(candidate, cols) => <JobKanbanCard candidate={candidate} columns={cols} />}
      isLoading={loadingCandidates || loadingStages}
    />
  );
}
