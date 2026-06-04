import { useMutation, useQueryClient } from '@tanstack/react-query';
import { evaluationService } from '../services/evaluation.service';

const EVAL_KEY = ['home', 'evaluations'];

export function useDismissEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluationService.dismiss(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVAL_KEY }),
  });
}

export function useRetrieveEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluationService.retrieve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVAL_KEY }),
  });
}

export function useCompleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluationService.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVAL_KEY });
      // Cross-module: completing evaluation updates widget bar count
      qc.invalidateQueries({ queryKey: ['home', 'widget-counts'] });
    },
  });
}

export function useEvaluationNotes(evaluationId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: EVAL_KEY });

  const add = useMutation({
    mutationFn: (content: string) => evaluationService.addNote(evaluationId, content),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (noteId: string) => evaluationService.deleteNote(evaluationId, noteId),
    onSuccess: invalidate,
  });

  return { add, remove };
}
