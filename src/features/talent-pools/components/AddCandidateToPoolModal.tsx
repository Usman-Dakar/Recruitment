import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCandidates } from '@/features/candidates';
import { useAddCandidatesToPool } from '../hooks';

interface AddCandidateToPoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poolId: string;
  existingCandidateIds: string[];
}

export function AddCandidateToPoolModal({
  open,
  onOpenChange,
  poolId,
  existingCandidateIds,
}: AddCandidateToPoolModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const { data: candidatesData } = useCandidates(
    search ? { search } : {},
  );
  const addMutation = useAddCandidatesToPool();

  const candidates = candidatesData?.data ?? [];
  const available = candidates.filter(c => !existingCandidateIds.includes(c.id));

  function toggle(id: string) {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  function handleAdd() {
    if (selected.length === 0) return;
    addMutation.mutate(
      { poolId, candidateIds: selected },
      {
        onSuccess: () => {
          setSelected([]);
          setSearch('');
          onOpenChange(false);
        },
      },
    );
  }

  function handleClose() {
    setSelected([]);
    setSearch('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add candidates to pool</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {available.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              {search ? 'No candidates found' : 'All candidates are already in this pool'}
            </p>
          )}
          {available.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm text-left transition-colors ${
                selected.includes(c.id)
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted border border-transparent'
              }`}
            >
              <div>
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground ml-2 text-xs">{c.position}</span>
              </div>
              {selected.includes(c.id) && (
                <Badge variant="secondary" className="text-xs">Selected</Badge>
              )}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={selected.length === 0 || addMutation.isPending}>
            Add {selected.length > 0 ? `${selected.length} ` : ''}candidate{selected.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
