import type {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
  AccountNotificationPref,
} from '../types/my-account.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// TODO: replace with API — GET /settings/my-account/profile
let MOCK_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Anas Khan',
  email: 'anas.khan@dakar.io',
  phone: '+44 7700 900000',
  jobTitle: 'Head of Talent',
  department: 'People & Talent',
  avatarInitials: 'AK',
  language: 'en',
  timezone: 'Europe/London',
};

// TODO: replace with API — GET /settings/my-account/notifications
let MOCK_NOTIF_PREFS: AccountNotificationPref[] = [
  { id: 'np1', label: 'New application', description: 'When a candidate applies to one of your jobs', email: true, inApp: true },
  { id: 'np2', label: 'Evaluation requested', description: 'When you are asked to evaluate a candidate', email: true, inApp: true },
  { id: 'np3', label: 'Stage change', description: 'When a candidate you own moves to a new pipeline stage', email: false, inApp: true },
  { id: 'np4', label: 'Note mentions', description: 'When someone @mentions you in a candidate note', email: true, inApp: true },
  { id: 'np5', label: 'Task assigned', description: 'When a task is assigned to you', email: false, inApp: true },
  { id: 'np6', label: 'Weekly digest', description: 'A weekly summary of all hiring activity', email: true, inApp: false },
];

export const mockMyAccountService = {
  getProfile: async (): Promise<UserProfile> => {
    await delay(250);
    return { ...MOCK_PROFILE };
  },

  // TODO: replace with API — PATCH /settings/my-account/profile
  updateProfile: async (input: UpdateProfileInput): Promise<UserProfile> => {
    await delay(400);
    MOCK_PROFILE = {
      ...MOCK_PROFILE,
      name: input.name,
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.jobTitle !== undefined ? { jobTitle: input.jobTitle } : {}),
      ...(input.department !== undefined ? { department: input.department } : {}),
      language: input.language,
      timezone: input.timezone,
      avatarInitials: input.name.split(' ').map(n => n[0] ?? '').join('').toUpperCase().slice(0, 2),
    };
    return { ...MOCK_PROFILE };
  },

  // TODO: replace with API — POST /settings/my-account/change-password
  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await delay(500);
    if (input.currentPassword !== 'password123') {
      throw new Error('Current password is incorrect');
    }
    if (input.newPassword !== input.confirmPassword) {
      throw new Error('Passwords do not match');
    }
  },

  getNotificationPrefs: async (): Promise<AccountNotificationPref[]> => {
    await delay(200);
    return [...MOCK_NOTIF_PREFS];
  },

  // TODO: replace with API — PATCH /settings/my-account/notifications/:id
  updateNotificationPref: async (
    id: string,
    channel: 'email' | 'inApp',
    value: boolean,
  ): Promise<void> => {
    await delay(150);
    MOCK_NOTIF_PREFS = MOCK_NOTIF_PREFS.map(p =>
      p.id === id ? { ...p, [channel]: value } : p,
    );
  },
};
