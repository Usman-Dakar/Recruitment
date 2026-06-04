import { useMutation, useQueryClient } from '@tanstack/react-query';
import { talentPoolsService } from '../services/talent-pools.service';
import { TALENT_POOLS_KEY } from './useTalentPools';
import type { CreateTalentPoolInput } from '../types/talent-pool.types';

export const useCreateTalentPool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTalentPoolInput) => talentPoolsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: TALENT_POOLS_KEY }),
  });
};

export const useDeleteTalentPool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => talentPoolsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TALENT_POOLS_KEY }),
  });
};

export const useAddCandidatesToPool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ poolId, candidateIds }: { poolId: string; candidateIds: string[] }) =>
      talentPoolsService.addCandidates(poolId, candidateIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: TALENT_POOLS_KEY }),
  });
};

export const useRemoveCandidateFromPool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ poolId, candidateId }: { poolId: string; candidateId: string }) =>
      talentPoolsService.removeCandidate(poolId, candidateId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TALENT_POOLS_KEY }),
  });
};
