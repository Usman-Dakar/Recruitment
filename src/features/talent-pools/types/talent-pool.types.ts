export interface TalentPool {
  id: string;
  name: string;
  description: string;
  candidateIds: string[];
  createdAt: Date;
}

export interface CreateTalentPoolInput {
  name: string;
  description?: string;
}
