import { useMutation, useQueryClient } from '@tanstack/react-query';
import { myAccountService } from '../services/my-account.service';
import { MY_ACCOUNT_KEY } from './useMyAccount';
import type { UpdateProfileInput, ChangePasswordInput } from '../types/my-account.types';

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => myAccountService.updateProfile(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...MY_ACCOUNT_KEY, 'profile'] }),
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (input: ChangePasswordInput) => myAccountService.changePassword(input),
  });

export const useUpdateNotificationPref = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      channel,
      value,
    }: {
      id: string;
      channel: 'email' | 'inApp';
      value: boolean;
    }) => myAccountService.updateNotificationPref(id, channel, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...MY_ACCOUNT_KEY, 'notifications'] }),
  });
};
