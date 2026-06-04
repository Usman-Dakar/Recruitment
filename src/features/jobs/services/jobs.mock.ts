import { subDays, subHours } from 'date-fns';
import type { Job, JobNote, JobActivityItem, CreateJobInput, JobFilters } from '../types/job.types';
import type { PaginatedResponse } from '@/types/api.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const now = new Date();

// TODO: replace with API — GET /jobs
let MOCK_JOBS: Job[] = [
  { id: 'j1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'full_time', status: 'listed', description: 'Build and maintain our React-based web applications. Work closely with design and product teams to ship high-quality features.', requirements: '5+ years React, TypeScript expertise, strong UI/UX sensibility, experience with TanStack Query or similar.', createdAt: new Date('2026-04-01'), publishedAt: new Date('2026-04-10'), candidateCount: 12, referralsEnabled: true },
  { id: 'j2', title: 'Product Manager', department: 'Product', location: 'New York', type: 'full_time', status: 'published', description: 'Lead product strategy, define roadmap, and work across engineering and design to deliver value to our customers.', requirements: '3+ years PM experience, SaaS background preferred, strong data literacy.', createdAt: new Date('2026-04-15'), publishedAt: new Date('2026-04-20'), candidateCount: 8, referralsEnabled: false },
  { id: 'j3', title: 'UX Designer', department: 'Design', location: 'London', type: 'full_time', status: 'draft', description: 'Design intuitive user experiences for our platform. Own the end-to-end design process from research to delivery.', requirements: 'Portfolio required, Figma proficiency, 3+ years experience, ideally in B2B SaaS.', createdAt: new Date('2026-05-01'), candidateCount: 0, referralsEnabled: false },
  { id: 'j4', title: 'Backend Engineer', department: 'Engineering', location: 'Berlin', type: 'full_time', status: 'published', description: 'Build scalable APIs and microservices. Work on data pipelines, integrations, and performance optimisation.', requirements: 'Node.js or Go, PostgreSQL, REST/GraphQL, experience with distributed systems.', createdAt: new Date('2026-03-15'), publishedAt: new Date('2026-03-20'), candidateCount: 15, referralsEnabled: true },
  { id: 'j5', title: 'Data Analyst', department: 'Analytics', location: 'Remote', type: 'contract', status: 'archived', description: 'Analyse product usage, growth metrics, and customer behaviour to guide company decisions.', requirements: 'SQL, Python, dashboarding tools (Metabase/Looker), statistics background.', createdAt: new Date('2026-02-01'), candidateCount: 3, referralsEnabled: false },
  { id: 'j6', title: 'Marketing Lead', department: 'Marketing', location: 'Paris', type: 'full_time', status: 'listed', description: 'Drive brand awareness, demand generation, and lead nurturing across all channels.', requirements: 'B2B SaaS marketing, 5+ years, proven demand-gen results, team management experience.', createdAt: new Date('2026-04-25'), publishedAt: new Date('2026-05-01'), candidateCount: 5, referralsEnabled: true },
];

// TODO: replace with API — GET /jobs/:id/notes
let MOCK_NOTES: JobNote[] = [
  { id: 'jn1', jobId: 'j1', authorId: 'u1', authorName: 'Alice Johnson', content: 'Strong pipeline. Shortlisting three candidates for final round this week.', createdAt: subDays(now, 4), isOwn: true },
  { id: 'jn2', jobId: 'j1', authorId: 'u2', authorName: 'Bob Chen', content: 'Agreed — Sarah Lee looks very promising for the offer stage.', createdAt: subDays(now, 3), isOwn: false },
  { id: 'jn3', jobId: 'j2', authorId: 'u1', authorName: 'Alice Johnson', content: 'Need to align with CTO on seniority expectations before scheduling next interview round.', createdAt: subDays(now, 2), isOwn: true },
];

// TODO: replace with API — GET /jobs/:id/activity
const MOCK_ACTIVITY: JobActivityItem[] = [
  { id: 'ja1', jobId: 'j1', type: 'status_changed', actorName: 'Alice Johnson', description: 'Changed job status to Listed', createdAt: subDays(now, 3) },
  { id: 'ja2', jobId: 'j1', type: 'candidate_added', actorName: 'Bob Chen', description: 'Added John Smith to the pipeline', createdAt: subDays(now, 5) },
  { id: 'ja3', jobId: 'j1', type: 'evaluation_scheduled', actorName: 'Alice Johnson', description: 'Scheduled evaluation for Sarah Lee', createdAt: subDays(now, 6) },
  { id: 'ja4', jobId: 'j1', type: 'offer_sent', actorName: 'Alice Johnson', description: 'Sent offer to Sarah Lee', createdAt: subHours(now, 4) },
  { id: 'ja5', jobId: 'j1', type: 'note_added', actorName: 'Bob Chen', description: 'Added a note to the job', createdAt: subDays(now, 1) },
  { id: 'ja6', jobId: 'j2', type: 'candidate_added', actorName: 'Alice Johnson', description: 'Added Mike Chen to the pipeline', createdAt: subDays(now, 7) },
  { id: 'ja7', jobId: 'j2', type: 'status_changed', actorName: 'Alice Johnson', description: 'Changed job status to Published', createdAt: subDays(now, 8) },
  { id: 'ja8', jobId: 'j4', type: 'evaluation_scheduled', actorName: 'Bob Chen', description: 'Scheduled evaluation for Tom Kowalski', createdAt: subDays(now, 2) },
];

export const mockJobsService = {
  getAll: async (filters: JobFilters): Promise<PaginatedResponse<Job>> => {
    await delay(300);
    let results = [...MOCK_JOBS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
      );
    }
    if (filters.status) results = results.filter(j => j.status === filters.status);
    const total = results.length;
    const pg = filters.page ?? 1;
    const pp = filters.perPage ?? 5;
    const lastPage = Math.max(1, Math.ceil(total / pp));
    const paged = results.slice((pg - 1) * pp, pg * pp);
    return { data: paged, meta: { total, page: pg, perPage: pp, lastPage } };
  },

  getById: async (id: string): Promise<Job> => {
    await delay(200);
    const job = MOCK_JOBS.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return { ...job };
  },

  create: async (input: CreateJobInput): Promise<Job> => {
    await delay(500);
    const job: Job = {
      id: `j${Date.now()}`,
      title: input.title,
      department: input.department,
      location: input.location,
      type: input.type,
      description: input.description ?? '',
      requirements: input.requirements ?? '',
      status: 'draft',
      createdAt: new Date(),
      candidateCount: 0,
      referralsEnabled: false,
    };
    MOCK_JOBS = [job, ...MOCK_JOBS];
    return job;
  },

  updateStatus: async (id: string, status: Job['status']): Promise<Job> => {
    await delay(300);
    MOCK_JOBS = MOCK_JOBS.map(j => {
      if (j.id !== id) return j;
      if (status === 'published' || status === 'listed') {
        return { ...j, status, publishedAt: new Date() };
      }
      return { ...j, status };
    });
    const updated = MOCK_JOBS.find(j => j.id === id);
    if (!updated) throw new Error('Job not found');
    return { ...updated };
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_JOBS = MOCK_JOBS.filter(j => j.id !== id);
  },

  getNotes: async (jobId: string): Promise<JobNote[]> => {
    await delay(200);
    return MOCK_NOTES.filter(n => n.jobId === jobId);
  },

  addNote: async (jobId: string, content: string): Promise<JobNote> => {
    await delay(300);
    const note: JobNote = { id: `jn${Date.now()}`, jobId, authorId: 'u1', authorName: 'Alice Johnson', content, createdAt: new Date(), isOwn: true };
    MOCK_NOTES = [...MOCK_NOTES, note];
    return note;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await delay(200);
    MOCK_NOTES = MOCK_NOTES.filter(n => n.id !== noteId);
  },

  getActivity: async (jobId: string): Promise<JobActivityItem[]> => {
    await delay(200);
    return MOCK_ACTIVITY.filter(a => a.jobId === jobId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
};
