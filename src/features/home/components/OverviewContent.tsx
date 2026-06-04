import { formatDistanceToNow } from 'date-fns';
import { useWidgetCounts } from '../hooks/useWidgetCounts';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { Skeleton } from '@/components/ui/skeleton';

export function OverviewContent() {
  const { data } = useWidgetCounts();
  const { data: activity, isLoading: activityLoading } = useActivityFeed();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Good morning</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Here's what's happening across your hiring pipeline.
        </p>
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            label="Evaluations pending"
            value={data.evaluationsPending}
            description="Need your attention"
          />
          <SummaryCard
            label="Tasks due today"
            value={data.tasksDueToday}
            description="Across all candidates"
          />
          <SummaryCard
            label="New candidates"
            value={data.newCandidates24h}
            description="Last 24 hours"
          />
          <SummaryCard
            label="Interviews today"
            value={data.interviewsToday}
            description="Scheduled"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Recent activity</h3>
        {activityLoading && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        )}
        {!activityLoading && (!activity || activity.length === 0) && (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
        {!activityLoading && activity && activity.length > 0 && (
          <div className="rounded-lg border divide-y">
            {activity.slice(0, 8).map(item => (
              <div key={item.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{item.actorName}</span>{' '}
                    <span className="text-muted-foreground">{item.description}</span>
                    {item.targetName && (
                      <span className="font-medium"> {item.targetName}</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  description: string;
}

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
