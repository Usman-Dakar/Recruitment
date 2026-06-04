import { subDays } from 'date-fns';
import type { Candidate, CandidateFilters, CreateCandidateInput } from '../types/candidate.types';
import type { PaginatedResponse } from '@/types/api.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const t = new Date();

// TODO: replace with API — GET /candidates
let STORE: Candidate[] = [
  { id: 'c1', name: 'John Smith', email: 'john.smith@email.com', phone: '+1 (555) 010-1234', position: 'Senior Frontend Engineer', status: 'interview', origin: 'linkedin', roles: ['Frontend Engineer'], tags: ['React', 'TypeScript', 'Senior'], appliedAt: subDays(t, 15), location: 'New York, NY', stageId: 'st3', profileNotes: [{ id: 'pn1', authorId: '1', authorName: 'Anas Khan', content: 'Strong React skills. Excellent fit for the team.', createdAt: subDays(t, 10), isOwn: true }, { id: 'pn2', authorId: '2', authorName: 'Maria G.', content: 'Impressive portfolio. Recommend moving to offer stage.', createdAt: subDays(t, 5), isOwn: false }] },
  { id: 'c2', name: 'Sarah Lee', email: 'sarah.lee@email.com', phone: '+1 (555) 020-5678', position: 'Product Manager', status: 'offer', origin: 'direct', roles: ['Product Manager'], tags: ['B2B', 'SaaS', 'Agile'], appliedAt: subDays(t, 22), location: 'San Francisco, CA', stageId: 'st5', profileNotes: [{ id: 'pn3', authorId: '2', authorName: 'Maria G.', content: 'Strategic thinking is above average. Strong take-home.', createdAt: subDays(t, 8), isOwn: false }] },
  { id: 'c3', name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+44 7700 900123', position: 'Backend Engineer', status: 'in_review', origin: 'referral', referredBy: 'Maria G.', roles: ['Backend Engineer', 'DevOps'], tags: ['Go', 'Kubernetes', 'PostgreSQL'], appliedAt: subDays(t, 30), location: 'London, UK', stageId: 'st2', profileNotes: [] },
  { id: 'c4', name: 'Mike Chen', email: 'mike.chen@email.com', position: 'DevOps Engineer', status: 'rejected', origin: 'job_board', roles: ['DevOps Engineer'], tags: ['AWS', 'Terraform', 'CI/CD'], appliedAt: subDays(t, 45), location: 'Seattle, WA', stageId: 'st1', profileNotes: [] },
  { id: 'c5', name: 'Alex Rivera', email: 'alex.rivera@email.com', position: 'Full Stack Developer', status: 'new', origin: 'linkedin', roles: ['Full Stack Developer'], tags: ['React', 'Node.js', 'TypeScript'], appliedAt: subDays(t, 2), location: 'Austin, TX', stageId: 'st1', profileNotes: [] },
  { id: 'c6', name: 'Zara Ahmed', email: 'zara.ahmed@email.com', phone: '+1 (555) 060-9876', position: 'UX Designer', status: 'interview', origin: 'referral', referredBy: 'Anas Khan', roles: ['Designer', 'UX Researcher'], tags: ['Figma', 'Design Systems', 'User Research'], appliedAt: subDays(t, 10), location: 'Chicago, IL', stageId: 'st3', profileNotes: [] },
  { id: 'c7', name: 'Tom Kowalski', email: 'tom.kowalski@email.com', position: 'Data Engineer', status: 'in_review', origin: 'agency', roles: ['Data Engineer'], tags: ['Python', 'Spark', 'dbt'], appliedAt: subDays(t, 8), location: 'Boston, MA', stageId: 'st2', profileNotes: [] },
  { id: 'c8', name: 'Lena Fischer', email: 'lena.fischer@email.com', position: 'Engineering Manager', status: 'hired', origin: 'linkedin', roles: ['Engineering Manager'], tags: ['Leadership', 'Agile', 'Technical'], appliedAt: subDays(t, 60), location: 'Remote', stageId: 'st6', profileNotes: [] },
];

const JOB_CANDIDATE_MAP: Record<string, string[]> = {
  j1: ['c1', 'c2', 'c3', 'c8'],
  j2: ['c4', 'c5'],
  j3: ['c6'],
  j4: ['c1', 'c7'],
  j5: [],
  j6: [],
};

export async function mockGetCandidates(filters: CandidateFilters): Promise<PaginatedResponse<Candidate>> {
  await delay(400);
  let result = [...STORE];
  if (filters.jobId) {
    const ids = JOB_CANDIDATE_MAP[filters.jobId] ?? [];
    result = result.filter(c => ids.includes(c.id));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.position.toLowerCase().includes(q));
  }
  if (filters.status) result = result.filter(c => c.status === filters.status);
  if (filters.origin) result = result.filter(c => c.origin === filters.origin);
  const total = result.length;
  const pg = filters.page ?? 1;
  const pp = filters.perPage ?? 5;
  const lastPage = Math.max(1, Math.ceil(total / pp));
  const paged = result.slice((pg - 1) * pp, pg * pp);
  return { data: paged, meta: { total, page: pg, perPage: pp, lastPage } };
}

export async function mockGetCandidateById(id: string): Promise<Candidate | null> {
  await delay(300);
  return STORE.find(c => c.id === id) ?? null;
}

// TODO: replace with API — POST /candidates
export async function mockCreateCandidate(input: CreateCandidateInput): Promise<Candidate> {
  await delay(600);
  const candidate: Candidate = {
    id: `c${Date.now()}`,
    name: input.name,
    email: input.email,
    position: input.position,
    status: 'new',
    origin: input.origin,
    roles: [input.position],
    tags: [],
    appliedAt: new Date(),
    profileNotes: [],
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.referredBy ? { referredBy: input.referredBy } : {}),
  };
  STORE = [...STORE, candidate];
  return candidate;
}

// TODO: replace with API — PATCH /candidates/:id/stage
export async function mockMoveToStage(candidateId: string, stageId: string): Promise<void> {
  await delay(200);
  STORE = STORE.map(c => c.id === candidateId ? { ...c, stageId } : c);
}

// TODO: replace with API — POST /candidates/:id/notes
export async function mockAddProfileNote(candidateId: string, content: string): Promise<void> {
  await delay(250);
  STORE = STORE.map(c =>
    c.id === candidateId
      ? { ...c, profileNotes: [...c.profileNotes, { id: `pn${Date.now()}`, authorId: '1', authorName: 'Anas Khan', content, createdAt: new Date(), isOwn: true }] }
      : c,
  );
}
