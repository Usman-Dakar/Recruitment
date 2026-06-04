import type { ReactNode } from 'react';
import { Badge } from './badge';
import { Skeleton } from './skeleton';

export interface KanbanColumnDef<T> {
  id: string;
  title: string;
  color?: string;
  items: T[];
}

interface KanbanBoardProps<T> {
  columns: KanbanColumnDef<T>[];
  renderCard: (item: T, allColumns: KanbanColumnDef<T>[]) => ReactNode;
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  skeletonColumns?: number;
}

export function KanbanBoard<T>({
  columns,
  renderCard,
  keyExtractor,
  isLoading = false,
  skeletonColumns = 5,
}: KanbanBoardProps<T>) {
  if (isLoading) {
    return (
      <div className="flex gap-3 p-6 overflow-x-auto">
        {Array.from({ length: skeletonColumns }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 min-w-[220px]">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-6 overflow-x-auto min-h-[400px]">
      {columns.map(col => (
        <div key={col.id} className="flex flex-col gap-2 min-w-[220px] w-[220px] shrink-0">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {col.color && (
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
              )}
              <span className="text-sm font-medium">{col.title}</span>
            </div>
            <Badge variant="secondary" className="text-xs h-5 px-1.5">{col.items.length}</Badge>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-2 min-h-[120px]">
            {col.items.map(item => (
              <div key={keyExtractor(item)}>
                {renderCard(item, columns)}
              </div>
            ))}
            {col.items.length === 0 && (
              <div className="flex items-center justify-center h-20">
                <p className="text-xs text-muted-foreground">No items</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
