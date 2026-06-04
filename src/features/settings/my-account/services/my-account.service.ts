import type { UpdateProfileInput, ChangePasswordInput } from '../types/my-account.types';
import { mockMyAccountService } from './my-account.mock';

export const myAccountService = {
  getProfile: () =>
    mockMyAccountService.getProfile(), // TODO: replace with API — GET /settings/my-account/profile
  updateProfile: (input: UpdateProfileInput) =>
    mockMyAccountService.updateProfile(input), // TODO: replace with API — PATCH /settings/my-account/profile
  changePassword: (input: ChangePasswordInput) =>
    mockMyAccountService.changePassword(input), // TODO: replace with API — POST /settings/my-account/change-password
  getNotificationPrefs: () =>
    mockMyAccountService.getNotificationPrefs(), // TODO: replace with API — GET /settings/my-account/notifications
  updateNotificationPref: (id: string, channel: 'email' | 'inApp', value: boolean) =>
    mockMyAccountService.updateNotificationPref(id, channel, value), // TODO: replace with API — PATCH /settings/my-account/notifications/:id
};
