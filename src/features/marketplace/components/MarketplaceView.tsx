import { useState } from 'react';
import { Store } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlugins } from '../hooks';
import { PluginCard } from './PluginCard';
import { PluginDetailPanel } from './PluginDetailPanel';
import { MarketplaceFilterBar } from './MarketplaceFilters';
import type { Plugin, PluginCategory } from '../types/marketplace.types';

export function MarketplaceView() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PluginCategory | 'all'>('all');
  const [installedOnly, setInstalledOnly] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const filters = {
    ...(search ? { search } : {}),
    ...(category !== 'all' ? { category } : {}),
    ...(installedOnly ? { installed: true } : {}),
  };

  const { data: plugins, isLoading } = usePlugins(
    Object.keys(filters).length > 0 ? filters : undefined,
  );

  function handleSelect(plugin: Plugin) {
    setSelectedPlugin(prev => (prev?.id === plugin.id ? null : plugin));
  }

  const installedCount = plugins?.filter(p => p.status === 'installed').length ?? 0;

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 flex-1 overflow-hidden">
        <div className="flex items-start justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold">Marketplace</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Browse and manage integrations for your hiring workflow
            </p>
          </div>
          {!isLoading && plugins && (
            <div className="text-right">
              <p className="text-xl font-semibold">{installedCount}</p>
              <p className="text-xs text-muted-foreground">Installed</p>
            </div>
          )}
        </div>

        <MarketplaceFilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          installedOnly={installedOnly}
          onInstalledOnlyChange={setInstalledOnly}
        />

        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-lg" />
                ))}
              </div>
            )}

            {!isLoading && plugins && plugins.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Store className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-sm">No integrations found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {!isLoading && plugins && plugins.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plugins.map(plugin => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                    isSelected={selectedPlugin?.id === plugin.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedPlugin && (
            <PluginDetailPanel
              plugin={selectedPlugin}
              onClose={() => setSelectedPlugin(null)}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
