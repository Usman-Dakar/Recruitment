import { addDays, addHours, setHours, setMinutes, startOfDay } from 'date-fns';
import type { CalendarEntry, CreateCalendarEntryInput } from '../types/calendar.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const today = startOfDay(new Date());

function at(day: number, hour: number, durationH = 1): { start: Date; end: Date } {
  const start = setMinutes(setHours(addDays(today, day), hour), 0);
  return { start, end: addHours(start, durationH) };
}

// TODO: replace with API — GET /calendar/entries
const MOCK_ENTRIES: CalendarEntry[] = [
  {
    id: '1',
    title: 'Interview — John Smith',
    ...at(0, 10),
    type: 'interview',
    candidateName: 'John Smith',
    cvAttached: true,
    isEvaluation: false,
  },
  {
    id: '2',
    title: 'Evaluation — Sarah Lee',
    ...at(1, 14),
    type: 'evaluation',
    candidateName: 'Sarah Lee',
    cvAttached: true,
    isEvaluation: true,
  },
  {
    id: '3',
    title: 'Team Sync',
    ...at(2, 9),
    type: 'meeting',
    cvAttached: false,
    isEvaluation: false,
  },
  {
    id: '4',
    title: 'Interview — Mike Chen',
    ...at(3, 11),
    type: 'interview',
    candidateName: 'Mike Chen',
    cvAttached: false,
    isEvaluation: false,
  },
  {
    id: '5',
    title: 'Pipeline Review',
    ...at(5, 15),
    type: 'meeting',
    cvAttached: false,
    isEvaluation: false,
  },
  {
    id: '6',
    title: 'Evaluation — Priya Nair',
    ...at(7, 13),
    type: 'evaluation',
    candidateName: 'Priya Nair',
    cvAttached: true,
    isEvaluation: true,
  },
  {
    id: '7',
    title: 'Follow-up call',
    ...at(-2, 16),
    type: 'task',
    cvAttached: false,
    isEvaluation: false,
  },
];

let entries = [...MOCK_ENTRIES];

export async function mockGetCalendarEntries(): Promise<CalendarEntry[]> {
  await delay(300);
  return entries;
}

// TODO: replace with API — POST /calendar/entries
export async function mockCreateCalendarEntry(
  input: CreateCalendarEntryInput,
): Promise<CalendarEntry> {
  await delay(500);
  const dateParts = input.date.split('-');
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]);
  const day = Number(dateParts[2]);
  const timeParts = input.startTime.split(':');
  const sh = Number(timeParts[0]);
  const sm = Number(timeParts[1]);
  const endParts = input.endTime.split(':');
  const eh = Number(endParts[0]);
  const em = Number(endParts[1]);
  const start = new Date(year, month - 1, day, sh, sm);
  const end = new Date(year, month - 1, day, eh, em);
  const entry: CalendarEntry = {
    id: String(Date.now()),
    title: input.title,
    start,
    end,
    type: input.type,
    ...(input.notes !== undefined && { notes: input.notes }),
    cvAttached: false,
    isEvaluation: input.requestEvaluation,
  };
  entries = [...entries, entry];
  return entry;
}
