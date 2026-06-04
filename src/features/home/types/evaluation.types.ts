export type EvaluationStatus = 'requested' | 'dismissed' | 'completed';

export interface EvaluationCandidate {
  id: string;
  name: string;
  position: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface EvaluationNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
}

export interface Evaluation {
  id: string;
  candidate: EvaluationCandidate;
  jobTitle: string;
  status: EvaluationStatus;
  requestedAt: Date;
  requestedBy: string;
  template: string;
  questions: InterviewQuestion[];
  notes: EvaluationNote[];
}
