import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home.service';

export function useWidgetCounts() {
  return useQuery({
    queryKey: ['home', 'widget-counts'],
    queryFn: () => homeService.getWidgetCounts(),
    staleTime: 1000 * 60 * 5,
  });
}
