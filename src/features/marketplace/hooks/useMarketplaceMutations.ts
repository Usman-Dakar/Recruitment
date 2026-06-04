import { useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '../services/marketplace.service';
import { MARKETPLACE_KEY } from './useMarketplace';

export const useInstallPlugin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pluginId: string) => marketplaceService.install(pluginId),
    onSuccess: () => qc.invalidateQueries({ queryKey: MARKETPLACE_KEY }),
  });
};

export const useUninstallPlugin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pluginId: string) => marketplaceService.uninstall(pluginId),
    onSuccess: () => qc.invalidateQueries({ queryKey: MARKETPLACE_KEY }),
  });
};

export const useTogglePlugin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pluginId, isEnabled }: { pluginId: string; isEnabled: boolean }) =>
      marketplaceService.toggleEnabled(pluginId, isEnabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: MARKETPLACE_KEY }),
  });
};
