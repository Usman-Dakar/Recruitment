import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import {
  ArrowRight, Briefcase, Calendar, CheckCircle2, CheckSquare,
  ClipboardList, MessageSquare, UserPlus,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActivityItem, ActivityType } from '../types/activity.types';

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  candidate_added:      { icon: UserPlus,      color: 'text-primary bg-accent' },
  evaluation_requested: { icon: ClipboardList,  color: 'text-amber-600 bg-amber-100' },
  evaluation_completed: { icon: CheckCircle2,   color: 'text-green-600 bg-green-100' },
  note_added:           { icon: MessageSquare,  color: 'text-blue-600 bg-blue-100' },
  job_published:        { icon: Briefcase,      color: 'text-purple-600 bg-purple-100' },
  candidate_advanced:   { icon: ArrowRight,     color: 'text-orange-600 bg-orange-100' },
  task_completed:       { icon: CheckSquare,    color: 'text-green-600 bg-green-100' },
  calendar_scheduled:   { icon: Calendar,       color: 'text-primary bg-accent' },
};

function dayLabel(date: Date): string {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

function groupByDay(items: ActivityItem[]): [string, ActivityItem[]][] {
  const map = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const key = dayLabel(item.createdAt);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return Array.from(map.entries());
}

interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading: boolean;
}

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No activity yet.</p>;
  }

  const groups = groupByDay(items);

  return (
    <div className="divide-y divide-border">
      {groups.map(([label, groupItems]) => (
        <div key={label} className="px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div className="space-y-4">
            {groupItems.map(item => {
              const { icon: Icon, color } = ACTIVITY_CONFIG[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.actorName}</span>
                      {' '}
                      {item.description}
                      {item.targetName && (
                        <span className="font-medium"> {item.targetName}</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                    </p>
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
