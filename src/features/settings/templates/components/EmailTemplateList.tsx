import { Trash2, Eye, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmailTemplates, useDeleteEmailTemplate } from '../hooks';
import type { TemplateVisibility } from '../types/templates.types';

const VISIBILITY_CONFIG: Record<TemplateVisibility, { label: string; icon: React.ElementType }> = {
  public: { label: 'Public', icon: Eye },
  team: { label: 'Team', icon: Users },
  private: { label: 'Private', icon: Lock },
};

export function EmailTemplateList() {
  const { data: templates, isLoading } = useEmailTemplates();
  const deleteMutation = useDeleteEmailTemplate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!templates?.length) {
    return <p className="text-sm text-muted-foreground">No email templates yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {templates.map(tpl => {
        const vis = VISIBILITY_CONFIG[tpl.visibility];
        const VisIcon = vis.icon;
        return (
          <div
            key={tpl.id}
            className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">{tpl.name}</span>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <VisIcon className="h-3 w-3" />
                  {vis.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                <span className="font-medium text-foreground">Subject: </span>
                {tpl.subject}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">{tpl.body}</p>
              {tpl.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {tpl.variables.map(v => (
                    <span
                      key={v}
                      className="inline-block px-1.5 py-0.5 rounded bg-muted text-xs font-mono"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
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
        );
      })}
    </div>
  );
}
