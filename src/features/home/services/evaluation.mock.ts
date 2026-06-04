import { subDays } from 'date-fns';
import type { Evaluation } from '../types/evaluation.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const t = new Date();

// TODO: replace with API — GET /evaluations
let STORE: Evaluation[] = [
  {
    id: 'e1',
    candidate: { id: 'c1', name: 'John Smith', position: 'Senior Frontend Engineer' },
    jobTitle: 'Frontend Engineer',
    status: 'requested',
    requestedAt: subDays(t, 1),
    requestedBy: 'Anas Khan',
    template: 'Frontend Developer',
    questions: [
      { id: 'q1', question: 'Describe your React and TypeScript experience.', answer: '' },
      { id: 'q2', question: 'How do you handle state management in large apps?', answer: '' },
      { id: 'q3', question: 'Walk us through a challenging technical problem you solved.', answer: '' },
    ],
    notes: [
      { id: 'n1', authorId: '1', authorName: 'Anas Khan', content: 'Strong portfolio, good communication.', createdAt: subDays(t, 1), isOwn: true },
    ],
  },
  {
    id: 'e2',
    candidate: { id: 'c2', name: 'Sarah Lee', position: 'Product Manager' },
    jobTitle: 'Product Manager',
    status: 'requested',
    requestedAt: subDays(t, 2),
    requestedBy: 'Anas Khan',
    template: 'Product Manager',
    questions: [
      { id: 'q4', question: 'How do you prioritize features on a roadmap?', answer: '' },
      { id: 'q5', question: 'Describe a product you launched from 0 to 1.', answer: '' },
    ],
    notes: [
      { id: 'n2', authorId: '2', authorName: 'Maria G.', content: 'Great strategic thinking shown in take-home.', createdAt: subDays(t, 2), isOwn: false },
    ],
  },
  {
    id: 'e3',
    candidate: { id: 'c3', name: 'Priya Nair', position: 'Backend Engineer' },
    jobTitle: 'Backend Engineer',
    status: 'requested',
    requestedAt: subDays(t, 3),
    requestedBy: 'Maria G.',
    template: 'Backend Developer',
    questions: [
      { id: 'q6', question: 'Explain your approach to API design.', answer: '' },
      { id: 'q7', question: 'How do you handle database migrations at scale?', answer: '' },
    ],
    notes: [],
  },
  {
    id: 'e4',
    candidate: { id: 'c4', name: 'Mike Chen', position: 'DevOps Engineer' },
    jobTitle: 'DevOps Engineer',
    status: 'dismissed',
    requestedAt: subDays(t, 5),
    requestedBy: 'Anas Khan',
    template: 'DevOps',
    questions: [
      { id: 'q8', question: 'Describe your CI/CD pipeline experience.', answer: '' },
    ],
    notes: [],
  },
];

export async function mockGetEvaluations(): Promise<Evaluation[]> {
  await delay(400);
  return STORE;
}

// TODO: replace with API — PATCH /evaluations/:id/dismiss
export async function mockDismissEvaluation(id: string): Promise<void> {
  await delay(300);
  STORE = STORE.map(e => e.id === id ? { ...e, status: 'dismissed' } : e);
}

// TODO: replace with API — PATCH /evaluations/:id/retrieve
export async function mockRetrieveEvaluation(id: string): Promise<void> {
  await delay(300);
  STORE = STORE.map(e => e.id === id ? { ...e, status: 'requested' } : e);
}

// TODO: replace with API — PATCH /evaluations/:id/complete
export async function mockCompleteEvaluation(id: string): Promise<void> {
  await delay(400);
  STORE = STORE.map(e => e.id === id ? { ...e, status: 'completed' } : e);
}

// TODO: replace with API — POST /evaluations/:id/notes
export async function mockAddNote(evaluationId: string, content: string): Promise<void> {
  await delay(200);
  STORE = STORE.map(e =>
    e.id === evaluationId
      ? {
          ...e,
          notes: [
            ...e.notes,
            { id: String(Date.now()), authorId: '1', authorName: 'Anas Khan', content, createdAt: new Date(), isOwn: true },
          ],
        }
      : e,
  );
}

// TODO: replace with API — DELETE /evaluations/:id/notes/:noteId
export async function mockDeleteNote(evaluationId: string, noteId: string): Promise<void> {
  await delay(200);
  STORE = STORE.map(e =>
    e.id === evaluationId ? { ...e, notes: e.notes.filter(n => n.id !== noteId) } : e,
  );
}
