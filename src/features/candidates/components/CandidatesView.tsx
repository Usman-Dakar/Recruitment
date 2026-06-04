import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useCandidatesInfinite } from '../hooks/useCandidates';
import type { CandidateFilters } from '../types/candidate.types';
import { AddCandidateModal } from './AddCandidateModal';
import { CandidateFilters as FiltersBar } from './CandidateFilters';
import { CandidateList } from './CandidateList';
import { ColumnManager, DEFAULT_COLUMNS } from './ColumnManager';
import type { TableColumn } from './ColumnManager';

export function CandidatesView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [columns, setColumns] = useState<TableColumn[]>(DEFAULT_COLUMNS);
  const [addOpen, setAddOpen] = useState(false);

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';
  const origin = searchParams.get('origin') ?? '';

  const filters: Omit<CandidateFilters, 'page' | 'perPage'> = {
    ...(search ? { search } : {}),
    ...(status ? { status: status as NonNullable<CandidateFilters['status']> } : {}),
    ...(origin ? { origin: origin as NonNullable<CandidateFilters['origin']> } : {}),
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCandidatesInfinite(filters);

  const allCandidates = data?.pages.flatMap(p => p.data) ?? [];
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

  const toggleColumn = (id: string) => {
    setColumns(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h1 className="text-base font-semibold text-foreground">Candidates</h1>
            <p className="text-xs text-muted-foreground">{total} total</p>
          </div>
          <div className="flex items-center gap-2">
            <ColumnManager columns={columns} onChange={toggleColumn} />
            <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add candidate
            </Button>
          </div>
        </div>

        <FiltersBar
          search={search} status={status} origin={origin}
          onSearchChange={v => updateParam('search', v)}
          onStatusChange={v => updateParam('status', v)}
          onOriginChange={v => updateParam('origin', v)}
        />

        <CandidateList candidates={allCandidates} isLoading={isLoading} columns={columns} />

        {/* Scroll sentinel — triggers next page load when visible */}
        <div ref={sentinelRef} className="h-1" />

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasNextPage && allCandidates.length > 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">All candidates loaded</p>
        )}
      </div>

      <AddCandidateModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
