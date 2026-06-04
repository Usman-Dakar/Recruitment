export type JobStatus = 'draft' | 'published' | 'archived' | 'listed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobDetailTab = 'pipeline' | 'activity' | 'notes';
export type JobActivityType = 'candidate_added' | 'status_changed' | 'note_added' | 'evaluation_scheduled' | 'offer_sent';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string;
  createdAt: Date;
  publishedAt?: Date;
  candidateCount: number;
  referralsEnabled: boolean;
}

export interface JobNote {
  id: string;
  jobId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
}

export interface JobActivityItem {
  id: string;
  jobId: string;
  type: JobActivityType;
  actorName: string;
  description: string;
  createdAt: Date;
}

export interface CreateJobInput {
  title: string;
  department: string;
  location: string;
  type: JobType;
  description?: string;
  requirements?: string;
}

export interface JobFilters {
  search?: string;
  status?: JobStatus;
  page?: number;
  perPage?: number;
}
