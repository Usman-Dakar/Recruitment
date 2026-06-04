import { useQuery } from '@tanstack/react-query';
import { acquisitionsService } from '../services/acquisitions.service';

export const ACQUISITIONS_KEY = ['acquisitions'] as const;

export const useAcquisitionSources = () =>
  useQuery({
    queryKey: [...ACQUISITIONS_KEY, 'sources'],
    queryFn: () => acquisitionsService.getSources(),
    staleTime: 1000 * 60 * 5,
  });

export const useAcquisitionEntries = (sourceId?: string) =>
  useQuery({
    queryKey: [...ACQUISITIONS_KEY, 'entries', sourceId ?? 'all'],
    queryFn: () => acquisitionsService.getEntries(sourceId),
    staleTime: 1000 * 60 * 2,
  });
