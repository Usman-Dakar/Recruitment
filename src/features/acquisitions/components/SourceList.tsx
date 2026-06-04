import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAcquisitionSources } from '../hooks';
import { SourceCard } from './SourceCard';
import { SourceDetailPanel } from './SourceDetailPanel';
import { ImportModal } from './ImportModal';
import type { AcquisitionSource } from '../types/acquisitions.types';

export function SourceList() {
  const { data: sources, isLoading } = useAcquisitionSources();
  const [selectedSource, setSelectedSource] = useState<AcquisitionSource | null>(null);
  const [importSource, setImportSource] = useState<AcquisitionSource | null>(null);

  const totalCandidates = sources?.reduce((sum, s) => sum + s.totalCount, 0) ?? 0;
  const activeSources = sources?.filter(s => s.isActive).length ?? 0;

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Acquisitions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage sourcing channels and import candidates
          </p>
        </div>
        {!isLoading && sources && (
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xl font-semibold">{totalCandidates}</p>
              <p className="text-xs text-muted-foreground">Total sourced</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{activeSources}</p>
              <p className="text-xs text-muted-foreground">Active sources</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && sources && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map(source => (
                <SourceCard
                  key={source.id}
                  source={source}
                  isSelected={selectedSource?.id === source.id}
                  onSelect={s => setSelectedSource(prev => (prev?.id === s.id ? null : s))}
                  onImport={s => setImportSource(s)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedSource && (
          <SourceDetailPanel
            source={selectedSource}
            onClose={() => setSelectedSource(null)}
            onImport={s => { setImportSource(s); }}
          />
        )}
      </div>

      <ImportModal
        open={importSource !== null}
        onOpenChange={open => { if (!open) setImportSource(null); }}
        source={importSource}
      />
    </div>
  );
}
