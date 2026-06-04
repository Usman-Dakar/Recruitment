import type { LoginCredentials, LoginResponse, TwoFactorCredentials, VerifyResponse } from '../types/auth.types';
import { mockLogin, mockVerify2FA } from './auth.mock';

export const authService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    mockLogin(credentials),

  verify2FA: (payload: TwoFactorCredentials): Promise<VerifyResponse> =>
    mockVerify2FA(payload),
};
