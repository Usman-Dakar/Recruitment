import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '../hooks/useAnalytics';
import type { AnalyticsFilters, MetricId } from '../types/analytics.types';
import { ApplicationsChart } from './ApplicationsChart';
import { EditMetricsModal } from './EditMetricsModal';
import { StatCard } from '@/components/ui/stat-card';
import { MetricsFilter } from './MetricsFilter';
import { PipelineChart } from './PipelineChart';
import { SourceChart } from './SourceChart';
import { TimeToHireChart } from './TimeToHireChart';

const DEFAULT_VISIBLE: MetricId[] = ['applications', 'pipeline', 'sources', 'time_to_hire'];

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ dateRange: '30d' });
  const [visibleCharts, setVisibleCharts] = useState<MetricId[]>(DEFAULT_VISIBLE);
  const [editOpen, setEditOpen] = useState(false);
  const { data, isLoading } = useAnalytics(filters);

  const toggleChart = (id: MetricId) =>
    setVisibleCharts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const visible = (id: MetricId) => visibleCharts.includes(id);

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <>
      <div className="overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Analytics</h1>
            <p className="text-xs text-muted-foreground">Performance metrics and trends</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            Edit metrics
          </Button>
        </div>

        <MetricsFilter filters={filters} onChange={f => setFilters(f)} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Applications" value={data?.overview.totalApplications ?? 0} />
          <StatCard label="Active Jobs" value={data?.overview.activeJobs ?? 0} />
          <StatCard label="Hired" value={data?.overview.hired ?? 0} />
          <StatCard label="Avg. Time to Hire" value={`${data?.overview.avgTimeToHire ?? 0}d`} sublabel="average days" />
        </div>

        {visible('applications') && data && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-4 text-sm font-medium">Applications Over Time</h3>
            <ApplicationsChart data={data.applications} />
          </div>
        )}

        {(visible('pipeline') || visible('sources')) && data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visible('pipeline') && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 text-sm font-medium">Pipeline Breakdown</h3>
                <PipelineChart data={data.pipeline} />
              </div>
            )}
            {visible('sources') && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 text-sm font-medium">Application Sources</h3>
                <SourceChart data={data.sources} />
              </div>
            )}
          </div>
        )}

        {visible('time_to_hire') && data && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-4 text-sm font-medium">Time to Hire by Role</h3>
            <TimeToHireChart data={data.timeToHire} />
          </div>
        )}
      </div>

      <EditMetricsModal
        open={editOpen}
        visibleCharts={visibleCharts}
        onToggle={toggleChart}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-8 w-32" /></div>
      <div className="flex gap-3"><Skeleton className="h-9 w-48" /><Skeleton className="h-9 w-36" /></div>
      <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
      <Skeleton className="h-64 rounded-lg" />
      <div className="grid grid-cols-2 gap-4"><Skeleton className="h-64 rounded-lg" /><Skeleton className="h-64 rounded-lg" /></div>
    </div>
  );
}
