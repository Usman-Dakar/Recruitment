import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useEmailThread } from '../hooks/useMailbox';
import { useMarkThreadRead, useReplyToThread } from '../hooks/useMailboxMutations';
import type { EmailMessage } from '../types/mailbox.types';

interface EmailThreadViewProps { threadId: string; }

export function EmailThreadView({ threadId }: EmailThreadViewProps) {
  const [reply, setReply] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: thread, isLoading } = useEmailThread(threadId);
  const { mutate: markRead } = useMarkThreadRead();
  const { mutate: sendReply, isPending } = useReplyToThread(threadId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.id]);

  useEffect(() => {
    if (thread && !thread.isRead) markRead(threadId);
  }, [thread?.id, thread?.isRead, threadId, markRead]);

  const handleSend = () => {
    const body = reply.trim();
    if (!body) return;
    sendReply(body, { onSuccess: () => setReply('') });
  };

  if (isLoading) return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-5 w-80" />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-3.5 w-36" /><Skeleton className="h-3 w-24" /></div></div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );

  if (!thread) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-6 py-3 shrink-0">
        <h2 className="font-semibold text-sm">{thread.subject}</h2>
        {thread.candidateName && (
          <Link to={`/candidates/${thread.candidateId}`} className="text-xs text-primary hover:underline">
            {thread.candidateName}
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {thread.messages.map(msg => <MessageCard key={msg.id} message={msg} />)}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4 shrink-0">
        <Textarea
          placeholder="Write a reply… (Ctrl+Enter to send)"
          rows={3}
          className="mb-2 resize-none text-sm"
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
        />
        <div className="flex justify-end">
          <Button size="sm" className="gap-1.5" disabled={!reply.trim() || isPending} onClick={handleSend}>
            <Send className="h-3.5 w-3.5" />
            {isPending ? 'Sending…' : 'Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageCard({ message }: { message: EmailMessage }) {
  const initials = message.from.name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className={cn('rounded-lg border border-border p-4', message.isOwn && 'bg-muted/30')}>
      <div className="mb-3 flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{message.from.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{format(message.sentAt, 'MMM d, h:mm a')}</span>
          </div>
          <p className="text-xs text-muted-foreground">To: {message.to.map(r => r.name).join(', ')}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
    </div>
  );
}
