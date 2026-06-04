import { useQuery } from '@tanstack/react-query';
import { calendarService } from '../services/calendar.service';

export function useCalendarEntries() {
  return useQuery({
    queryKey: ['home', 'calendar-entries'],
    queryFn: () => calendarService.getEntries(),
    staleTime: 1000 * 60 * 5,
  });
}
