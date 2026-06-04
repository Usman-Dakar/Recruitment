import type { LoginCredentials, LoginResponse, TwoFactorCredentials, VerifyResponse } from '../types/auth.types';

const MOCK_USER = {
  id: '1',
  name: 'Anas Khan',
  email: 'test@test.com',
  role: 'admin',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// TODO: replace with API — POST /auth/login
export async function mockLogin(credentials: LoginCredentials): Promise<LoginResponse> {
  await delay(800);
  if (credentials.email && credentials.password) {
    return { requires2FA: true, tempToken: 'mock-temp-token' };
  }
  throw new Error('Invalid credentials');
}

// TODO: replace with API — POST /auth/verify-2fa
export async function mockVerify2FA(payload: TwoFactorCredentials): Promise<VerifyResponse> {
  await delay(600);
  if (payload.tempToken === 'mock-temp-token' && payload.code === '000000') {
    return { user: MOCK_USER, token: 'mock-auth-token' };
  }
  throw new Error('Invalid code. Use 000000 for demo.');
}
