import { useQuery } from '@tanstack/react-query';
import { taskService } from '../services/task.service';

export function useTasks() {
  return useQuery({
    queryKey: ['home', 'tasks'],
    queryFn: () => taskService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}
