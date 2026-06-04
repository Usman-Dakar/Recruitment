import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '../services/calendar.service';
import type { CreateCalendarEntryInput } from '../types/calendar.types';

export function useCreateCalendarEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCalendarEntryInput) => calendarService.createEntry(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['home', 'calendar-entries'] });
      // Cross-module effect: scheduling an evaluation increments widget bar counter
      if (variables.requestEvaluation) {
        queryClient.invalidateQueries({ queryKey: ['home', 'widget-counts'] });
      }
    },
  });
}
