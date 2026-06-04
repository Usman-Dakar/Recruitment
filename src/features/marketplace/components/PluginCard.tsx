import {
  Briefcase,
  ClipboardCheck,
  ShieldCheck,
  MessageSquare,
  BarChart2,
  Building2,
  CalendarDays,
  Star,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Plugin, PluginCategory } from '../types/marketplace.types';

const CATEGORY_ICON: Record<PluginCategory, React.ElementType> = {
  job_board: Briefcase,
  assessment: ClipboardCheck,
  background_check: ShieldCheck,
  communication: MessageSquare,
  analytics: BarChart2,
  hr_system: Building2,
  calendar: CalendarDays,
};

const CATEGORY_LABEL: Record<PluginCategory, string> = {
  job_board: 'Job Board',
  assessment: 'Assessment',
  background_check: 'Background Check',
  communication: 'Communication',
  analytics: 'Analytics',
  hr_system: 'HR System',
  calendar: 'Calendar',
};

const CATEGORY_COLOR: Record<PluginCategory, string> = {
  job_board: 'bg-blue-50 text-blue-600',
  assessment: 'bg-violet-50 text-violet-600',
  background_check: 'bg-red-50 text-red-600',
  communication: 'bg-green-50 text-green-600',
  analytics: 'bg-orange-50 text-orange-600',
  hr_system: 'bg-slate-50 text-slate-600',
  calendar: 'bg-cyan-50 text-cyan-600',
};

interface PluginCardProps {
  plugin: Plugin;
  onSelect: (plugin: Plugin) => void;
  isSelected: boolean;
}

export function PluginCard({ plugin, onSelect, isSelected }: PluginCardProps) {
  const Icon = CATEGORY_ICON[plugin.category];
  const colorClass = CATEGORY_COLOR[plugin.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(plugin)}
      className={`bg-white rounded-lg border p-5 flex flex-col gap-3 text-left transition-shadow hover:shadow-sm w-full ${
        isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      } ${plugin.status === 'coming_soon' ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold leading-tight">{plugin.name}</h3>
            {plugin.status === 'installed' && (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            )}
            {plugin.status === 'coming_soon' && (
              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {CATEGORY_LABEL[plugin.category]}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{plugin.description}</p>

      <div className="flex items-center justify-between mt-auto pt-1">
        {plugin.rating > 0 ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {plugin.rating.toFixed(1)}
            <span className="text-muted-foreground/60">({plugin.reviewCount})</span>
          </span>
        ) : (
          <Badge variant="secondary" className="text-xs">Coming soon</Badge>
        )}
        {plugin.status === 'installed' && (
          <Badge
            variant={plugin.isEnabled ? 'default' : 'outline'}
            className="text-xs"
          >
            {plugin.isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        )}
        {plugin.status === 'available' && (
          <Button size="sm" variant="outline" className="h-6 text-xs px-2">
            Install
          </Button>
        )}
      </div>
    </button>
  );
}
