export interface WidgetCount {
  id: string;
  label: string;
  count: number;
  sublabel?: string;
}

export interface WidgetCounts {
  evaluationsPending: number;
  tasksDueToday: number;
  newCandidates24h: number;
  interviewsToday: number;
}

export type HomeTab = 'overview' | 'calendar' | 'evaluations' | 'tasks' | 'notes' | 'activity';
