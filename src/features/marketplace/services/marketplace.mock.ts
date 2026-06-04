import type { Plugin, MarketplaceFilters } from '../types/marketplace.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /marketplace/plugins
let MOCK_PLUGINS: Plugin[] = [
  {
    id: 'p1',
    name: 'LinkedIn Jobs',
    description: 'Post jobs directly to LinkedIn and source candidates from LinkedIn profiles.',
    longDescription: 'Seamlessly publish open positions to LinkedIn, attract top talent through sponsored job posts, and import applicant profiles directly into your pipeline. Sync candidate data automatically and track LinkedIn as a source in your analytics.',
    category: 'job_board',
    status: 'installed',
    isEnabled: true,
    developer: 'LinkedIn',
    version: '2.4.1',
    features: ['Auto-post jobs to LinkedIn', 'Import applicant profiles', 'Source tracking in analytics', 'Sponsored job support'],
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: 'p2',
    name: 'Indeed',
    description: 'Reach millions of job seekers by posting to Indeed automatically.',
    longDescription: 'Connect your job listings to Indeed\'s massive candidate pool. Automatically push new published jobs, receive applications in your pipeline, and track Indeed as an acquisition source. Includes support for Indeed\'s sponsored listings.',
    category: 'job_board',
    status: 'available',
    isEnabled: false,
    developer: 'Indeed Inc.',
    version: '1.9.0',
    features: ['Auto-sync published jobs', 'Application import', 'Sponsored job management', 'Source analytics'],
    rating: 4.3,
    reviewCount: 189,
  },
  {
    id: 'p3',
    name: 'Codility',
    description: 'Automatically send coding assessments to candidates at any pipeline stage.',
    longDescription: 'Trigger Codility assessments automatically when a candidate reaches a specified pipeline stage. Results sync back to the candidate profile, and you can filter your pipeline by assessment score. Supports 20+ programming languages.',
    category: 'assessment',
    status: 'installed',
    isEnabled: true,
    developer: 'Codility Ltd.',
    version: '3.1.2',
    features: ['Auto-trigger on stage change', 'Score sync to profile', 'Pipeline filter by score', '20+ languages'],
    rating: 4.8,
    reviewCount: 204,
  },
  {
    id: 'p4',
    name: 'HackerRank',
    description: 'Technical screening and skill assessments for engineering candidates.',
    longDescription: 'Evaluate engineers with role-specific challenges from HackerRank\'s library of 3,000+ problems. Invite candidates directly from the pipeline, receive detailed reports, and benchmark scores against industry standards.',
    category: 'assessment',
    status: 'available',
    isEnabled: false,
    developer: 'HackerRank',
    version: '2.0.5',
    features: ['3,000+ problems library', 'Role-specific tracks', 'Plagiarism detection', 'Benchmark scoring'],
    rating: 4.5,
    reviewCount: 97,
  },
  {
    id: 'p5',
    name: 'Checkr',
    description: 'Run background checks on candidates directly from within the ATS.',
    longDescription: 'Order and manage background checks without leaving your ATS. Checkr covers criminal records, employment history, education verification, and more. Results appear directly on the candidate profile with a clear pass/consider indicator.',
    category: 'background_check',
    status: 'available',
    isEnabled: false,
    developer: 'Checkr Inc.',
    version: '1.5.0',
    features: ['Criminal record check', 'Employment verification', 'Education verification', 'Pass/consider summary'],
    rating: 4.6,
    reviewCount: 143,
  },
  {
    id: 'p6',
    name: 'Slack',
    description: 'Get real-time Slack notifications for pipeline events and team mentions.',
    longDescription: 'Receive instant Slack alerts when candidates advance stages, when evaluations are requested, or when a note mentions your name. Configure per-channel routing and customize which events trigger notifications.',
    category: 'communication',
    status: 'installed',
    isEnabled: true,
    developer: 'Slack Technologies',
    version: '4.0.0',
    features: ['Stage change alerts', 'Evaluation request notifications', '@mention routing', 'Per-channel configuration'],
    rating: 4.9,
    reviewCount: 521,
  },
  {
    id: 'p7',
    name: 'Google Calendar',
    description: 'Sync interview schedules with Google Calendar automatically.',
    longDescription: 'When you schedule an evaluation or interview in the ATS, a Google Calendar event is created for all participants. Candidate availability slots, room bookings, and video conferencing links are managed automatically.',
    category: 'calendar',
    status: 'installed',
    isEnabled: false,
    developer: 'Google LLC',
    version: '2.2.0',
    features: ['Auto-create calendar events', 'Multi-participant invites', 'Room booking integration', 'Video link generation'],
    rating: 4.6,
    reviewCount: 278,
  },
  {
    id: 'p8',
    name: 'BambooHR',
    description: 'Automatically onboard hired candidates into BambooHR.',
    longDescription: 'When a candidate status changes to Hired, their profile data is pushed to BambooHR to start the onboarding process. Reduces duplicate data entry and ensures HR has complete records from day one.',
    category: 'hr_system',
    status: 'available',
    isEnabled: false,
    developer: 'Bamboo HR LLC',
    version: '1.3.0',
    features: ['Auto-sync on hire', 'Profile data mapping', 'Onboarding task creation', 'Two-way status sync'],
    rating: 4.2,
    reviewCount: 88,
  },
  {
    id: 'p9',
    name: 'Typeform',
    description: 'Use Typeform surveys as pre-screening questionnaires for applicants.',
    longDescription: 'Embed Typeform surveys into your job application flow. Responses are stored against the candidate record and can be used to score or filter applicants before they enter your pipeline review.',
    category: 'assessment',
    status: 'available',
    isEnabled: false,
    developer: 'Typeform SL',
    version: '1.1.3',
    features: ['Embedded application forms', 'Response storage on profile', 'Auto-scoring rules', 'Conditional logic forms'],
    rating: 4.1,
    reviewCount: 62,
  },
  {
    id: 'p10',
    name: 'Zoom',
    description: 'Schedule and launch Zoom interviews from inside the pipeline.',
    longDescription: 'Create Zoom meeting links automatically when scheduling interviews. Candidates receive meeting details in their confirmation email. The host link is available directly on the candidate card at interview time.',
    category: 'communication',
    status: 'available',
    isEnabled: false,
    developer: 'Zoom Video Communications',
    version: '2.1.0',
    features: ['Auto-generate meeting links', 'Candidate email integration', 'Host link on candidate card', 'Recording storage'],
    rating: 4.7,
    reviewCount: 334,
  },
  {
    id: 'p11',
    name: 'Workday Recruiting',
    description: 'Bi-directional sync between Dakar and Workday for enterprise HR teams.',
    longDescription: 'Planned integration with Workday\'s Recruiting module. Will support full bi-directional candidate and requisition sync, allowing enterprise teams to use both platforms without duplicate data entry.',
    category: 'hr_system',
    status: 'coming_soon',
    isEnabled: false,
    developer: 'Workday Inc.',
    version: '—',
    features: ['Bi-directional candidate sync', 'Requisition management', 'Offer letter routing', 'HRIS field mapping'],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'p12',
    name: 'Microsoft Teams',
    description: 'Receive pipeline notifications and schedule interviews via Teams.',
    longDescription: 'Planned integration with Microsoft Teams. Will deliver real-time pipeline notifications to Teams channels and support scheduling interviews with auto-generated Teams meeting links.',
    category: 'communication',
    status: 'coming_soon',
    isEnabled: false,
    developer: 'Microsoft',
    version: '—',
    features: ['Teams channel notifications', 'Interview scheduling', 'Meeting link generation', 'Adaptive card alerts'],
    rating: 0,
    reviewCount: 0,
  },
];

export const mockMarketplaceService = {
  getPlugins: async (filters?: MarketplaceFilters): Promise<Plugin[]> => {
    await delay(350);
    let result = [...MOCK_PLUGINS];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    if (filters?.category) {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters?.installed) {
      result = result.filter(p => p.status === 'installed');
    }
    return result;
  },

  // TODO: replace with API — POST /marketplace/plugins/:id/install
  install: async (pluginId: string): Promise<void> => {
    await delay(500);
    MOCK_PLUGINS = MOCK_PLUGINS.map(p =>
      p.id === pluginId ? { ...p, status: 'installed' as const, isEnabled: true } : p,
    );
  },

  // TODO: replace with API — DELETE /marketplace/plugins/:id/install
  uninstall: async (pluginId: string): Promise<void> => {
    await delay(400);
    MOCK_PLUGINS = MOCK_PLUGINS.map(p =>
      p.id === pluginId ? { ...p, status: 'available' as const, isEnabled: false } : p,
    );
  },

  // TODO: replace with API — PATCH /marketplace/plugins/:id/toggle
  toggleEnabled: async (pluginId: string, isEnabled: boolean): Promise<void> => {
    await delay(200);
    MOCK_PLUGINS = MOCK_PLUGINS.map(p =>
      p.id === pluginId ? { ...p, isEnabled } : p,
    );
  },
};
