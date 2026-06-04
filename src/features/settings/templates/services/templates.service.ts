import { mockTemplatesService } from './templates.mock';
import type { JobTemplate, EmailTemplate, Questionnaire, CareersPage } from '../types/templates.types';

// TODO: replace with API — GET /settings/templates/jobs
const getJobTemplates = (): Promise<JobTemplate[]> =>
  mockTemplatesService.getJobTemplates();

// TODO: replace with API — DELETE /settings/templates/jobs/:id
const deleteJobTemplate = (id: string): Promise<void> =>
  mockTemplatesService.deleteJobTemplate(id);

// TODO: replace with API — GET /settings/templates/emails
const getEmailTemplates = (): Promise<EmailTemplate[]> =>
  mockTemplatesService.getEmailTemplates();

// TODO: replace with API — DELETE /settings/templates/emails/:id
const deleteEmailTemplate = (id: string): Promise<void> =>
  mockTemplatesService.deleteEmailTemplate(id);

// TODO: replace with API — GET /settings/templates/questionnaires
const getQuestionnaires = (): Promise<Questionnaire[]> =>
  mockTemplatesService.getQuestionnaires();

// TODO: replace with API — DELETE /settings/templates/questionnaires/:id
const deleteQuestionnaire = (id: string): Promise<void> =>
  mockTemplatesService.deleteQuestionnaire(id);

// TODO: replace with API — GET /settings/templates/careers-page
const getCareersPage = (): Promise<CareersPage> =>
  mockTemplatesService.getCareersPage();

// TODO: replace with API — PATCH /settings/templates/careers-page
const updateCareersPage = (page: CareersPage): Promise<void> =>
  mockTemplatesService.updateCareersPage(page);

export const templatesService = {
  getJobTemplates,
  deleteJobTemplate,
  getEmailTemplates,
  deleteEmailTemplate,
  getQuestionnaires,
  deleteQuestionnaire,
  getCareersPage,
  updateCareersPage,
};
