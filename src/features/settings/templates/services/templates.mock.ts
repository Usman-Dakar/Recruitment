import type {
  JobTemplate,
  EmailTemplate,
  Questionnaire,
  CareersPage,
} from '../types/templates.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /settings/templates/jobs
let MOCK_JOB_TEMPLATES: JobTemplate[] = [
  { id: 'jt1', name: 'Senior Engineer', title: 'Senior Software Engineer', department: 'Engineering', type: 'full_time', description: 'Build and scale our core product. Work across the stack with a high-calibre team.', requirements: '5+ years experience, TypeScript or Go, microservices architecture, strong communication skills.', createdAt: new Date('2026-03-01') },
  { id: 'jt2', name: 'Product Manager', title: 'Product Manager', department: 'Product', type: 'full_time', description: 'Own the roadmap and drive cross-functional delivery of features customers love.', requirements: '3+ years PM experience, SaaS background, data-driven mindset, proven delivery track record.', createdAt: new Date('2026-03-10') },
  { id: 'jt3', name: 'UX Designer', title: 'UX Designer', department: 'Design', type: 'full_time', description: 'Lead design from research to pixel-perfect delivery. Own the end-to-end design process.', requirements: 'Portfolio required, Figma mastery, 3+ years in product design, ideally B2B SaaS.', createdAt: new Date('2026-04-05') },
];

// TODO: replace with API — GET /settings/templates/emails
let MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'et1', name: 'Application received', subject: 'We received your application — {{job_title}}', body: 'Hi {{candidate_name}},\n\nThank you for applying for the {{job_title}} role at {{company_name}}. We\'ll be in touch within 5 business days.\n\nBest,\nThe {{company_name}} team', visibility: 'public', variables: ['{{candidate_name}}', '{{job_title}}', '{{company_name}}'], createdAt: new Date('2026-03-01') },
  { id: 'et2', name: 'Interview invite', subject: 'Interview invitation — {{job_title}}', body: 'Hi {{candidate_name}},\n\nWe\'d love to invite you to interview for {{job_title}}. Please use the link below to book a time that works for you.\n\n{{booking_link}}\n\nLooking forward to meeting you,\n{{recruiter_name}}', visibility: 'team', variables: ['{{candidate_name}}', '{{job_title}}', '{{booking_link}}', '{{recruiter_name}}'], createdAt: new Date('2026-03-05') },
  { id: 'et3', name: 'Offer letter', subject: 'Your offer — {{job_title}} at {{company_name}}', body: 'Dear {{candidate_name}},\n\nWe are delighted to offer you the position of {{job_title}} at {{company_name}}.\n\nStart date: {{start_date}}\nSalary: {{salary}}\n\nPlease sign and return by {{deadline}}.\n\n{{recruiter_name}}', visibility: 'private', variables: ['{{candidate_name}}', '{{job_title}}', '{{company_name}}', '{{start_date}}', '{{salary}}', '{{deadline}}', '{{recruiter_name}}'], createdAt: new Date('2026-04-01') },
  { id: 'et4', name: 'Rejection', subject: 'Your application — {{job_title}}', body: 'Hi {{candidate_name}},\n\nThank you for your interest in the {{job_title}} role. After careful consideration, we will not be moving forward with your application at this time.\n\nWe wish you all the best in your search.\n\nThe {{company_name}} team', visibility: 'public', variables: ['{{candidate_name}}', '{{job_title}}', '{{company_name}}'], createdAt: new Date('2026-04-10') },
];

// TODO: replace with API — GET /settings/templates/questionnaires
let MOCK_QUESTIONNAIRES: Questionnaire[] = [
  { id: 'q1', name: 'Engineering screening', description: 'Standard technical screening for engineering roles', visibility: 'team', createdAt: new Date('2026-03-01'), questions: [
    { id: 'qq1', text: 'Describe a technically challenging project you led.', type: 'text' },
    { id: 'qq2', text: 'Rate your proficiency in TypeScript (1–5).', type: 'rating' },
    { id: 'qq3', text: 'Do you have experience with distributed systems?', type: 'yes_no' },
    { id: 'qq4', text: 'What is your preferred working style?', type: 'text' },
  ]},
  { id: 'q2', name: 'Culture fit', description: 'Values and team fit questions used across all roles', visibility: 'public', createdAt: new Date('2026-03-15'), questions: [
    { id: 'qq5', text: 'What motivates you to do your best work?', type: 'text' },
    { id: 'qq6', text: 'Describe a time you disagreed with a decision. What did you do?', type: 'text' },
    { id: 'qq7', text: 'Are you comfortable working in a fast-paced, ambiguous environment?', type: 'yes_no' },
  ]},
  { id: 'q3', name: 'Product role assessment', description: 'PM-specific questions for product management roles', visibility: 'private', createdAt: new Date('2026-04-01'), questions: [
    { id: 'qq8', text: 'How do you prioritise features when resources are limited?', type: 'text' },
    { id: 'qq9', text: 'Rate your experience with data analytics (1–5).', type: 'rating' },
    { id: 'qq10', text: 'Walk us through how you define success for a product.', type: 'text' },
  ]},
];

// TODO: replace with API — GET /settings/templates/careers-page
let MOCK_CAREERS_PAGE: CareersPage = {
  primaryColor: '#6366f1',
  published: true,
  sections: [
    { id: 'cs1', type: 'hero', enabled: true, headline: 'Join our team', body: 'We\'re building the future of hiring. Come help us do it.' },
    { id: 'cs2', type: 'about', enabled: true, headline: 'About us', body: 'Dakar is a fast-growing SaaS company helping talent teams hire smarter.' },
    { id: 'cs3', type: 'perks', enabled: true, headline: 'Why work here', items: ['Flexible remote-first work', 'Competitive salary + equity', '25 days holiday', 'Learning & development budget', 'Health insurance'] },
    { id: 'cs4', type: 'jobs', enabled: true, headline: 'Open positions' },
  ],
};

export const mockTemplatesService = {
  getJobTemplates: async (): Promise<JobTemplate[]> => { await delay(250); return [...MOCK_JOB_TEMPLATES]; },
  deleteJobTemplate: async (id: string): Promise<void> => { await delay(200); MOCK_JOB_TEMPLATES = MOCK_JOB_TEMPLATES.filter(t => t.id !== id); },

  getEmailTemplates: async (): Promise<EmailTemplate[]> => { await delay(250); return [...MOCK_EMAIL_TEMPLATES]; },
  deleteEmailTemplate: async (id: string): Promise<void> => { await delay(200); MOCK_EMAIL_TEMPLATES = MOCK_EMAIL_TEMPLATES.filter(t => t.id !== id); },

  getQuestionnaires: async (): Promise<Questionnaire[]> => { await delay(250); return [...MOCK_QUESTIONNAIRES]; },
  deleteQuestionnaire: async (id: string): Promise<void> => { await delay(200); MOCK_QUESTIONNAIRES = MOCK_QUESTIONNAIRES.filter(q => q.id !== id); },

  getCareersPage: async (): Promise<CareersPage> => { await delay(200); return { ...MOCK_CAREERS_PAGE, sections: MOCK_CAREERS_PAGE.sections.map(s => ({ ...s })) }; },
  // TODO: replace with API — PATCH /settings/templates/careers-page
  updateCareersPage: async (page: CareersPage): Promise<void> => { await delay(350); MOCK_CAREERS_PAGE = { ...page }; },
};
