import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '_all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'listed', label: 'Listed' },
  { value: 'archived', label: 'Archived' },
];

interface JobFiltersBarProps {
  search: string;
  status: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export function JobFiltersBar({ search, status, onSearchChange, onStatusChange }: JobFiltersBarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-8 h-8 text-sm"
          placeholder="Search jobs…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={status || '_all'}
        onValueChange={v => onStatusChange(v === '_all' ? '' : v)}
      >
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
