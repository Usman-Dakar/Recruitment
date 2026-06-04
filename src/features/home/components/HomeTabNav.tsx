import { useSearchParams } from 'react-router-dom';
import { TabNav } from '@/components/ui/tab-nav';
import type { HomeTab } from '../types/home.types';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'evaluations', label: 'Evaluations' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Recent Notes' },
  { id: 'activity', label: 'Activity' },
];

export function HomeTabNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as HomeTab) ?? 'overview';

  return (
    <TabNav
      tabs={TABS}
      activeTab={activeTab}
      onChange={tab => setSearchParams(tab === 'overview' ? {} : { tab })}
    />
  );
}
