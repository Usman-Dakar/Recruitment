import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useTalentPools } from '../hooks';
import { TalentPoolCard } from './TalentPoolCard';
import { CreatePoolModal } from './CreatePoolModal';

export function TalentPoolList() {
  const { data: pools, isLoading } = useTalentPools();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Talent Pools</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and organize your candidate talent pools
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          New pool
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && pools && pools.length === 0 && (
        <EmptyState
          icon={Users}
          title="No talent pools yet"
          description="Create your first pool to start organizing candidates"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              Create pool
            </Button>
          }
        />
      )}

      {!isLoading && pools && pools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pools.map(pool => (
            <TalentPoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      )}

      <CreatePoolModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
