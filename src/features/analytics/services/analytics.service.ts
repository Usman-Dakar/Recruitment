import type { AnalyticsData, AnalyticsFilters } from '../types/analytics.types';
import { mockAnalyticsService } from './analytics.mock';

export const analyticsService = {
  getAnalytics: (filters: AnalyticsFilters): Promise<AnalyticsData> =>
    mockAnalyticsService.getAnalytics(filters), // TODO: replace with API — GET /analytics
};
