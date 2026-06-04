import { subDays, subHours, subMinutes } from 'date-fns';
import type { CandidateNote } from '../types/note.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const t = new Date();

// TODO: replace with API — GET /notes/recent
let STORE: CandidateNote[] = [
  {
    id: 'cn1',
    authorId: '1',
    authorName: 'Anas Khan',
    content: 'Strong React and TypeScript skills. Would be an excellent fit for the frontend team.',
    createdAt: subHours(t, 2),
    isOwn: true,
    candidateId: 'c1',
    candidateName: 'John Smith',
    replies: [
      {
        id: 'r1',
        authorId: '2',
        authorName: 'Maria G.',
        content: 'Agreed — saw the same in the technical round.',
        createdAt: subHours(t, 1),
        isOwn: false,
      },
    ],
  },
  {
    id: 'cn2',
    authorId: '2',
    authorName: 'Maria G.',
    content: 'Impressive take-home assignment. Strategic thinking is clearly above average.',
    createdAt: subHours(t, 5),
    isOwn: false,
    candidateId: 'c2',
    candidateName: 'Sarah Lee',
    replies: [],
  },
  {
    id: 'cn3',
    authorId: '1',
    authorName: 'Anas Khan',
    content: 'Good system design knowledge. Needs a second round to assess cultural fit.',
    createdAt: subDays(t, 1),
    isOwn: true,
    candidateId: 'c3',
    candidateName: 'Priya Nair',
    replies: [
      {
        id: 'r2',
        authorId: '3',
        authorName: 'Tom K.',
        content: 'I can run the second round on Thursday.',
        createdAt: subHours(t, 20),
        isOwn: false,
      },
      {
        id: 'r3',
        authorId: '1',
        authorName: 'Anas Khan',
        content: 'Perfect, I\'ll send the calendar invite.',
        createdAt: subHours(t, 18),
        isOwn: true,
      },
    ],
  },
  {
    id: 'cn4',
    authorId: '2',
    authorName: 'Maria G.',
    content: 'Extensive CI/CD experience. Salary expectations are slightly above range.',
    createdAt: subDays(t, 2),
    isOwn: false,
    candidateId: 'c4',
    candidateName: 'Mike Chen',
    replies: [],
  },
  {
    id: 'cn5',
    authorId: '1',
    authorName: 'Anas Khan',
    content: 'Follow-up email sent. Waiting on reference checks.',
    createdAt: subMinutes(t, 30),
    isOwn: true,
    candidateId: 'c1',
    candidateName: 'John Smith',
    replies: [],
  },
];

export async function mockGetRecentNotes(): Promise<CandidateNote[]> {
  await delay(350);
  return [...STORE].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// TODO: replace with API — PATCH /notes/:id
export async function mockUpdateNote(id: string, content: string): Promise<void> {
  await delay(300);
  STORE = STORE.map(n => n.id === id ? { ...n, content, updatedAt: new Date() } : n);
}

// TODO: replace with API — DELETE /notes/:id
export async function mockDeleteNote(id: string): Promise<void> {
  await delay(250);
  STORE = STORE.filter(n => n.id !== id);
}

// TODO: replace with API — POST /notes/:id/replies
export async function mockAddReply(noteId: string, content: string): Promise<void> {
  await delay(300);
  STORE = STORE.map(n =>
    n.id === noteId
      ? {
          ...n,
          replies: [
            ...n.replies,
            { id: `r${Date.now()}`, authorId: '1', authorName: 'Anas Khan', content, createdAt: new Date(), isOwn: true },
          ],
        }
      : n,
  );
}
