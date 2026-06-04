import type { CreateTaskInput, Task } from '../types/task.types';
import { mockGetTasks, mockCreateTask, mockUpdateTaskStatus, mockDeleteTask } from './task.mock';

export const taskService = {
  getAll: (): Promise<Task[]> => mockGetTasks(),
  create: (input: CreateTaskInput): Promise<Task> => mockCreateTask(input),
  updateStatus: (id: string, status: Task['status']): Promise<void> => mockUpdateTaskStatus(id, status),
  delete: (id: string): Promise<void> => mockDeleteTask(id),
};
