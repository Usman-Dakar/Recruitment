import { FileText, Mail, Send, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MailFolder, FolderCounts } from '../types/mailbox.types';

const FOLDERS: { id: MailFolder; label: string; icon: LucideIcon }[] = [
  { id: 'inbox', label: 'Inbox', icon: Mail },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'trash', label: 'Trash', icon: Trash2 },
];

interface FolderListProps {
  active: MailFolder;
  counts: Partial<FolderCounts>;
  onSelect: (folder: MailFolder) => void;
}

export function FolderList({ active, counts, onSelect }: FolderListProps) {
  return (
    <div className="space-y-0.5 p-2">
      {FOLDERS.map(({ id, label, icon: Icon }) => {
        const count = counts[id] ?? 0;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              active === id
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {count > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground leading-5">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
