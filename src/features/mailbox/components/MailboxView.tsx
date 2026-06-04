import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmailThreads, useFolderCounts } from '../hooks/useMailbox';
import type { MailFolder } from '../types/mailbox.types';
import { ComposeModal } from './ComposeModal';
import { EmailList } from './EmailList';
import { EmailThreadView } from './EmailThreadView';
import { FolderList } from './FolderList';

export function MailboxView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [composeOpen, setComposeOpen] = useState(false);

  const folder = (searchParams.get('folder') as MailFolder) ?? 'inbox';
  const selectedThreadId = searchParams.get('thread') ?? '';

  const { data: threads, isLoading } = useEmailThreads(folder);
  const { data: counts } = useFolderCounts();

  const setFolder = (f: MailFolder) => setSearchParams({ folder: f });

  const selectThread = (id: string) => {
    const next = Object.fromEntries(searchParams.entries());
    next['thread'] = id;
    setSearchParams(next);
  };

  return (
    <>
      <div className="flex h-full overflow-hidden">
        <div className="flex w-72 shrink-0 flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h1 className="text-sm font-semibold">Mailbox</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Compose" onClick={() => setComposeOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <FolderList active={folder} counts={counts ?? {}} onSelect={setFolder} />
          <div className="flex flex-1 flex-col overflow-y-auto border-t border-border">
            <EmailList
              threads={threads ?? []}
              isLoading={isLoading}
              selectedId={selectedThreadId || null}
              onSelect={selectThread}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedThreadId ? (
            <EmailThreadView threadId={selectedThreadId} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">Select a conversation to read</p>
            </div>
          )}
        </div>
      </div>

      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
    </>
  );
}
