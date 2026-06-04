import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { MetricId } from '../types/analytics.types';

const CHART_OPTIONS: { id: MetricId; label: string; description: string }[] = [
  { id: 'applications', label: 'Applications Over Time', description: 'Daily/weekly application trend line' },
  { id: 'pipeline',     label: 'Pipeline Breakdown',    description: 'Candidates at each pipeline stage'  },
  { id: 'sources',      label: 'Application Sources',   description: 'Where your candidates come from'    },
  { id: 'time_to_hire', label: 'Time to Hire',          description: 'Average days to hire per role'      },
];

interface EditMetricsModalProps {
  open: boolean;
  visibleCharts: MetricId[];
  onToggle: (id: MetricId) => void;
  onClose: () => void;
}

export function EditMetricsModal({ open, visibleCharts, onToggle, onClose }: EditMetricsModalProps) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit Metrics</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Choose which charts appear on your dashboard.</p>
        <div className="space-y-2 py-2">
          {CHART_OPTIONS.map(({ id, label, description }) => {
            const isOn = visibleCharts.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                  isOn ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                )}
              >
                <div className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 rounded border-2 transition-colors',
                  isOn ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                )}>
                  {isOn && (
                    <svg viewBox="0 0 10 10" className="h-full w-full" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end pt-1">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
