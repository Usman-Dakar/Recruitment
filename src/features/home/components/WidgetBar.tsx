import { CalendarCheck, ClipboardList, UserPlus, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWidgetCounts } from '../hooks/useWidgetCounts';

interface Widget {
  label: string;
  sublabel: string;
  icon: React.ElementType;
  getValue: (counts: ReturnType<typeof useWidgetCounts>['data']) => number | undefined;
}

const WIDGETS: Widget[] = [
  {
    label: 'Evaluations pending',
    sublabel: 'awaiting your review',
    icon: ClipboardList,
    getValue: c => c?.evaluationsPending,
  },
  {
    label: 'Tasks due today',
    sublabel: 'across all candidates',
    icon: CalendarCheck,
    getValue: c => c?.tasksDueToday,
  },
  {
    label: 'New candidates',
    sublabel: 'in the last 24 hours',
    icon: UserPlus,
    getValue: c => c?.newCandidates24h,
  },
  {
    label: 'Interviews today',
    sublabel: 'scheduled',
    icon: Users,
    getValue: c => c?.interviewsToday,
  },
];

export function WidgetBar() {
  const { data, isLoading } = useWidgetCounts();

  return (
    <div className="border-b border-border bg-background px-6 py-3">
      <div className="flex gap-6">
        {WIDGETS.map(widget => {
          const value = widget.getValue(data);
          const Icon = widget.icon;

          return (
            <button
              key={widget.label}
              className="flex min-w-[140px] flex-1 items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent">
                <Icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="mb-1 h-5 w-8" />
                    <Skeleton className="h-3 w-24" />
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold leading-none text-foreground">
                      {value ?? 0}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{widget.label}</p>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
