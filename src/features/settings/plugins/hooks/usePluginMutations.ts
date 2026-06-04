import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pluginsSettingsService } from '../services/plugins.service';
import type { UpdatePluginConfigInput } from '../types/plugins.types';
import { INSTALLED_PLUGINS_KEY } from './useInstalledPlugins';

export const useTogglePlugin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pluginsSettingsService.togglePlugin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSTALLED_PLUGINS_KEY }),
  });
};

export const useUpdatePluginConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePluginConfigInput) =>
      pluginsSettingsService.updatePluginConfig(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSTALLED_PLUGINS_KEY }),
  });
};

export const useSyncPlugin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pluginsSettingsService.syncPlugin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: INSTALLED_PLUGINS_KEY }),
  });
};
