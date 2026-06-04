import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mailboxService } from '../services/mailbox.service';
import type { ComposeEmailInput } from '../types/mailbox.types';

export const useMarkThreadRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threadId: string) => mailboxService.markRead(threadId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mailbox'] }),
  });
};

export const useSendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ComposeEmailInput) => mailboxService.sendEmail(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailbox'] });
      toast.success('Email sent');
    },
    onError: () => toast.error('Failed to send email'),
  });
};

export const useReplyToThread = (threadId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => mailboxService.reply(threadId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailbox', 'thread', threadId] });
      queryClient.invalidateQueries({ queryKey: ['mailbox'] });
    },
    onError: () => toast.error('Failed to send reply'),
  });
};

export const useDeleteThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mailboxService.deleteThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailbox'] });
      toast.success('Deleted');
    },
  });
};
