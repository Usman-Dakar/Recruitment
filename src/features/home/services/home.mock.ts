import type { WidgetCounts } from '../types/home.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// TODO: replace with API — GET /home/widget-counts
export async function mockGetWidgetCounts(): Promise<WidgetCounts> {
  await delay(400);
  return {
    evaluationsPending: 7,
    tasksDueToday: 3,
    newCandidates24h: 12,
    interviewsToday: 2,
  };
}
