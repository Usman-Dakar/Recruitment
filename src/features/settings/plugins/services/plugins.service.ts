import { mockPluginsSettingsService } from './plugins.mock';
import type { InstalledPlugin, UpdatePluginConfigInput } from '../types/plugins.types';

// TODO: replace with API — GET /settings/plugins
const getInstalledPlugins = (): Promise<InstalledPlugin[]> =>
  mockPluginsSettingsService.getInstalledPlugins();

// TODO: replace with API — PATCH /settings/plugins/:id/toggle
const togglePlugin = (id: string): Promise<void> =>
  mockPluginsSettingsService.togglePlugin(id);

// TODO: replace with API — PATCH /settings/plugins/:id/config
const updatePluginConfig = (input: UpdatePluginConfigInput): Promise<void> =>
  mockPluginsSettingsService.updatePluginConfig(input);

// TODO: replace with API — POST /settings/plugins/:id/sync
const syncPlugin = (id: string): Promise<void> =>
  mockPluginsSettingsService.syncPlugin(id);

export const pluginsSettingsService = {
  getInstalledPlugins,
  togglePlugin,
  updatePluginConfig,
  syncPlugin,
};
