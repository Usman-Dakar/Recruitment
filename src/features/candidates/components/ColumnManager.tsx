import { useEffect, useRef, useState } from 'react';
import { Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
}

export const DEFAULT_COLUMNS: TableColumn[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'position', label: 'Position', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'origin', label: 'Origin', visible: true },
  { id: 'applied', label: 'Applied', visible: true },
  { id: 'location', label: 'Location', visible: false },
  { id: 'roles', label: 'Roles', visible: false },
];

interface ColumnManagerProps {
  columns: TableColumn[];
  onChange: (id: string) => void;
}

export function ColumnManager({ columns, onChange }: ColumnManagerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(v => !v)}>
        <Columns className="h-3.5 w-3.5" />
        Columns
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-border bg-background shadow-lg">
          <p className="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Toggle columns
          </p>
          {columns.map(col => (
            <label key={col.id} className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-muted">
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => onChange(col.id)}
                className="rounded"
              />
              <span className="text-sm text-foreground">{col.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
