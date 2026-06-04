import { useQuery } from '@tanstack/react-query';
import { mailboxService } from '../services/mailbox.service';
import type { MailFolder } from '../types/mailbox.types';

export const useEmailThreads = (folder: MailFolder) =>
  useQuery({
    queryKey: ['mailbox', folder],
    queryFn: () => mailboxService.getThreads(folder),
    staleTime: 1000 * 60,
  });

export const useEmailThread = (id: string) =>
  useQuery({
    queryKey: ['mailbox', 'thread', id],
    queryFn: () => mailboxService.getThread(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

export const useFolderCounts = () =>
  useQuery({
    queryKey: ['mailbox', 'counts'],
    queryFn: () => mailboxService.getFolderCounts(),
    staleTime: 1000 * 60,
  });
