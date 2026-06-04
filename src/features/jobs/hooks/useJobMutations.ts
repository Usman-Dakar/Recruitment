import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsService } from '../services/jobs.service';
import type { CreateJobInput, Job } from '../types/job.types';

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJobInput) => jobsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created');
    },
    onError: () => toast.error('Failed to create job'),
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Job['status'] }) =>
      jobsService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['jobs', updated.id], updated);
      const labels: Record<Job['status'], string> = { draft: 'Draft', published: 'Published', listed: 'Listed', archived: 'Archived' };
      toast.success(`Job ${labels[updated.status].toLowerCase()}`);
    },
    onError: () => toast.error('Failed to update job'),
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted');
    },
    onError: () => toast.error('Failed to delete job'),
  });
};

export const useAddJobNote = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => jobsService.addNote(jobId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs', jobId, 'notes'] }),
    onError: () => toast.error('Failed to add note'),
  });
};

export const useDeleteJobNote = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => jobsService.deleteNote(noteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs', jobId, 'notes'] }),
    onError: () => toast.error('Failed to delete note'),
  });
};
