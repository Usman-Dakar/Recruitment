import { isToday, isTomorrow, format, isPast } from 'date-fns';
import { CheckCircle2, Circle, Clock, ListTodo, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useDeleteTask, useUpdateTaskStatus } from '../hooks/useTaskMutations';
import type { Task } from '../types/task.types';

const PRIORITY_VARIANTS = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
} as const;

const STATUS_ICONS = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
};

function dueDateLabel(date: Date): { label: string; overdue: boolean } {
  if (isToday(date)) return { label: 'Today', overdue: false };
  if (isTomorrow(date)) return { label: 'Tomorrow', overdue: false };
  if (isPast(date)) return { label: format(date, 'MMM d'), overdue: true };
  return { label: format(date, 'MMM d'), overdue: false };
}

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState icon={ListTodo} title="No tasks found" className="m-6" />;
  }

  const cycleStatus = (task: Task) => {
    const next: Record<Task['status'], Task['status']> = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
    updateStatus({ id: task.id, status: next[task.status] });
  };

  return (
    <div className="divide-y divide-border">
      {tasks.map(task => {
        const Icon = STATUS_ICONS[task.status];
        const done = task.status === 'done';

        return (
          <div key={task.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors">
            <button
              onClick={() => cycleStatus(task)}
              aria-label="Toggle status"
              className={cn(
                'shrink-0 transition-colors',
                task.status === 'done' ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <p className={cn('text-sm font-medium truncate', done && 'line-through text-muted-foreground')}>
                {task.title}
              </p>
              {task.candidateName && (
                <p className="text-xs text-muted-foreground truncate">{task.candidateName}</p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={PRIORITY_VARIANTS[task.priority]} className="text-xs capitalize">
                {task.priority}
              </Badge>

              {task.dueDate && (() => {
                const { label, overdue } = dueDateLabel(task.dueDate);
                return (
                  <span className={cn('text-xs', overdue && !done ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                    {label}
                  </span>
                );
              })()}

              <button
                onClick={() => deleteTask(task.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
