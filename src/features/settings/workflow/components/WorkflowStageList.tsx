import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { usePipelineStages, useAddStage, useReorderStages } from '../hooks';
import { StageCard } from './StageCard';

export function WorkflowStageList() {
  const [newStageName, setNewStageName] = useState('');
  const { data: stages, isLoading } = usePipelineStages();
  const addMutation = useAddStage();
  const reorderMutation = useReorderStages();

  function handleAddStage() {
    const name = newStageName.trim();
    if (!name) return;
    addMutation.mutate(name, {
      onSuccess: () => { toast.success(`Stage "${name}" added`); setNewStageName(''); },
      onError: () => toast.error('Failed to add stage'),
    });
  }

  function move(index: number, direction: 'up' | 'down') {
    if (!stages) return;
    const arr = [...stages];
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= arr.length) return;
    [arr[index], arr[swapWith]] = [arr[swapWith]!, arr[index]!];
    reorderMutation.mutate(arr.map(s => s.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Pipeline stages</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            These stages appear in job pipelines. Reorder to change the default flow.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      )}

      {!isLoading && stages && (
        <div className="flex flex-col gap-2">
          {stages.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              isFirst={i === 0}
              isLast={i === stages.length - 1}
              onMoveUp={() => move(i, 'up')}
              onMoveDown={() => move(i, 'down')}
            />
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Input
          placeholder="New stage name"
          value={newStageName}
          onChange={e => setNewStageName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddStage(); } }}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={handleAddStage}
          disabled={!newStageName.trim() || addMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add stage
        </Button>
      </div>
    </div>
  );
}
