export interface NoteReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
}

export interface CandidateNote {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isOwn: boolean;
  candidateId: string;
  candidateName: string;
  replies: NoteReply[];
}
