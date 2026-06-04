import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';

const PER_PAGE = 8;

export function useActivityFeed() {
  return useQuery({
    queryKey: ['home', 'activity'],
    queryFn: () => activityService.getFeed(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useActivityFeedInfinite() {
  return useInfiniteQuery({
    queryKey: ['home', 'activity', 'infinite'],
    queryFn: ({ pageParam }) => activityService.getFeedPaginated(pageParam, PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.meta.page < last.meta.lastPage ? last.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  });
}
