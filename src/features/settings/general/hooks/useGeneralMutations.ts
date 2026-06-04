import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generalService } from '../services/general.service';
import { GENERAL_KEY } from './useGeneralSettings';
import type { CompanyInfo } from '../types/general.types';

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CompanyInfo) => generalService.updateCompany(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...GENERAL_KEY, 'company'] }),
  });
};

export const useAddLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => generalService.addLocation(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...GENERAL_KEY, 'locations'] }),
  });
};

export const useDeleteLocation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => generalService.deleteLocation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...GENERAL_KEY, 'locations'] }),
  });
};
