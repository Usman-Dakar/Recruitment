export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  candidateId?: string;
  candidateName?: string;
  evaluationId?: string;
  createdAt: Date;
  createdBy: string;
}

export interface CreateTaskInput {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  candidateId?: string;
  candidateName?: string;
  evaluationId?: string;
}
