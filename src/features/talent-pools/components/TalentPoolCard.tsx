import { Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDeleteTalentPool } from '../hooks';
import type { TalentPool } from '../types/talent-pool.types';

interface TalentPoolCardProps {
  pool: TalentPool;
}

export function TalentPoolCard({ pool }: TalentPoolCardProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteTalentPool();

  return (
    <>
      <div
        className="bg-white rounded-lg border border-border p-5 hover:shadow-sm transition-shadow cursor-pointer flex flex-col gap-3"
        onClick={() => navigate(`/talent-pools/${pool.id}`)}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-foreground leading-tight">{pool.name}</h3>
          <Badge variant="secondary" className="shrink-0 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {pool.candidateIds.length}
          </Badge>
        </div>

        {pool.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{pool.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs text-muted-foreground">
            {pool.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={e => { e.stopPropagation(); setConfirmOpen(true); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete pool"
        description={`Delete "${pool.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(pool.id, { onSuccess: () => setConfirmOpen(false) })}
      />
    </>
  );
}
