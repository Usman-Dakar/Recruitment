import { useQuery } from '@tanstack/react-query';
import { pluginsSettingsService } from '../services/plugins.service';

export const INSTALLED_PLUGINS_KEY = ['settings', 'plugins', 'installed'] as const;

export const useInstalledPlugins = () =>
  useQuery({
    queryKey: INSTALLED_PLUGINS_KEY,
    queryFn: () => pluginsSettingsService.getInstalledPlugins(),
    staleTime: 1000 * 60 * 5,
  });
