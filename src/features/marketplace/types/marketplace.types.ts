export type PluginCategory =
  | 'job_board'
  | 'assessment'
  | 'background_check'
  | 'communication'
  | 'analytics'
  | 'hr_system'
  | 'calendar';

export type PluginStatus = 'available' | 'installed' | 'coming_soon';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: PluginCategory;
  status: PluginStatus;
  isEnabled: boolean;
  developer: string;
  version: string;
  features: string[];
  rating: number;
  reviewCount: number;
}

export interface MarketplaceFilters {
  search?: string;
  category?: PluginCategory;
  installed?: boolean;
}
