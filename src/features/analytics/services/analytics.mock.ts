import { format, subDays, subWeeks, subMonths } from 'date-fns';
import type { AnalyticsData, AnalyticsFilters } from '../types/analytics.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const COUNTS_30D = [2, 5, 3, 1, 4, 6, 2, 3, 7, 4, 2, 5, 3, 1, 6, 4, 2, 8, 3, 5, 2, 4, 6, 3, 1, 5, 7, 4, 2, 3];

function buildApplications(range: AnalyticsFilters['dateRange']) {
  const now = new Date();
  switch (range) {
    case '7d':
      return COUNTS_30D.slice(-7).map((count, i) => ({
        date: format(subDays(now, 6 - i), 'MMM d'),
        count,
      }));
    case '90d':
      return Array.from({ length: 13 }, (_, i) => ({
        date: format(subWeeks(now, 12 - i), 'MMM d'),
        count: (COUNTS_30D[i % 30] ?? 1) * 3 + i,
      }));
    case '1y':
      return Array.from({ length: 12 }, (_, i) => ({
        date: format(subMonths(now, 11 - i), 'MMM'),
        count: ((COUNTS_30D[i % 30] ?? 1) + 2) * 8,
      }));
    default: // 30d
      return COUNTS_30D.map((count, i) => ({
        date: format(subDays(now, 29 - i), 'MMM d'),
        count,
      }));
  }
}

// TODO: replace with API — GET /analytics
export const mockAnalyticsService = {
  getAnalytics: async (filters: AnalyticsFilters): Promise<AnalyticsData> => {
    await delay(400);
    const multiplier = filters.jobId ? 0.4 : 1;
    return {
      overview: {
        totalApplications: Math.round(87 * multiplier),
        activeJobs: filters.jobId ? 1 : 4,
        hired: Math.round(3 * multiplier),
        avgTimeToHire: 18,
        conversionRate: 3.4,
        openPositions: filters.jobId ? 1 : 4,
      },
      applications: buildApplications(filters.dateRange).map(d => ({
        ...d,
        count: Math.round(d.count * multiplier) || 1,
      })),
      pipeline: [
        { stage: 'Applied',     count: Math.round(87 * multiplier), color: '#6366f1' },
        { stage: 'Screening',   count: Math.round(43 * multiplier), color: '#8b5cf6' },
        { stage: 'Interview',   count: Math.round(21 * multiplier), color: '#a78bfa' },
        { stage: 'Assessment',  count: Math.round(8  * multiplier), color: '#c4b5fd' },
        { stage: 'Offer',       count: Math.round(4  * multiplier), color: '#818cf8' },
        { stage: 'Hired',       count: Math.round(3  * multiplier), color: '#22c55e' },
      ],
      sources: [
        { source: 'LinkedIn',   count: 31, percentage: 35 },
        { source: 'Direct',     count: 22, percentage: 25 },
        { source: 'Job Board',  count: 17, percentage: 20 },
        { source: 'Referral',   count: 13, percentage: 15 },
        { source: 'Agency',     count: 4,  percentage: 5  },
      ],
      timeToHire: [
        { job: 'Sr. Frontend',  days: 22 },
        { job: 'Product Mgr',   days: 15 },
        { job: 'Backend Eng.',  days: 18 },
        { job: 'Marketing',     days: 24 },
      ],
    };
  },
};
