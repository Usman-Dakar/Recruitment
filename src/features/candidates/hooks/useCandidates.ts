import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { candidatesService } from '../services/candidates.service';
import type { CandidateFilters } from '../types/candidate.types';

const PER_PAGE = 5;

export function useCandidatesInfinite(filters: Omit<CandidateFilters, 'page' | 'perPage'>) {
  return useInfiniteQuery({
    queryKey: ['candidates', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      candidatesService.getAll({ ...filters, page: pageParam, perPage: PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.meta.page < last.meta.lastPage ? last.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCandidates(
  filters: CandidateFilters,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => candidatesService.getAll(filters),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });
}

export function useCandidateById(id: string) {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: () => candidatesService.getById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
