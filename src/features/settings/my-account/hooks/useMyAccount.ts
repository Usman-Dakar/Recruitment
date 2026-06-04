import { useQuery } from '@tanstack/react-query';
import { myAccountService } from '../services/my-account.service';

export const MY_ACCOUNT_KEY = ['settings', 'my-account'] as const;

export const useMyProfile = () =>
  useQuery({
    queryKey: [...MY_ACCOUNT_KEY, 'profile'],
    queryFn: () => myAccountService.getProfile(),
    staleTime: 1000 * 60 * 10,
  });

export const useNotificationPrefs = () =>
  useQuery({
    queryKey: [...MY_ACCOUNT_KEY, 'notifications'],
    queryFn: () => myAccountService.getNotificationPrefs(),
    staleTime: 1000 * 60 * 5,
  });
