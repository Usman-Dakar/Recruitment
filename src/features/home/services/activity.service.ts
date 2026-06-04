import type { ActivityItem } from '../types/activity.types';
import type { PaginatedResponse } from '@/types/api.types';
import { mockGetActivityFeed, mockGetActivityFeedPaginated } from './activity.mock';

export const activityService = {
  getFeed: (): Promise<ActivityItem[]> => mockGetActivityFeed(),
  getFeedPaginated: (page: number, perPage: number): Promise<PaginatedResponse<ActivityItem>> =>
    mockGetActivityFeedPaginated(page, perPage),
};
