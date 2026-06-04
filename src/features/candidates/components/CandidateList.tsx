import { format } from 'date-fns';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import type { Candidate, CandidateOrigin, CandidateStatus } from '../types/candidate.types';
import type { TableColumn } from './ColumnManager';

const STATUS_VARIANT: Record<CandidateStatus, 'default' | 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
  new: 'info', in_review: 'warning', interview: 'default', offer: 'success', hired: 'success', rejected: 'destructive',
};
const STATUS_LABEL: Record<CandidateStatus, string> = {
  new: 'New', in_review: 'In Review', interview: 'Interview', offer: 'Offer', hired: 'Hired', rejected: 'Rejected',
};
const ORIGIN_LABEL: Record<CandidateOrigin, string> = {
  direct: 'Direct', referral: 'Referred', linkedin: 'LinkedIn', job_board: 'Job Board', agency: 'Agency',
};

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  columns: TableColumn[];
}

export function CandidateList({ candidates, isLoading, columns }: CandidateListProps) {
  const navigate = useNavigate();
  const visible = columns.filter(c => c.visible);

  if (isLoading) {
    return (
      <div className="space-y-2 p-6">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded" />)}
      </div>
    );
  }

  if (candidates.length === 0) {
    return <EmptyState icon={Users} title="No candidates found" description="Try adjusting your filters." className="m-6" />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {visible.map(col => <TableHead key={col.id}>{col.label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map(c => (
            <TableRow
              key={c.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/candidates/${c.id}`)}
            >
              {visible.map(col => (
                <TableCell key={col.id}>
                  {col.id === 'name' && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-xs">{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  )}
                  {col.id === 'position' && <span className="text-sm">{c.position}</span>}
                  {col.id === 'status' && <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>}
                  {col.id === 'origin' && (
                    <span className="text-sm text-muted-foreground">
                      {ORIGIN_LABEL[c.origin]}{c.referredBy ? ` by ${c.referredBy}` : ''}
                    </span>
                  )}
                  {col.id === 'applied' && <span className="text-sm text-muted-foreground">{format(c.appliedAt, 'MMM d, yyyy')}</span>}
                  {col.id === 'location' && <span className="text-sm text-muted-foreground">{c.location ?? '—'}</span>}
                  {col.id === 'roles' && <span className="text-xs text-muted-foreground">{c.roles.join(', ')}</span>}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
