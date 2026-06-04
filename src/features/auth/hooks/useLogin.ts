import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../types/auth.types';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
  });
}
