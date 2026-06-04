import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { CreateTaskInput, Task } from '../types/task.types';

const TASK_KEY = ['home', 'tasks'];

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASK_KEY }),
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      taskService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASK_KEY }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASK_KEY }),
  });
}
