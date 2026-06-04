import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { JobFilters } from '../types/job.types';
import { useJobsInfinite } from '../hooks/useJobs';
import { CreateJobModal } from './CreateJobModal';
import { JobFiltersBar } from './JobFiltersBar';
import { JobList } from './JobList';

export function JobsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';

  const filters: Omit<JobFilters, 'page' | 'perPage'> = {
    ...(search ? { search } : {}),
    ...(status ? { status: status as NonNullable<JobFilters['status']> } : {}),
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useJobsInfinite(filters);

  const allJobs = data?.pages.flatMap(p => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(loadMore, { rootMargin: '200px' });

  const updateParam = (key: string, value: string) => {
    const next = Object.fromEntries(searchParams.entries());
    if (value) next[key] = value; else delete next[key];
    setSearchParams(next);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-foreground">Jobs</h1>
            <p className="text-xs text-muted-foreground">{total} total</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create job
          </Button>
        </div>

        <JobFiltersBar
          search={search} status={status}
          onSearchChange={v => updateParam('search', v)}
          onStatusChange={v => updateParam('status', v)}
        />

        <JobList jobs={allJobs} isLoading={isLoading} />

        {/* Scroll sentinel — triggers next page load when visible */}
        <div ref={sentinelRef} className="h-1" />

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasNextPage && allJobs.length > 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">All jobs loaded</p>
        )}
      </div>

      <CreateJobModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}
