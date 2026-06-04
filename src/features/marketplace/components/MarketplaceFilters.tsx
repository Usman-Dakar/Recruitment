import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PluginCategory } from '../types/marketplace.types';

const CATEGORIES: { value: PluginCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'job_board', label: 'Job Boards' },
  { value: 'assessment', label: 'Assessments' },
  { value: 'background_check', label: 'Background Checks' },
  { value: 'communication', label: 'Communication' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'hr_system', label: 'HR Systems' },
  { value: 'analytics', label: 'Analytics' },
];

interface MarketplaceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: PluginCategory | 'all';
  onCategoryChange: (value: PluginCategory | 'all') => void;
  installedOnly: boolean;
  onInstalledOnlyChange: (value: boolean) => void;
}

export function MarketplaceFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  installedOnly,
  onInstalledOnlyChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            className="pl-9"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          variant={installedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => onInstalledOnlyChange(!installedOnly)}
        >
          Installed
        </Button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onCategoryChange(value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              category === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
