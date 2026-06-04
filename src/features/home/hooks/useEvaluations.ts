import { useQuery } from '@tanstack/react-query';
import { evaluationService } from '../services/evaluation.service';

export function useEvaluations() {
  return useQuery({
    queryKey: ['home', 'evaluations'],
    queryFn: () => evaluationService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
