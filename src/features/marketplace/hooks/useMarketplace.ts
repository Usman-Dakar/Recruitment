import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '../services/marketplace.service';
import type { MarketplaceFilters } from '../types/marketplace.types';

export const MARKETPLACE_KEY = ['marketplace'] as const;

export const usePlugins = (filters?: MarketplaceFilters) =>
  useQuery({
    queryKey: [...MARKETPLACE_KEY, 'plugins', filters ?? {}],
    queryFn: () => marketplaceService.getPlugins(filters),
    staleTime: 1000 * 60 * 5,
  });
