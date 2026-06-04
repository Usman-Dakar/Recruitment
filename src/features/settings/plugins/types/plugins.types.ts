export type PluginConfigFieldType = 'text' | 'password' | 'select' | 'toggle';
export type InstalledPluginCategory =
  | 'job_board'
  | 'assessment'
  | 'background_check'
  | 'communication'
  | 'calendar'
  | 'hr_system';

export interface PluginConfigOption {
  value: string;
  label: string;
}

export interface PluginConfigField {
  key: string;
  label: string;
  type: PluginConfigFieldType;
  value: string | boolean;
  options?: PluginConfigOption[];
  placeholder?: string;
  description?: string;
}

export interface InstalledPlugin {
  id: string;
  name: string;
  description: string;
  category: InstalledPluginCategory;
  isEnabled: boolean;
  version: string;
  configFields: PluginConfigField[];
  lastSyncedAt?: Date;
}

export type UpdatePluginConfigInput = {
  id: string;
  configFields: PluginConfigField[];
};
