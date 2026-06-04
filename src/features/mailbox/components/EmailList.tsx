import { formatDistanceToNow } from 'date-fns';
import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { EmailThread } from '../types/mailbox.types';

interface EmailListProps {
  threads: EmailThread[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function EmailList({ threads, isLoading, selectedId, onSelect }: EmailListProps) {
  if (isLoading) return <EmailListSkeleton />;

  if (!threads.length) return (
    <EmptyState icon={Inbox} title="No messages" className="m-4" />
  );

  return (
    <div className="divide-y divide-border">
      {threads.map(thread => {
        const lastMsg = thread.messages[thread.messages.length - 1];
        const senderName = lastMsg?.isOwn ? 'You' : (lastMsg?.from.name ?? '');
        const preview = lastMsg?.body.split('\n').find(l => l.trim()) ?? '';
        return (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={cn(
              'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/50',
              selectedId === thread.id && 'bg-muted',
              !thread.isRead && 'bg-primary/5',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn('truncate text-sm', !thread.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>
                {senderName}
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {formatDistanceToNow(thread.updatedAt, { addSuffix: false })}
              </span>
            </div>
            <span className={cn('truncate text-sm', !thread.isRead ? 'font-medium text-foreground' : 'text-muted-foreground')}>
              {thread.subject}
            </span>
            <span className="truncate text-xs text-muted-foreground">{preview}</span>
            {thread.candidateName && (
              <span className="text-[11px] font-medium text-primary">{thread.candidateName}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function EmailListSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between"><Skeleton className="h-3.5 w-24" /><Skeleton className="h-3 w-10" /></div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
