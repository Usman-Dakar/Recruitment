import { useQuery } from '@tanstack/react-query';
import { talentPoolsService } from '../services/talent-pools.service';

export const TALENT_POOLS_KEY = ['talent-pools'] as const;

export const useTalentPools = () =>
  useQuery({
    queryKey: TALENT_POOLS_KEY,
    queryFn: () => talentPoolsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

export const useTalentPoolById = (id: string) =>
  useQuery({
    queryKey: [...TALENT_POOLS_KEY, id],
    queryFn: () => talentPoolsService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
