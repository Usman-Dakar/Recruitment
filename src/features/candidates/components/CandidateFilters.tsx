import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CandidateOrigin, CandidateStatus } from '../types/candidate.types';

const STATUSES: { value: CandidateStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_review', label: 'In Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const ORIGINS: { value: CandidateOrigin; label: string }[] = [
  { value: 'direct', label: 'Direct' },
  { value: 'referral', label: 'Referred' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'job_board', label: 'Job Board' },
  { value: 'agency', label: 'Agency' },
];

interface CandidateFiltersProps {
  search: string;
  status: string;
  origin: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onOriginChange: (v: string) => void;
}

export function CandidateFilters({ search, status, origin, onSearchChange, onStatusChange, onOriginChange }: CandidateFiltersProps) {
  const activeChips = [
    ...(status ? [{ label: STATUSES.find(s => s.value === status)?.label ?? status, onRemove: () => onStatusChange('') }] : []),
    ...(origin ? [{ label: ORIGINS.find(o => o.value === origin)?.label ?? origin, onRemove: () => onOriginChange('') }] : []),
  ];

  return (
    <div className="space-y-3 px-6 py-3 border-b border-border">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-sm"
            placeholder="Search candidates…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={status || 'all'} onValueChange={v => onStatusChange(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={origin || 'all'} onValueChange={v => onOriginChange(v === 'all' ? '' : v)}>
          <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Origin" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All origins</SelectItem>
            {ORIGINS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map(chip => (
            <span key={chip.label} className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
              {chip.label}
              <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
