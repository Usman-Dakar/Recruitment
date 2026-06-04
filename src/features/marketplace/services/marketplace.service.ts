import type { MarketplaceFilters } from '../types/marketplace.types';
import { mockMarketplaceService } from './marketplace.mock';

export const marketplaceService = {
  getPlugins: (filters?: MarketplaceFilters) =>
    mockMarketplaceService.getPlugins(filters), // TODO: replace with API — GET /marketplace/plugins
  install: (pluginId: string) =>
    mockMarketplaceService.install(pluginId), // TODO: replace with API — POST /marketplace/plugins/:id/install
  uninstall: (pluginId: string) =>
    mockMarketplaceService.uninstall(pluginId), // TODO: replace with API — DELETE /marketplace/plugins/:id/install
  toggleEnabled: (pluginId: string, isEnabled: boolean) =>
    mockMarketplaceService.toggleEnabled(pluginId, isEnabled), // TODO: replace with API — PATCH /marketplace/plugins/:id/toggle
};
