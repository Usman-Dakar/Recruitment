import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { ActivityFeed } from './ActivityFeed';
import { NotificationPrefsPanel } from './NotificationPrefsPanel';

export function ActivityTab() {
  const { data: items = [], isLoading } = useActivityFeed();
  const [prefsOpen, setPrefsOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Activity</h2>
          <p className="text-xs text-muted-foreground">Account-wide event feed</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setPrefsOpen(v => !v)}
        >
          <Bell className="h-3.5 w-3.5" />
          Notification preferences
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ActivityFeed items={items} isLoading={isLoading} />
        </div>

        {prefsOpen && (
          <NotificationPrefsPanel onClose={() => setPrefsOpen(false)} />
        )}
      </div>
    </div>
  );
}
