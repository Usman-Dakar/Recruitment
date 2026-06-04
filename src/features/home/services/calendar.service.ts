import type { CalendarEntry, CreateCalendarEntryInput } from '../types/calendar.types';
import { mockGetCalendarEntries, mockCreateCalendarEntry } from './calendar.mock';

export const calendarService = {
  getEntries: (): Promise<CalendarEntry[]> => mockGetCalendarEntries(),
  createEntry: (input: CreateCalendarEntryInput): Promise<CalendarEntry> =>
    mockCreateCalendarEntry(input),
};
