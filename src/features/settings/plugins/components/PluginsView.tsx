import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useInstalledPlugins } from '../hooks';
import { PluginRow } from './PluginRow';
import { PluginConfigPanel } from './PluginConfigPanel';

export function PluginsView() {
  const { data: plugins, isLoading } = useInstalledPlugins();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPlugin = plugins?.find(p => p.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId(prev => (prev === id ? null : id));
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">Plugins</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your installed integrations and their configuration.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Browse marketplace
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        )}

        {!isLoading && (!plugins || plugins.length === 0) && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">No plugins installed yet.</p>
            <Link to="/marketplace" className="mt-2 inline-block text-sm text-primary hover:underline">
              Go to Marketplace
            </Link>
          </div>
        )}

        {!isLoading && plugins && plugins.length > 0 && (
          <div className="flex flex-col gap-3">
            {/* Enabled plugins first */}
            {[...plugins]
              .sort((a, b) => Number(b.isEnabled) - Number(a.isEnabled))
              .map(plugin => (
                <div key={plugin.id} className="flex flex-col gap-2">
                  <PluginRow
                    plugin={plugin}
                    isSelected={selectedId === plugin.id}
                    onSelect={() => handleSelect(plugin.id)}
                  />
                  {selectedId === plugin.id && selectedPlugin && (
                    <PluginConfigPanel
                      plugin={selectedPlugin}
                      onClose={() => setSelectedId(null)}
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
