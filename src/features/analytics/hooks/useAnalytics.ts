import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';
import type { AnalyticsFilters } from '../types/analytics.types';

export const useAnalytics = (filters: AnalyticsFilters) =>
  useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsService.getAnalytics(filters),
    staleTime: 1000 * 60 * 5,
  });
