import { useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '../services/templates.service';
import type { CareersPage } from '../types/templates.types';
import {
  JOB_TEMPLATES_KEY,
  EMAIL_TEMPLATES_KEY,
  QUESTIONNAIRES_KEY,
  CAREERS_PAGE_KEY,
} from './useTemplates';

export const useDeleteJobTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templatesService.deleteJobTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: JOB_TEMPLATES_KEY }),
  });
};

export const useDeleteEmailTemplate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templatesService.deleteEmailTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY }),
  });
};

export const useDeleteQuestionnaire = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => templatesService.deleteQuestionnaire(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUESTIONNAIRES_KEY }),
  });
};

export const useUpdateCareersPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (page: CareersPage) => templatesService.updateCareersPage(page),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAREERS_PAGE_KEY }),
  });
};
