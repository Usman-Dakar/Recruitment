export type CalendarViewMode = 'month' | 'week' | 'day';

export type EntryType = 'interview' | 'evaluation' | 'meeting' | 'task';

export interface CalendarEntry {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EntryType;
  notes?: string;
  candidateName?: string;
  cvAttached: boolean;
  isEvaluation: boolean;
}

export interface CreateCalendarEntryInput {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: EntryType;
  notes?: string;
  requestInterview: boolean;
  requestEvaluation: boolean;
}
