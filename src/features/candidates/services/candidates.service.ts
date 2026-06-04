import type { CandidateFilters, CreateCandidateInput } from '../types/candidate.types';
import { mockGetCandidates, mockGetCandidateById, mockCreateCandidate, mockAddProfileNote, mockMoveToStage } from './candidates.mock';

export const candidatesService = {
  getAll: (filters: CandidateFilters) => mockGetCandidates(filters),
  getById: (id: string) => mockGetCandidateById(id),
  create: (input: CreateCandidateInput) => mockCreateCandidate(input),
  addProfileNote: (candidateId: string, content: string) => mockAddProfileNote(candidateId, content),
  moveToStage: (candidateId: string, stageId: string) => mockMoveToStage(candidateId, stageId),
};
