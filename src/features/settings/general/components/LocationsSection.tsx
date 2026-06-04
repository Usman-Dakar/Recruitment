import { useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocations, useAddLocation, useDeleteLocation } from '../hooks';

export function LocationsSection() {
  const [open, setOpen] = useState(true);
  const [newName, setNewName] = useState('');
  const { data: locations, isLoading } = useLocations();
  const addMutation = useAddLocation();
  const deleteMutation = useDeleteLocation();

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addMutation.mutate(name, {
      onSuccess: () => { toast.success(`Location "${name}" added`); setNewName(''); },
      onError: () => toast.error('Failed to add location'),
    });
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Locations</span>
          {locations && (
            <Badge variant="secondary" className="text-xs">{locations.length}</Badge>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 py-5 flex flex-col gap-4">
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          )}

          {!isLoading && locations && (
            <div className="flex flex-col gap-1">
              {locations.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No locations yet. Add your first office location below.
                </p>
              )}
              {locations.map(loc => (
                <div key={loc.id} className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-muted/40 group">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">{loc.name}</span>
                    {loc.isHeadquarters && (
                      <Badge variant="secondary" className="text-xs">HQ</Badge>
                    )}
                  </div>
                  {!loc.isHeadquarters && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={() => deleteMutation.mutate(loc.id, {
                        onSuccess: () => toast.success('Location removed'),
                      })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1 border-t border-border">
            <Input
              placeholder="Add location (e.g. Singapore)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              disabled={!newName.trim() || addMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
