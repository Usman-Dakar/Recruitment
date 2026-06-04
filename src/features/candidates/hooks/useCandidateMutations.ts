import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { candidatesService } from '../services/candidates.service';
import type { CreateCandidateInput } from '../types/candidate.types';

export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCandidateInput) => candidatesService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate added');
    },
    onError: () => toast.error('Failed to add candidate'),
  });
}

export function useMoveToStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ candidateId, stageId }: { candidateId: string; stageId: string }) =>
      candidatesService.moveToStage(candidateId, stageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidates'] }),
    onError: () => toast.error('Failed to move candidate'),
  });
}

export function useAddProfileNote(candidateId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => candidatesService.addProfileNote(candidateId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['candidates', candidateId] }),
    onError: () => toast.error('Failed to add note'),
  });
}
