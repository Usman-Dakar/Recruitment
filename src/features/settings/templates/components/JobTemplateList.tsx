import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobTemplates, useDeleteJobTemplate } from '../hooks';

const TYPE_LABEL: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export function JobTemplateList() {
  const { data: templates, isLoading } = useJobTemplates();
  const deleteMutation = useDeleteJobTemplate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!templates?.length) {
    return <p className="text-sm text-muted-foreground">No job templates yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {templates.map(tpl => (
        <div
          key={tpl.id}
          className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4"
        >
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{tpl.name}</span>
              <Badge variant="secondary">{TYPE_LABEL[tpl.type] ?? tpl.type}</Badge>
              <span className="text-xs text-muted-foreground">{tpl.department}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
            <p className="text-xs text-muted-foreground truncate">
              <span className="font-medium text-foreground">Requirements: </span>
              {tpl.requirements}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() =>
              deleteMutation.mutate(tpl.id, {
                onSuccess: () => toast.success(`"${tpl.name}" deleted`),
                onError: () => toast.error('Failed to delete template'),
              })
            }
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
