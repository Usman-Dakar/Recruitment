import { Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SlidePanel } from '@/components/ui/slide-panel';
import { useAcquisitionEntries, useToggleSource } from '../hooks';
import type { AcquisitionSource, EntryStatus } from '../types/acquisitions.types';

const STATUS_BADGE: Record<EntryStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  added: { label: 'Added', variant: 'default' },
  pending: { label: 'Pending', variant: 'secondary' },
  duplicate: { label: 'Duplicate', variant: 'outline' },
  failed: { label: 'Failed', variant: 'destructive' },
};

interface SourceDetailPanelProps {
  source: AcquisitionSource;
  onClose: () => void;
  onImport: (source: AcquisitionSource) => void;
}

export function SourceDetailPanel({ source, onClose, onImport }: SourceDetailPanelProps) {
  const { data: entries, isLoading } = useAcquisitionEntries(source.id);
  const toggleMutation = useToggleSource();

  const headerContent = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <Button size="sm" className="flex-1" onClick={() => onImport(source)}>
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Import candidates
        </Button>
        <Button
          size="sm"
          variant={source.isActive ? 'outline' : 'secondary'}
          onClick={() => toggleMutation.mutate({ sourceId: source.id, isActive: !source.isActive })}
          disabled={toggleMutation.isPending}
        >
          {source.isActive ? 'Pause' : 'Activate'}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        {[
          { label: 'Total', value: source.totalCount },
          { label: 'This month', value: source.thisMonthCount },
          { label: 'Conversion', value: `${source.conversionRate.toFixed(1)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white px-3 py-2.5 text-center">
            <p className="text-sm font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <SlidePanel title={source.name} onClose={onClose} headerContent={headerContent}>
      <div className="px-4 py-2 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent imports</p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2 p-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded" />)}
        </div>
      )}

      {!isLoading && entries && entries.length === 0 && (
        <div className="flex items-center justify-center py-12 text-center px-4">
          <p className="text-xs text-muted-foreground">No imports yet from this source</p>
        </div>
      )}

      {!isLoading && entries && entries.length > 0 && (
        <div className="flex flex-col divide-y divide-border">
          {entries.map(entry => {
            const badge = STATUS_BADGE[entry.status];
            return (
              <div key={entry.id} className="px-4 py-3 flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{entry.name}</p>
                  <Badge variant={badge.variant} className="text-xs shrink-0">{badge.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{entry.position}</p>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(entry.importedAt, { addSuffix: true })}</p>
              </div>
            );
          })}
        </div>
      )}
    </SlidePanel>
  );
}
