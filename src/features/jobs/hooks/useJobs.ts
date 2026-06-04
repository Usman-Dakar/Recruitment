import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobs.service';
import type { JobFilters } from '../types/job.types';

const PER_PAGE = 4;

export const useJobs = (filters: JobFilters, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsService.getAll(filters),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  });

export const useJobsInfinite = (filters: Omit<JobFilters, 'page' | 'perPage'>) =>
  useInfiniteQuery({
    queryKey: ['jobs', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      jobsService.getAll({ ...filters, page: pageParam, perPage: PER_PAGE }),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.meta.page < last.meta.lastPage ? last.meta.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

export const useJobById = (id: string) =>
  useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useJobNotes = (jobId: string) =>
  useQuery({
    queryKey: ['jobs', jobId, 'notes'],
    queryFn: () => jobsService.getNotes(jobId),
    staleTime: 1000 * 60 * 5,
  });

export const useJobActivity = (jobId: string) =>
  useQuery({
    queryKey: ['jobs', jobId, 'activity'],
    queryFn: () => jobsService.getActivity(jobId),
    staleTime: 1000 * 60 * 5,
  });
