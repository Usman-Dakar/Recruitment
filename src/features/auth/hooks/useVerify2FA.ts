import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '../services/auth.service';
import type { TwoFactorCredentials } from '../types/auth.types';

export function useVerify2FA() {
  const setAuth = useAuthStore(s => s.setAuth);

  return useMutation({
    mutationFn: (payload: TwoFactorCredentials) => authService.verify2FA(payload),
    onSuccess: data => {
      setAuth(data.user, data.token);
    },
  });
}
