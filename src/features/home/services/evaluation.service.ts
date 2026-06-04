import type { Evaluation } from '../types/evaluation.types';
import {
  mockGetEvaluations,
  mockDismissEvaluation,
  mockRetrieveEvaluation,
  mockCompleteEvaluation,
  mockAddNote,
  mockDeleteNote,
} from './evaluation.mock';

export const evaluationService = {
  getAll: (): Promise<Evaluation[]> => mockGetEvaluations(),
  dismiss: (id: string): Promise<void> => mockDismissEvaluation(id),
  retrieve: (id: string): Promise<void> => mockRetrieveEvaluation(id),
  complete: (id: string): Promise<void> => mockCompleteEvaluation(id),
  addNote: (evaluationId: string, content: string): Promise<void> => mockAddNote(evaluationId, content),
  deleteNote: (evaluationId: string, noteId: string): Promise<void> => mockDeleteNote(evaluationId, noteId),
};
