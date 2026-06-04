import { addDays, subDays } from 'date-fns';
import type { CreateTaskInput, Task } from '../types/task.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const t = new Date();

// TODO: replace with API — GET /tasks
let STORE: Task[] = [
  {
    id: 't1',
    title: 'Review portfolio links',
    status: 'todo',
    priority: 'high',
    dueDate: addDays(t, 1),
    candidateId: 'c1',
    candidateName: 'John Smith',
    evaluationId: 'e1',
    createdAt: subDays(t, 1),
    createdBy: 'Anas Khan',
  },
  {
    id: 't2',
    title: 'Send technical assessment',
    status: 'todo',
    priority: 'medium',
    dueDate: addDays(t, 3),
    candidateId: 'c2',
    candidateName: 'Sarah Lee',
    evaluationId: 'e2',
    createdAt: subDays(t, 2),
    createdBy: 'Anas Khan',
  },
  {
    id: 't3',
    title: 'Schedule final interview round',
    status: 'in_progress',
    priority: 'high',
    dueDate: t,
    candidateId: 'c3',
    candidateName: 'Priya Nair',
    evaluationId: 'e3',
    createdAt: subDays(t, 3),
    createdBy: 'Maria G.',
  },
  {
    id: 't4',
    title: 'Verify references',
    status: 'done',
    priority: 'low',
    candidateId: 'c1',
    candidateName: 'John Smith',
    createdAt: subDays(t, 5),
    createdBy: 'Anas Khan',
  },
  {
    id: 't5',
    title: 'Update offer letter template',
    status: 'todo',
    priority: 'low',
    dueDate: addDays(t, 7),
    createdAt: subDays(t, 1),
    createdBy: 'Anas Khan',
  },
];

export async function mockGetTasks(): Promise<Task[]> {
  await delay(350);
  return STORE;
}

// TODO: replace with API — POST /tasks
export async function mockCreateTask(input: CreateTaskInput): Promise<Task> {
  await delay(400);
  const task: Task = {
    id: `t${Date.now()}`,
    title: input.title,
    status: input.status,
    priority: input.priority,
    createdAt: new Date(),
    createdBy: 'Anas Khan',
    ...(input.dueDate ? { dueDate: new Date(input.dueDate) } : {}),
    ...(input.candidateId ? { candidateId: input.candidateId } : {}),
    ...(input.candidateName ? { candidateName: input.candidateName } : {}),
    ...(input.evaluationId ? { evaluationId: input.evaluationId } : {}),
  };
  STORE = [...STORE, task];
  return task;
}

// TODO: replace with API — PATCH /tasks/:id/status
export async function mockUpdateTaskStatus(id: string, status: Task['status']): Promise<void> {
  await delay(200);
  STORE = STORE.map(t => t.id === id ? { ...t, status } : t);
}

// TODO: replace with API — DELETE /tasks/:id
export async function mockDeleteTask(id: string): Promise<void> {
  await delay(200);
  STORE = STORE.filter(t => t.id !== id);
}
