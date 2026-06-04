import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTasks } from '../hooks/useTasks';
import type { TaskStatus } from '../types/task.types';
import { AddTaskModal } from './AddTaskModal';
import { TaskList } from './TaskList';

type Filter = 'all' | TaskStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To do' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function TasksTab() {
  const { data: tasks = [], isLoading } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
    return [...base].sort((a, b) => {
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pd !== 0) return pd;
      if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [tasks, filter]);

  const counts: Record<Filter, number> = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Tasks</h2>
            <p className="text-xs text-muted-foreground">Global · all candidates</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-border px-6 py-2">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                filter === f.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
              <span className="ml-1.5 text-muted-foreground">({counts[f.id]})</span>
            </button>
          ))}
        </div>

        <TaskList tasks={filtered} isLoading={isLoading} />
      </div>

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
