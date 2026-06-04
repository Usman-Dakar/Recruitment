export type ActivityType =
  | 'candidate_added'
  | 'evaluation_requested'
  | 'evaluation_completed'
  | 'note_added'
  | 'job_published'
  | 'candidate_advanced'
  | 'task_completed'
  | 'calendar_scheduled';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  actorName: string;
  description: string;
  targetName?: string;
  createdAt: Date;
}

export interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}
