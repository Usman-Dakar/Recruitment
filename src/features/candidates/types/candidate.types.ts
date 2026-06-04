export type CandidateStatus = 'new' | 'in_review' | 'interview' | 'offer' | 'hired' | 'rejected';
export type CandidateOrigin = 'direct' | 'referral' | 'linkedin' | 'job_board' | 'agency';

export interface ProfileNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: CandidateStatus;
  origin: CandidateOrigin;
  referredBy?: string;
  roles: string[];
  tags: string[];
  appliedAt: Date;
  location?: string;
  profileNotes: ProfileNote[];
  stageId?: string;
}

export interface CandidateFilters {
  search?: string;
  status?: CandidateStatus;
  origin?: CandidateOrigin;
  jobId?: string;
  page?: number;
  perPage?: number;
}

export interface CreateCandidateInput {
  name: string;
  email: string;
  phone?: string;
  position: string;
  origin: CandidateOrigin;
  referredBy?: string;
}
