import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MoreHorizontal, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useUpdateJobStatus, useDeleteJob } from '../hooks/useJobMutations';
import { JobStatusBadge } from './JobStatusBadge';
import type { Job } from '../types/job.types';

const TYPE_LABELS: Record<Job['type'], string> = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship' };
const STATUS_BORDER: Record<Job['status'], string> = { listed: 'border-l-emerald-500', published: 'border-l-primary', draft: 'border-l-slate-300', archived: 'border-l-slate-200' };

type ConfirmAction = { type: 'archive' | 'delete'; jobId: string; jobTitle: string } | null;

interface JobListProps { jobs: Job[]; isLoading: boolean; }

export function JobList({ jobs, isLoading }: JobListProps) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  if (isLoading) return <JobsSkeleton />;

  if (!jobs.length) return (
    <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your filters or create a new job." className="m-6" />
  );

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'archive') {
      updateStatus({ id: confirm.jobId, status: 'archived' }, { onSuccess: () => setConfirm(null) });
    } else {
      deleteJob(confirm.jobId, { onSuccess: () => setConfirm(null) });
    }
  };

  return (
    <>
      <div className="divide-y divide-border overflow-y-auto">
        {jobs.map(job => (
          <div
            key={job.id}
            className={cn('flex items-center gap-4 border-l-4 px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer', STATUS_BORDER[job.status])}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{job.title}</span>
                <JobStatusBadge status={job.status} />
              </div>
              <p className="text-xs text-muted-foreground">{job.department} · {job.location} · {TYPE_LABELS[job.type]}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Users className="h-3.5 w-3.5" />
              <span>{job.candidateCount}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => navigate(`/jobs/${job.id}`)}>View details</DropdownMenuItem>
                {job.status !== 'archived' && (
                  <DropdownMenuItem onClick={() => setConfirm({ type: 'archive', jobId: job.id, jobTitle: job.title })}>Archive</DropdownMenuItem>
                )}
                {job.status === 'archived' && (
                  <DropdownMenuItem onClick={() => updateStatus({ id: job.id, status: 'draft' })}>Restore to Draft</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setConfirm({ type: 'delete', jobId: job.id, jobTitle: job.title })}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={v => !v && setConfirm(null)}
        title={confirm?.type === 'delete' ? 'Delete job?' : 'Archive job?'}
        description={
          confirm?.type === 'delete'
            ? `"${confirm?.jobTitle}" will be permanently removed. This cannot be undone.`
            : `"${confirm?.jobTitle}" will be hidden from active listings.`
        }
        confirmLabel={confirm?.type === 'delete' ? 'Delete' : 'Archive'}
        isLoading={isUpdating || isDeleting}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function JobsSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-l-4 border-l-muted px-6 py-4">
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}
