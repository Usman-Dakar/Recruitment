import { formatDistanceToNow, isToday } from 'date-fns';
import {
  ArrowRight, Briefcase, Calendar, CheckCircle2, CheckSquare,
  ClipboardList, Loader2, MessageSquare, UserPlus,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActivityFeedInfinite } from '@/features/home';
import type { ActivityType } from '@/features/home/types/activity.types';

const ACTIVITY_ICON: Record<ActivityType, { icon: React.ElementType; color: string }> = {
  candidate_added:      { icon: UserPlus,      color: 'bg-accent text-primary' },
  evaluation_requested: { icon: ClipboardList,  color: 'bg-amber-100 text-amber-600' },
  evaluation_completed: { icon: CheckCircle2,   color: 'bg-green-100 text-green-600' },
  note_added:           { icon: MessageSquare,  color: 'bg-blue-100 text-blue-600' },
  job_published:        { icon: Briefcase,      color: 'bg-purple-100 text-purple-600' },
  candidate_advanced:   { icon: ArrowRight,     color: 'bg-orange-100 text-orange-600' },
  task_completed:       { icon: CheckSquare,    color: 'bg-green-100 text-green-600' },
  calendar_scheduled:   { icon: Calendar,       color: 'bg-accent text-primary' },
};

export function NotificationBell() {
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivityFeedInfinite();
  const [read, setRead] = useState(false);

  const allItems = data?.pages.flatMap(p => p.data) ?? [];
  const unreadCount = !read ? allItems.filter(i => isToday(i.createdAt)).length : 0;

  // Callback refs so the effect re-runs when the dropdown DOM elements actually mount
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!sentinel || !scrollContainer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) loadMore(); },
      { root: scrollContainer, rootMargin: '80px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, scrollContainer, sentinel]);

  return (
    <DropdownMenu onOpenChange={open => { if (open) setRead(true); }}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} new today</span>
          )}
        </div>

        {/* Scrollable list — sentinel triggers next page load */}
        <div ref={setScrollContainer} className="max-h-[380px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isLoading && (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && allItems.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No notifications</p>
          )}

          {allItems.map(item => {
            const { icon: Icon, color } = ACTIVITY_ICON[item.type];
            return (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-medium">{item.actorName}</span>
                    {' '}{item.description}
                    {item.targetName && <span className="font-medium"> {item.targetName}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Sentinel div — callback ref triggers effect when dropdown mounts */}
          <div ref={setSentinel} className="h-1" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="border-t border-border p-2">
          <button
            onClick={() => navigate('/home?tab=activity')}
            className="w-full rounded-md px-3 py-2 text-center text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            View all activity
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
