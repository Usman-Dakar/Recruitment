import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acquisitionsService } from '../services/acquisitions.service';
import { ACQUISITIONS_KEY } from './useAcquisitions';
import type { ImportCandidatesInput } from '../types/acquisitions.types';

export const useToggleSource = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sourceId, isActive }: { sourceId: string; isActive: boolean }) =>
      acquisitionsService.toggleSource(sourceId, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...ACQUISITIONS_KEY, 'sources'] }),
  });
};

export const useImportCandidates = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ImportCandidatesInput) =>
      acquisitionsService.importCandidates(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ACQUISITIONS_KEY }),
  });
};
