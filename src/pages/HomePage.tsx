import { useSearchParams } from 'react-router-dom';
import {
  ActivityTab,
  CalendarView,
  EvaluationsTab,
  HomeTabNav,
  OverviewContent,
  RecentNotesTab,
  TasksTab,
  WidgetBar,
} from '@/features/home';
import type { HomeTab } from '@/features/home';

const FULL_HEIGHT_TABS: HomeTab[] = ['calendar', 'evaluations', 'activity'];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as HomeTab) ?? 'overview';
  const isFullHeight = FULL_HEIGHT_TABS.includes(activeTab);

  return (
    <div className="flex h-full flex-col">
      <WidgetBar />
      <HomeTabNav />
      <div className={isFullHeight ? 'flex flex-1 flex-col overflow-hidden' : 'flex-1 overflow-y-auto'}>
        {activeTab === 'overview' && <OverviewContent />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'evaluations' && <EvaluationsTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'notes' && <RecentNotesTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </div>
    </div>
  );
}
