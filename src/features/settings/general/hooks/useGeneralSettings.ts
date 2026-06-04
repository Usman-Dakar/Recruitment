import { useQuery } from '@tanstack/react-query';
import { generalService } from '../services/general.service';

export const GENERAL_KEY = ['settings', 'general'] as const;

export const useCompanyInfo = () =>
  useQuery({
    queryKey: [...GENERAL_KEY, 'company'],
    queryFn: () => generalService.getCompany(),
    staleTime: 1000 * 60 * 10,
  });

export const useLocations = () =>
  useQuery({
    queryKey: [...GENERAL_KEY, 'locations'],
    queryFn: () => generalService.getLocations(),
    staleTime: 1000 * 60 * 5,
  });

export const useTeamMembers = () =>
  useQuery({
    queryKey: [...GENERAL_KEY, 'team'],
    queryFn: () => generalService.getTeam(),
    staleTime: 1000 * 60 * 5,
  });

export const useRolePermissions = () =>
  useQuery({
    queryKey: [...GENERAL_KEY, 'permissions'],
    queryFn: () => generalService.getRolePermissions(),
    staleTime: 1000 * 60 * 60,
  });

export const useReferrals = () =>
  useQuery({
    queryKey: [...GENERAL_KEY, 'referrals'],
    queryFn: () => generalService.getReferrals(),
    staleTime: 1000 * 60 * 2,
  });
