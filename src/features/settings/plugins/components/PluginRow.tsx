import { RefreshCw, Settings2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTogglePlugin, useSyncPlugin } from '../hooks';
import type { InstalledPlugin, InstalledPluginCategory } from '../types/plugins.types';

const CATEGORY_LABEL: Record<InstalledPluginCategory, string> = {
  job_board: 'Job board',
  assessment: 'Assessment',
  background_check: 'Background check',
  communication: 'Communication',
  calendar: 'Calendar',
  hr_system: 'HR system',
};

interface PluginRowProps {
  plugin: InstalledPlugin;
  isSelected: boolean;
  onSelect: () => void;
}

export function PluginRow({ plugin, isSelected, onSelect }: PluginRowProps) {
  const toggleMutation = useTogglePlugin();
  const syncMutation = useSyncPlugin();

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border bg-card px-5 py-4 transition-colors ${
        isSelected ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-border/80'
      }`}
    >
      {/* Name + meta */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{plugin.name}</span>
          <Badge variant="secondary" className="text-xs">
            {CATEGORY_LABEL[plugin.category]}
          </Badge>
          <span className="text-xs text-muted-foreground">v{plugin.version}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{plugin.description}</p>
        {plugin.lastSyncedAt && (
          <p className="text-[10px] text-muted-foreground">
            Last synced {formatDistanceToNow(plugin.lastSyncedAt, { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          disabled={syncMutation.isPending}
          onClick={() =>
            syncMutation.mutate(plugin.id, {
              onSuccess: () => toast.success(`${plugin.name} synced`),
              onError: () => toast.error('Sync failed'),
            })
          }
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
        </Button>

        <Button
          variant={isSelected ? 'secondary' : 'outline'}
          size="sm"
          onClick={onSelect}
          className="gap-1.5"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Configure
        </Button>

        <Switch
          checked={plugin.isEnabled}
          disabled={toggleMutation.isPending}
          onCheckedChange={() =>
            toggleMutation.mutate(plugin.id, {
              onSuccess: () =>
                toast.success(`${plugin.name} ${plugin.isEnabled ? 'disabled' : 'enabled'}`),
              onError: () => toast.error('Failed to update plugin'),
            })
          }
        />
      </div>
    </div>
  );
}
