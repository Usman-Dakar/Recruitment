import { useParams, useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobById } from '../hooks/useJobs';
import type { JobDetailTab } from '../types/job.types';
import { JobDetailHeader } from './JobDetailHeader';
import { JobTabNav } from './JobTabNav';
import { JobPipeline } from './JobPipeline';
import { JobActivity } from './JobActivity';
import { JobNotes } from './JobNotes';

export function JobDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as JobDetailTab) ?? 'pipeline';

  const { data: job, isLoading, isError } = useJobById(id);

  if (isLoading) return (
    <div className="flex flex-col">
      <div className="border-b border-border px-6 py-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex border-b border-border px-6">
        {['Pipeline', 'Activity', 'Notes'].map(t => <Skeleton key={t} className="mr-6 h-10 w-16" />)}
      </div>
    </div>
  );

  if (isError || !job) return (
    <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
      Job not found.
    </div>
  );

  return (
    <div className="flex flex-col">
      <JobDetailHeader job={job} />
      <JobTabNav />
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pipeline' && <JobPipeline jobId={id} />}
        {activeTab === 'activity' && <JobActivity jobId={id} />}
        {activeTab === 'notes' && <JobNotes jobId={id} />}
      </div>
    </div>
  );
}
