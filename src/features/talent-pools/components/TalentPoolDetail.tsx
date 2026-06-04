import { useState } from 'react';
import { ArrowLeft, UserPlus, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { useCandidateById } from '@/features/candidates';
import { useTalentPoolById } from '../hooks';
import { useRemoveCandidateFromPool } from '../hooks';
import { AddCandidateToPoolModal } from './AddCandidateToPoolModal';

const PER_PAGE = 5;

interface CandidateRowProps {
  candidateId: string;
  poolId: string;
}

function CandidateRow({ candidateId, poolId }: CandidateRowProps) {
  const navigate = useNavigate();
  const { data: candidate, isLoading } = useCandidateById(candidateId);
  const removeMutation = useRemoveCandidateFromPool();

  if (isLoading) return <Skeleton className="h-12 w-full rounded" />;
  if (!candidate) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 group">
      <button
        type="button"
        className="flex items-center gap-3 flex-1 text-left"
        onClick={() => navigate(`/candidates/${candidate.id}`)}
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-primary">
            {candidate.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">{candidate.name}</p>
          <p className="text-xs text-muted-foreground">{candidate.position}</p>
        </div>
        <Badge variant="outline" className="ml-auto text-xs capitalize">
          {candidate.status.replace('_', ' ')}
        </Badge>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeMutation.mutate({ poolId, candidateId })}
        disabled={removeMutation.isPending}
      >
        <UserX className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

interface TalentPoolDetailProps {
  poolId: string;
}

export function TalentPoolDetail({ poolId }: TalentPoolDetailProps) {
  const navigate = useNavigate();
  const { data: pool, isLoading } = useTalentPoolById(poolId);
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-medium">Pool not found</p>
        <Button variant="link" onClick={() => navigate('/talent-pools')}>
          Back to talent pools
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/talent-pools')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{pool.name}</h1>
          {pool.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{pool.description}</p>
          )}
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add candidates
        </Button>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-sm font-medium">Candidates</span>
          <Badge variant="secondary">{pool.candidateIds.length}</Badge>
        </div>

        {pool.candidateIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-muted-foreground">No candidates in this pool</p>
            <p className="text-xs text-muted-foreground mt-1">Add candidates to get started</p>
            <Button variant="outline" className="mt-4" onClick={() => setAddOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              Add candidates
            </Button>
          </div>
        ) : (
          <>
            <div>
              {pool.candidateIds.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(id => (
                <CandidateRow key={id} candidateId={id} poolId={pool.id} />
              ))}
            </div>
            <Pagination
              page={page}
              lastPage={Math.max(1, Math.ceil(pool.candidateIds.length / PER_PAGE))}
              total={pool.candidateIds.length}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <AddCandidateToPoolModal
        open={addOpen}
        onOpenChange={setAddOpen}
        poolId={pool.id}
        existingCandidateIds={pool.candidateIds}
      />
    </div>
  );
}
