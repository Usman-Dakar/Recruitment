export type TemplateVisibility = 'public' | 'private' | 'team';
export type QuestionType = 'text' | 'rating' | 'yes_no';
export type TemplateTab = 'job' | 'email' | 'questionnaire' | 'careers';

export interface JobTemplate {
  id: string;
  name: string;
  title: string;
  department: string;
  type: string;
  description: string;
  requirements: string;
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  visibility: TemplateVisibility;
  variables: string[];
  createdAt: Date;
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  type: QuestionType;
}

export interface Questionnaire {
  id: string;
  name: string;
  description: string;
  questions: QuestionnaireQuestion[];
  visibility: TemplateVisibility;
  createdAt: Date;
}

export interface CareersPageSection {
  id: string;
  type: 'hero' | 'about' | 'perks' | 'jobs';
  enabled: boolean;
  headline?: string;
  body?: string;
  items?: string[];
}

export interface CareersPage {
  sections: CareersPageSection[];
  primaryColor: string;
  published: boolean;
}
