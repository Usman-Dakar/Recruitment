import { subDays, subHours, subMinutes } from 'date-fns';
import type { ActivityItem } from '../types/activity.types';
import type { PaginatedResponse } from '@/types/api.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const t = new Date();

// TODO: replace with API — GET /activity
const FEED: ActivityItem[] = [
  { id: 'a1',  type: 'evaluation_completed',  actorName: 'Anas Khan', description: 'completed an evaluation for',        targetName: 'John Smith',        createdAt: subMinutes(t, 15) },
  { id: 'a2',  type: 'note_added',             actorName: 'Maria G.',  description: 'added a note on',                   targetName: 'Sarah Lee',         createdAt: subMinutes(t, 42) },
  { id: 'a3',  type: 'calendar_scheduled',     actorName: 'Anas Khan', description: 'scheduled an interview with',       targetName: 'Priya Nair',        createdAt: subHours(t, 1) },
  { id: 'a4',  type: 'task_completed',         actorName: 'Anas Khan', description: 'completed task "Send technical assessment"',                          createdAt: subHours(t, 2) },
  { id: 'a5',  type: 'candidate_advanced',     actorName: 'Maria G.',  description: 'moved',                             targetName: 'Mike Chen',         createdAt: subHours(t, 3) },
  { id: 'a6',  type: 'evaluation_requested',   actorName: 'Tom K.',    description: 'requested an evaluation for',       targetName: 'Priya Nair',        createdAt: subHours(t, 5) },
  { id: 'a7',  type: 'candidate_added',        actorName: 'Anas Khan', description: 'added',                             targetName: 'Alex Rivera',       createdAt: subHours(t, 8) },
  { id: 'a8',  type: 'job_published',          actorName: 'Maria G.',  description: 'published the job',                 targetName: 'Backend Engineer',  createdAt: subDays(t, 1) },
  { id: 'a9',  type: 'evaluation_completed',   actorName: 'Tom K.',    description: 'completed an evaluation for',       targetName: 'Sarah Lee',         createdAt: subDays(t, 1) },
  { id: 'a10', type: 'note_added',             actorName: 'Anas Khan', description: 'added a note on',                   targetName: 'Mike Chen',         createdAt: subDays(t, 1) },
  { id: 'a11', type: 'candidate_added',        actorName: 'Maria G.',  description: 'added',                             targetName: 'Zara Ahmed',        createdAt: subDays(t, 2) },
  { id: 'a12', type: 'task_completed',         actorName: 'Tom K.',    description: 'completed task "Verify references"',                                 createdAt: subDays(t, 2) },
  { id: 'a13', type: 'job_published',          actorName: 'Anas Khan', description: 'published the job',                 targetName: 'Frontend Engineer', createdAt: subDays(t, 3) },
  { id: 'a14', type: 'note_added',             actorName: 'Tom K.',    description: 'added a note on',                   targetName: 'Lena Fischer',      createdAt: subDays(t, 3) },
  { id: 'a15', type: 'candidate_advanced',     actorName: 'Maria G.',  description: 'moved',                             targetName: 'Tom Kowalski',      createdAt: subDays(t, 4) },
  { id: 'a16', type: 'evaluation_requested',   actorName: 'Anas Khan', description: 'requested an evaluation for',       targetName: 'Zara Ahmed',        createdAt: subDays(t, 4) },
  { id: 'a17', type: 'calendar_scheduled',     actorName: 'Tom K.',    description: 'scheduled an interview with',       targetName: 'Alex Rivera',       createdAt: subDays(t, 5) },
  { id: 'a18', type: 'task_completed',         actorName: 'Maria G.',  description: 'completed task "Update job description"',                            createdAt: subDays(t, 5) },
  { id: 'a19', type: 'candidate_added',        actorName: 'Tom K.',    description: 'added',                             targetName: 'Priya Nair',        createdAt: subDays(t, 6) },
  { id: 'a20', type: 'job_published',          actorName: 'Maria G.',  description: 'published the job',                 targetName: 'UX Designer',       createdAt: subDays(t, 7) },
];

export async function mockGetActivityFeed(): Promise<ActivityItem[]> {
  await delay(400);
  return FEED;
}

// TODO: replace with API — GET /activity?page=&perPage=
export async function mockGetActivityFeedPaginated(
  page: number,
  perPage: number,
): Promise<PaginatedResponse<ActivityItem>> {
  await delay(350);
  const total = FEED.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const data = FEED.slice((page - 1) * perPage, page * perPage);
  return { data, meta: { total, page, perPage, lastPage } };
}
