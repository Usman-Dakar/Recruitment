import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { Briefcase, CheckCircle2, FileText, UserPlus, Calendar, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobActivity } from '../hooks/useJobs';
import type { JobActivityItem, JobActivityType } from '../types/job.types';

const TYPE_CONFIG: Record<JobActivityType, { icon: typeof Briefcase; color: string }> = {
  candidate_added:      { icon: UserPlus,     color: 'bg-blue-100 text-blue-600' },
  status_changed:       { icon: Briefcase,    color: 'bg-slate-100 text-slate-600' },
  note_added:           { icon: FileText,     color: 'bg-amber-100 text-amber-600' },
  evaluation_scheduled: { icon: Calendar,     color: 'bg-purple-100 text-purple-600' },
  offer_sent:           { icon: Send,         color: 'bg-emerald-100 text-emerald-600' },
};

function dayLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

function groupByDay(items: JobActivityItem[]) {
  const groups: { label: string; items: JobActivityItem[] }[] = [];
  const seen = new Map<string, number>();
  for (const item of items) {
    const label = dayLabel(item.createdAt);
    const idx = seen.get(label);
    if (idx !== undefined) {
      groups[idx]?.items.push(item);
    } else {
      seen.set(label, groups.length);
      groups.push({ label, items: [item] });
    }
  }
  return groups;
}

interface JobActivityProps { jobId: string; }

export function JobActivity({ jobId }: JobActivityProps) {
  const { data: activities, isLoading } = useJobActivity(jobId);

  if (isLoading) return (
    <div className="space-y-3 p-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-48" /><Skeleton className="h-3 w-24" /></div></div>
      ))}
    </div>
  );

  if (!activities?.length) return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <CheckCircle2 className="mb-3 h-8 w-8 opacity-40" />
      <p className="text-sm">No activity yet</p>
    </div>
  );

  const groups = groupByDay(activities);

  return (
    <div className="overflow-y-auto p-6 space-y-6">
      {groups.map(({ label, items }) => (
        <div key={label}>
          <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <div className="space-y-3">
            {items.map(item => {
              const { icon: Icon, color } = TYPE_CONFIG[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm text-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.actorName} · {formatDistanceToNow(item.createdAt, { addSuffix: true })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
