import { Star, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SlidePanel } from '@/components/ui/slide-panel';
import { toast } from 'sonner';
import { useInstallPlugin, useUninstallPlugin, useTogglePlugin } from '../hooks';
import type { Plugin } from '../types/marketplace.types';

interface PluginDetailPanelProps {
  plugin: Plugin;
  onClose: () => void;
}

export function PluginDetailPanel({ plugin, onClose }: PluginDetailPanelProps) {
  const installMutation = useInstallPlugin();
  const uninstallMutation = useUninstallPlugin();
  const toggleMutation = useTogglePlugin();
  const isLoading = installMutation.isPending || uninstallMutation.isPending || toggleMutation.isPending;

  function handleInstall() {
    installMutation.mutate(plugin.id, {
      onSuccess: () => toast.success(`${plugin.name} installed`),
      onError: () => toast.error('Installation failed'),
    });
  }

  function handleUninstall() {
    uninstallMutation.mutate(plugin.id, {
      onSuccess: () => toast.success(`${plugin.name} uninstalled`),
      onError: () => toast.error('Uninstall failed'),
    });
  }

  function handleToggle() {
    toggleMutation.mutate(
      { pluginId: plugin.id, isEnabled: !plugin.isEnabled },
      { onSuccess: () => toast.success(`${plugin.name} ${plugin.isEnabled ? 'disabled' : 'enabled'}`) },
    );
  }

  return (
    <SlidePanel title={plugin.name} onClose={onClose} width="lg">
      <div className="p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">By {plugin.developer}</p>
            {plugin.version !== '—' && <p className="text-xs text-muted-foreground">v{plugin.version}</p>}
          </div>
          {plugin.rating > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{plugin.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({plugin.reviewCount} reviews)</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {plugin.status === 'installed' && (
            <>
              <Button className="flex-1" variant={plugin.isEnabled ? 'outline' : 'default'} onClick={handleToggle} disabled={isLoading}>
                {plugin.isEnabled ? 'Disable' : 'Enable'}
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleUninstall} disabled={isLoading}>
                Uninstall
              </Button>
            </>
          )}
          {plugin.status === 'available' && (
            <Button className="flex-1" onClick={handleInstall} disabled={isLoading}>Install</Button>
          )}
          {plugin.status === 'coming_soon' && (
            <Button className="flex-1" variant="outline" disabled>Coming soon</Button>
          )}
        </div>

        {plugin.status === 'installed' && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${plugin.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {plugin.isEnabled ? 'Active and running' : 'Installed but disabled'}
          </div>
        )}

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2">About</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{plugin.longDescription}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Features</h4>
          <ul className="flex flex-col gap-2">
            {plugin.features.map(feature => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <button type="button" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="h-3.5 w-3.5" />
          View documentation
        </button>
      </div>
    </SlidePanel>
  );
}
