export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  avatarInitials: string;
  language: string;
  timezone: string;
}

export interface UpdateProfileInput {
  name: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  language: string;
  timezone: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountNotificationPref {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}
