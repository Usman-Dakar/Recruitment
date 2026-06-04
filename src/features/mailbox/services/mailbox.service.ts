import type { EmailThread, ComposeEmailInput, FolderCounts } from '../types/mailbox.types';
import { mockMailboxService } from './mailbox.mock';

export const mailboxService = {
  getThreads: (folder: string): Promise<EmailThread[]> =>
    mockMailboxService.getThreads(folder), // TODO: replace with API — GET /mailbox/threads?folder=:folder
  getThread: (id: string): Promise<EmailThread | null> =>
    mockMailboxService.getThread(id), // TODO: replace with API — GET /mailbox/threads/:id
  getFolderCounts: (): Promise<FolderCounts> =>
    mockMailboxService.getFolderCounts(), // TODO: replace with API — GET /mailbox/counts
  markRead: (threadId: string): Promise<void> =>
    mockMailboxService.markRead(threadId), // TODO: replace with API — PATCH /mailbox/threads/:id/read
  sendEmail: (input: ComposeEmailInput): Promise<void> =>
    mockMailboxService.sendEmail(input), // TODO: replace with API — POST /mailbox/send
  reply: (threadId: string, body: string): Promise<void> =>
    mockMailboxService.reply(threadId, body), // TODO: replace with API — POST /mailbox/threads/:id/reply
  deleteThread: (id: string): Promise<void> =>
    mockMailboxService.deleteThread(id), // TODO: replace with API — DELETE /mailbox/threads/:id
};
