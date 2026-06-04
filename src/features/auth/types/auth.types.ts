export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorCredentials {
  code: string;
  tempToken: string;
}

export interface LoginResponse {
  requires2FA: boolean;
  tempToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export interface VerifyResponse {
  user: AuthUser;
  token: string;
}
