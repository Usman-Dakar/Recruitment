import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkflowTags, useAddTag, useDeleteTag } from '../hooks';
import type { TagType } from '../types/workflow.types';

const PRESET_COLORS = [
  '#60a5fa', '#818cf8', '#a78bfa', '#f472b6',
  '#34d399', '#10b981', '#f59e0b', '#ef4444',
  '#94a3b8', '#0ea5e9',
];

interface TagManagerProps {
  type: TagType;
  title: string;
  description?: string;
}

export function TagManager({ type, title, description }: TagManagerProps) {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0] ?? '#60a5fa');
  const { data: tags, isLoading } = useWorkflowTags(type);
  const addMutation = useAddTag();
  const deleteMutation = useDeleteTag();

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addMutation.mutate(
      { name, color: selectedColor, type },
      {
        onSuccess: () => { toast.success(`Tag "${name}" added`); setNewName(''); },
        onError: () => toast.error('Failed to add tag'),
      },
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>

      {isLoading && <Skeleton className="h-8 w-full" />}

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          {tags?.length === 0 && (
            <p className="text-xs text-muted-foreground">No tags yet.</p>
          )}
          {tags?.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => deleteMutation.mutate(tag.id, { onSuccess: () => toast.success('Tag removed') })}
                className="opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`h-5 w-5 rounded-full transition-transform ${selectedColor === color ? 'ring-2 ring-offset-1 ring-foreground scale-110' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <Input
          placeholder="Tag name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="max-w-[160px]"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!newName.trim() || addMutation.isPending}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
