import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useImportCandidates } from '../hooks';
import type { AcquisitionSource } from '../types/acquisitions.types';

interface EntryRow {
  id: string;
  name: string;
  email: string;
  position: string;
}

function makeRow(): EntryRow {
  return { id: crypto.randomUUID(), name: '', email: '', position: '' };
}

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: AcquisitionSource | null;
}

export function ImportModal({ open, onOpenChange, source }: ImportModalProps) {
  const [rows, setRows] = useState<EntryRow[]>([makeRow()]);
  const importMutation = useImportCandidates();

  function updateRow(id: string, field: keyof Omit<EntryRow, 'id'>, value: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function addRow() {
    setRows(prev => [...prev, makeRow()]);
  }

  function removeRow(id: string) {
    setRows(prev => prev.filter(r => r.id !== id));
  }

  function handleClose() {
    setRows([makeRow()]);
    onOpenChange(false);
  }

  function handleImport() {
    if (!source) return;
    const valid = rows.filter(r => r.name.trim() && r.email.trim() && r.position.trim());
    if (valid.length === 0) {
      toast.error('Fill in at least one complete row');
      return;
    }
    const entries = valid.map(({ name, email, position }) => ({ name, email, position }));
    importMutation.mutate(
      { sourceId: source.id, entries },
      {
        onSuccess: imported => {
          toast.success(`${imported.length} candidate${imported.length !== 1 ? 's' : ''} imported`);
          handleClose();
        },
        onError: () => toast.error('Import failed'),
      },
    );
  }

  const validCount = rows.filter(r => r.name.trim() && r.email.trim() && r.position.trim()).length;


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Import candidates{source ? ` from ${source.name}` : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-[1fr_1fr_1fr_2rem] gap-2">
            <Label className="text-xs text-muted-foreground">Full name</Label>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Label className="text-xs text-muted-foreground">Position</Label>
            <span />
          </div>

          {rows.map(row => (
            <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_2rem] gap-2 items-center">
              <Input
                placeholder="Jane Doe"
                value={row.name}
                onChange={e => updateRow(row.id, 'name', e.target.value)}
              />
              <Input
                placeholder="jane@example.com"
                type="email"
                value={row.email}
                onChange={e => updateRow(row.id, 'email', e.target.value)}
              />
              <Input
                placeholder="Frontend Engineer"
                value={row.position}
                onChange={e => updateRow(row.id, 'position', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-fit">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add row
        </Button>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={validCount === 0 || importMutation.isPending}
          >
            Import {validCount > 0 ? `${validCount} ` : ''}candidate{validCount !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
