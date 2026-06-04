import {
  Linkedin,
  Briefcase,
  Building2,
  Share2,
  Globe,
  Users,
  TrendingUp,
  Calendar,
  Upload,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AcquisitionSource, SourceType } from '../types/acquisitions.types';

const SOURCE_ICON: Record<SourceType, React.ElementType> = {
  linkedin: Linkedin,
  job_board: Briefcase,
  agency: Building2,
  referral: Users,
  direct: Globe,
  social: Share2,
};

const SOURCE_COLOR: Record<SourceType, string> = {
  linkedin: 'bg-blue-50 text-blue-600',
  job_board: 'bg-orange-50 text-orange-600',
  agency: 'bg-purple-50 text-purple-600',
  referral: 'bg-green-50 text-green-600',
  direct: 'bg-slate-50 text-slate-600',
  social: 'bg-sky-50 text-sky-600',
};

interface SourceCardProps {
  source: AcquisitionSource;
  onImport: (source: AcquisitionSource) => void;
  onSelect: (source: AcquisitionSource) => void;
  isSelected: boolean;
}

export function SourceCard({ source, onImport, onSelect, isSelected }: SourceCardProps) {
  const Icon = SOURCE_ICON[source.type];
  const colorClass = SOURCE_COLOR[source.type];

  return (
    <div
      className={`bg-white rounded-lg border p-5 flex flex-col gap-4 cursor-pointer transition-shadow hover:shadow-sm ${
        isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      } ${!source.isActive ? 'opacity-60' : ''}`}
      onClick={() => onSelect(source)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{source.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{source.type.replace('_', ' ')}</p>
          </div>
        </div>
        <Badge variant={source.isActive ? 'default' : 'secondary'} className="shrink-0 text-xs">
          {source.isActive ? 'Active' : 'Paused'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-semibold">{source.totalCount}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">This month</span>
          <span className="text-sm font-semibold">{source.thisMonthCount}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />Conv.
          </span>
          <span className="text-sm font-semibold">{source.conversionRate.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border">
        {source.lastActivityAt ? (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(source.lastActivityAt, { addSuffix: true })}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No activity</span>
        )}
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={e => { e.stopPropagation(); onImport(source); }}
        >
          <Upload className="h-3 w-3 mr-1" />
          Import
        </Button>
      </div>
    </div>
  );
}
