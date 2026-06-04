import type { Job, JobNote, JobActivityItem, CreateJobInput, JobFilters } from '../types/job.types';
import type { PaginatedResponse } from '@/types/api.types';
import { mockJobsService } from './jobs.mock';

export const jobsService = {
  getAll: (filters: JobFilters): Promise<PaginatedResponse<Job>> =>
    mockJobsService.getAll(filters), // TODO: replace with API — GET /jobs
  getById: (id: string): Promise<Job> =>
    mockJobsService.getById(id), // TODO: replace with API — GET /jobs/:id
  create: (input: CreateJobInput): Promise<Job> =>
    mockJobsService.create(input), // TODO: replace with API — POST /jobs
  updateStatus: (id: string, status: Job['status']): Promise<Job> =>
    mockJobsService.updateStatus(id, status), // TODO: replace with API — PATCH /jobs/:id/status
  delete: (id: string): Promise<void> =>
    mockJobsService.delete(id), // TODO: replace with API — DELETE /jobs/:id
  getNotes: (jobId: string): Promise<JobNote[]> =>
    mockJobsService.getNotes(jobId), // TODO: replace with API — GET /jobs/:id/notes
  addNote: (jobId: string, content: string): Promise<JobNote> =>
    mockJobsService.addNote(jobId, content), // TODO: replace with API — POST /jobs/:id/notes
  deleteNote: (noteId: string): Promise<void> =>
    mockJobsService.deleteNote(noteId), // TODO: replace with API — DELETE /jobs/notes/:id
  getActivity: (jobId: string): Promise<JobActivityItem[]> =>
    mockJobsService.getActivity(jobId), // TODO: replace with API — GET /jobs/:id/activity
};
