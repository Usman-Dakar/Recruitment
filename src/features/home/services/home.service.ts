import type { WidgetCounts } from '../types/home.types';
import { mockGetWidgetCounts } from './home.mock';

export const homeService = {
  getWidgetCounts: (): Promise<WidgetCounts> => mockGetWidgetCounts(),
};
