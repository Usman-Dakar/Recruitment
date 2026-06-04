import { useQuery } from '@tanstack/react-query';
import { templatesService } from '../services/templates.service';

export const JOB_TEMPLATES_KEY = ['settings', 'templates', 'jobs'] as const;
export const EMAIL_TEMPLATES_KEY = ['settings', 'templates', 'emails'] as const;
export const QUESTIONNAIRES_KEY = ['settings', 'templates', 'questionnaires'] as const;
export const CAREERS_PAGE_KEY = ['settings', 'templates', 'careers-page'] as const;

export const useJobTemplates = () =>
  useQuery({
    queryKey: JOB_TEMPLATES_KEY,
    queryFn: () => templatesService.getJobTemplates(),
    staleTime: 1000 * 60 * 5,
  });

export const useEmailTemplates = () =>
  useQuery({
    queryKey: EMAIL_TEMPLATES_KEY,
    queryFn: () => templatesService.getEmailTemplates(),
    staleTime: 1000 * 60 * 5,
  });

export const useQuestionnaires = () =>
  useQuery({
    queryKey: QUESTIONNAIRES_KEY,
    queryFn: () => templatesService.getQuestionnaires(),
    staleTime: 1000 * 60 * 5,
  });

export const useCareersPage = () =>
  useQuery({
    queryKey: CAREERS_PAGE_KEY,
    queryFn: () => templatesService.getCareersPage(),
    staleTime: 1000 * 60 * 5,
  });
