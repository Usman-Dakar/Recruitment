import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobs } from '@/features/jobs';
import type { AnalyticsFilters, DateRange } from '../types/analytics.types';

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d',  label: 'Last 7 days'  },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y',  label: 'Last year'    },
];

interface MetricsFilterProps {
  filters: AnalyticsFilters;
  onChange: (f: AnalyticsFilters) => void;
}

export function MetricsFilter({ filters, onChange }: MetricsFilterProps) {
  const { data: jobsData } = useJobs({});

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.jobId ?? '_all'}
        onValueChange={v => onChange({ ...filters, ...(v === '_all' ? {} : { jobId: v }) })}
      >
        <SelectTrigger className="h-9 w-52 text-sm">
          <SelectValue placeholder="All jobs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">All jobs</SelectItem>
          {jobsData?.data.map(j => (
            <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={v => onChange({ ...filters, dateRange: v as DateRange })}
      >
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DATE_RANGES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
