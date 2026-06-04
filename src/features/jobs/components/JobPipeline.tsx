import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CandidateList, ColumnManager, DEFAULT_COLUMNS } from '@/features/candidates';
import { useCandidates } from '@/features/candidates';
import type { TableColumn } from '@/features/candidates';
import { JobKanbanBoard } from './JobKanbanBoard';

type ViewMode = 'table' | 'kanban';

interface JobPipelineProps { jobId: string; }

export function JobPipeline({ jobId }: JobPipelineProps) {
  const [view, setView] = useState<ViewMode>('kanban');
  const [columns, setColumns] = useState<TableColumn[]>(DEFAULT_COLUMNS);
  const { data, isLoading } = useCandidates({ jobId });

  const toggleColumn = (id: string) =>
    setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5 px-2.5"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-xs">Board</span>
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5 px-2.5"
            onClick={() => setView('table')}
          >
            <List className="h-3.5 w-3.5" />
            <span className="text-xs">List</span>
          </Button>
        </div>

        {view === 'table' && <ColumnManager columns={columns} onChange={toggleColumn} />}
      </div>

      {view === 'kanban' ? (
        <JobKanbanBoard jobId={jobId} />
      ) : (
        <CandidateList
          candidates={data?.data ?? []}
          isLoading={isLoading}
          columns={columns}
        />
      )}
    </div>
  );
}
