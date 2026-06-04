import { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, Eye, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuestionnaires, useDeleteQuestionnaire } from '../hooks';
import type { TemplateVisibility, QuestionType } from '../types/templates.types';

const VISIBILITY_CONFIG: Record<TemplateVisibility, { label: string; icon: React.ElementType }> = {
  public: { label: 'Public', icon: Eye },
  team: { label: 'Team', icon: Users },
  private: { label: 'Private', icon: Lock },
};

const Q_TYPE_LABEL: Record<QuestionType, string> = {
  text: 'Text',
  rating: 'Rating',
  yes_no: 'Yes/No',
};

export function QuestionnaireList() {
  const { data: questionnaires, isLoading } = useQuestionnaires();
  const deleteMutation = useDeleteQuestionnaire();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (!questionnaires?.length) {
    return <p className="text-sm text-muted-foreground">No questionnaires yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {questionnaires.map(q => {
        const vis = VISIBILITY_CONFIG[q.visibility];
        const VisIcon = vis.icon;
        const isOpen = expanded === q.id;
        return (
          <div key={q.id} className="rounded-lg border bg-card overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{q.name}</span>
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <VisIcon className="h-3 w-3" />
                    {vis.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {q.questions.length} question{q.questions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {q.description && (
                  <p className="text-xs text-muted-foreground">{q.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpanded(isOpen ? null : q.id)}
                >
                  {isOpen
                    ? <ChevronDown className="h-4 w-4" />
                    : <ChevronRight className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    deleteMutation.mutate(q.id, {
                      onSuccess: () => toast.success(`"${q.name}" deleted`),
                      onError: () => toast.error('Failed to delete questionnaire'),
                    })
                  }
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isOpen && (
              <div className="border-t bg-muted/30 px-4 py-3 flex flex-col gap-2">
                {q.questions.map((question, idx) => (
                  <div key={question.id} className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground w-4 shrink-0 pt-0.5">
                      {idx + 1}.
                    </span>
                    <span className="text-sm flex-1">{question.text}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {Q_TYPE_LABEL[question.type]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
