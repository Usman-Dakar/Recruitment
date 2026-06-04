import { useSearchParams } from 'react-router-dom';
import { TabNav } from '@/components/ui/tab-nav';
import type { JobDetailTab } from '../types/job.types';

const TABS = [
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'activity', label: 'Activity' },
  { id: 'notes', label: 'Notes' },
];

export function JobTabNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = (searchParams.get('tab') as JobDetailTab) ?? 'pipeline';

  return (
    <TabNav
      tabs={TABS}
      activeTab={active}
      onChange={tab => {
        const next = Object.fromEntries(searchParams.entries());
        next['tab'] = tab;
        setSearchParams(next);
      }}
    />
  );
}
