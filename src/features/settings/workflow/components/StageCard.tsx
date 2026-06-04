import { useState } from 'react';
import { Pencil, Check, Trash2, Plus, X, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRenameStage, useDeleteStage, useDeleteAutomation } from '../hooks';
import { AddAutomationModal } from './AddAutomationModal';
import type { PipelineStage } from '../types/workflow.types';

interface StageCardProps {
  stage: PipelineStage;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function StageCard({ stage, isFirst, isLast, onMoveUp, onMoveDown }: StageCardProps) {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(stage.name);
  const [autoModalOpen, setAutoModalOpen] = useState(false);

  const renameMutation = useRenameStage();
  const deleteStageMutation = useDeleteStage();
  const deleteAutoMutation = useDeleteAutomation();

  function commitRename() {
    const name = nameValue.trim();
    if (!name || name === stage.name) { setEditing(false); return; }
    renameMutation.mutate({ id: stage.id, name }, {
      onSuccess: () => { toast.success('Stage renamed'); setEditing(false); },
      onError: () => toast.error('Rename failed'),
    });
  }

  return (
    <div className="bg-white border border-border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />

        {editing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              className="h-7 text-sm"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={commitRename}>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium">{stage.name}</span>
            {stage.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
            {!stage.isDefault && (
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                onClick={() => { setNameValue(stage.name); setEditing(true); }}
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isFirst} onClick={onMoveUp}>
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isLast} onClick={onMoveDown}>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          {!stage.isDefault && !editing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => deleteStageMutation.mutate(stage.id, { onSuccess: () => toast.success('Stage deleted') })}
              disabled={deleteStageMutation.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {stage.automations.length > 0 && (
        <div className="flex flex-col gap-1.5 pl-5">
          {stage.automations.map(auto => (
            <div key={auto.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-muted/40 rounded text-xs group/auto">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                {auto.description}
              </div>
              <button
                type="button"
                className="opacity-0 group-hover/auto:opacity-100 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => deleteAutoMutation.mutate({ stageId: stage.id, autoId: auto.id })}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="pl-5">
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => setAutoModalOpen(true)}>
          <Plus className="h-3 w-3 mr-1" />
          Add automation
        </Button>
      </div>

      <AddAutomationModal
        open={autoModalOpen}
        onOpenChange={setAutoModalOpen}
        stageId={stage.id}
        stageName={stage.name}
      />
    </div>
  );
}
