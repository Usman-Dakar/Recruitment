import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUpdateJobStatus, useDeleteJob } from '../hooks/useJobMutations';
import { JobStatusBadge } from './JobStatusBadge';
import type { Job } from '../types/job.types';

const TYPE_LABELS: Record<Job['type'], string> = { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship' };

type ConfirmAction = 'archive' | 'delete' | null;

interface JobDetailHeaderProps { job: Job; }

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateJobStatus();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();

  const handleConfirm = () => {
    if (confirm === 'archive') {
      updateStatus({ id: job.id, status: 'archived' }, { onSuccess: () => setConfirm(null) });
    } else if (confirm === 'delete') {
      deleteJob(job.id, { onSuccess: () => { setConfirm(null); navigate('/jobs'); } });
    }
  };

  return (
    <>
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate('/jobs')}
          className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Jobs
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold">{job.title}</h1>
              <JobStatusBadge status={job.status} />
              {job.referralsEnabled && <span className="text-xs text-emerald-600 font-medium">Referrals on</span>}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{job.department} · {job.location} · {TYPE_LABELS[job.type]}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {job.status === 'draft' && (
              <Button size="sm" onClick={() => updateStatus({ id: job.id, status: 'published' })} disabled={isUpdating}>Publish</Button>
            )}
            {job.status === 'published' && (
              <>
                <Button size="sm" onClick={() => updateStatus({ id: job.id, status: 'listed' })} disabled={isUpdating}>List Job</Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus({ id: job.id, status: 'draft' })} disabled={isUpdating}>Unpublish</Button>
              </>
            )}
            {job.status === 'listed' && (
              <Button size="sm" variant="outline" onClick={() => updateStatus({ id: job.id, status: 'published' })} disabled={isUpdating}>Unlist</Button>
            )}
            {job.status === 'archived' && (
              <Button size="sm" variant="outline" onClick={() => updateStatus({ id: job.id, status: 'draft' })} disabled={isUpdating}>Restore</Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {job.status !== 'archived' && (
                  <DropdownMenuItem onClick={() => setConfirm('archive')}>Archive job</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setConfirm('delete')}>Delete job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={v => !v && setConfirm(null)}
        title={confirm === 'delete' ? 'Delete job?' : 'Archive job?'}
        description={
          confirm === 'delete'
            ? `"${job.title}" will be permanently removed. This cannot be undone.`
            : `"${job.title}" will be hidden from active listings.`
        }
        confirmLabel={confirm === 'delete' ? 'Delete' : 'Archive'}
        isLoading={isUpdating || isDeleting}
        onConfirm={handleConfirm}
      />
    </>
  );
}
