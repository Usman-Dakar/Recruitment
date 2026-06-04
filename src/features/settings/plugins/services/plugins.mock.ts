import type { InstalledPlugin, UpdatePluginConfigInput } from '../types/plugins.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /settings/plugins
let MOCK_INSTALLED_PLUGINS: InstalledPlugin[] = [
  {
    id: 'p1',
    name: 'LinkedIn',
    description: 'Post jobs directly to LinkedIn and import applicants automatically.',
    category: 'job_board',
    isEnabled: true,
    version: '3.2.1',
    lastSyncedAt: new Date('2026-05-19T09:00:00'),
    configFields: [
      { key: 'api_key', label: 'API Key', type: 'password', value: 'lnkd_sk_••••••••••', placeholder: 'lnkd_sk_...', description: 'Found in your LinkedIn Developer app settings.' },
      { key: 'company_id', label: 'Company ID', type: 'text', value: '90210', placeholder: 'e.g. 90210' },
      { key: 'auto_import', label: 'Auto-import applicants', type: 'toggle', value: true, description: 'Automatically create candidate records for new LinkedIn applicants.' },
      { key: 'sync_interval', label: 'Sync interval', type: 'select', value: '15', options: [
        { value: '5', label: 'Every 5 minutes' },
        { value: '15', label: 'Every 15 minutes' },
        { value: '60', label: 'Every hour' },
        { value: '360', label: 'Every 6 hours' },
      ]},
    ],
  },
  {
    id: 'p2',
    name: 'Slack',
    description: 'Get real-time hiring notifications and alerts in your Slack workspace.',
    category: 'communication',
    isEnabled: true,
    version: '2.0.4',
    lastSyncedAt: new Date('2026-05-18T14:30:00'),
    configFields: [
      { key: 'webhook_url', label: 'Incoming webhook URL', type: 'password', value: 'https://hooks.slack.com/services/••••', placeholder: 'https://hooks.slack.com/services/...', description: 'Create an incoming webhook in your Slack app settings.' },
      { key: 'channel', label: 'Default channel', type: 'text', value: '#recruiting', placeholder: '#channel-name' },
      { key: 'notify_new_application', label: 'Notify on new application', type: 'toggle', value: true },
      { key: 'notify_stage_change', label: 'Notify on stage change', type: 'toggle', value: false },
      { key: 'notify_offer_accepted', label: 'Notify on offer accepted', type: 'toggle', value: true },
    ],
  },
  {
    id: 'p3',
    name: 'Google Calendar',
    description: 'Sync interviews and events with Google Calendar for the whole team.',
    category: 'calendar',
    isEnabled: true,
    version: '1.5.0',
    lastSyncedAt: new Date('2026-05-20T08:00:00'),
    configFields: [
      { key: 'calendar_id', label: 'Calendar ID', type: 'text', value: 'recruiting@company.com', placeholder: 'calendar@group.calendar.google.com' },
      { key: 'event_visibility', label: 'Event visibility', type: 'select', value: 'private', options: [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' },
      ]},
      { key: 'send_invites', label: 'Send calendar invites to candidates', type: 'toggle', value: true },
      { key: 'include_video_link', label: 'Include Google Meet link', type: 'toggle', value: true, description: 'Auto-attach a Meet link to every scheduled interview.' },
    ],
  },
  {
    id: 'p4',
    name: 'Codility',
    description: 'Send coding assessments to candidates and view results inside Dakar.',
    category: 'assessment',
    isEnabled: false,
    version: '1.1.2',
    configFields: [
      { key: 'api_key', label: 'API Key', type: 'password', value: '', placeholder: 'cod_api_...', description: 'Found in your Codility account settings under API access.' },
      { key: 'default_test', label: 'Default test ID', type: 'text', value: '', placeholder: 'e.g. frontend-screening-2026' },
      { key: 'auto_send', label: 'Auto-send assessment on stage entry', type: 'toggle', value: false, description: 'Automatically dispatch the assessment when a candidate enters the Assessment stage.' },
    ],
  },
];

export const mockPluginsSettingsService = {
  getInstalledPlugins: async (): Promise<InstalledPlugin[]> => {
    await delay(250);
    return MOCK_INSTALLED_PLUGINS.map(p => ({
      ...p,
      configFields: p.configFields.map(f => ({ ...f })),
    }));
  },

  // TODO: replace with API — PATCH /settings/plugins/:id/toggle
  togglePlugin: async (id: string): Promise<void> => {
    await delay(200);
    MOCK_INSTALLED_PLUGINS = MOCK_INSTALLED_PLUGINS.map(p =>
      p.id === id ? { ...p, isEnabled: !p.isEnabled } : p,
    );
  },

  // TODO: replace with API — PATCH /settings/plugins/:id/config
  updatePluginConfig: async ({ id, configFields }: UpdatePluginConfigInput): Promise<void> => {
    await delay(350);
    MOCK_INSTALLED_PLUGINS = MOCK_INSTALLED_PLUGINS.map(p =>
      p.id === id ? { ...p, configFields, lastSyncedAt: new Date() } : p,
    );
  },

  // TODO: replace with API — POST /settings/plugins/:id/sync
  syncPlugin: async (id: string): Promise<void> => {
    await delay(800);
    MOCK_INSTALLED_PLUGINS = MOCK_INSTALLED_PLUGINS.map(p =>
      p.id === id ? { ...p, lastSyncedAt: new Date() } : p,
    );
  },
};
