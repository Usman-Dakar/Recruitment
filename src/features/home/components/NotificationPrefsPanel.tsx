import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { NotificationPref } from '../types/activity.types';

const DEFAULT_PREFS: NotificationPref[] = [
  { id: 'evaluations', label: 'Evaluations', description: 'New requests and completions', enabled: true },
  { id: 'tasks', label: 'Tasks', description: 'Assignments and due date reminders', enabled: true },
  { id: 'notes', label: 'Notes', description: 'Notes and replies on candidates', enabled: true },
  { id: 'jobs', label: 'Jobs', description: 'Published jobs and pipeline changes', enabled: false },
  { id: 'candidates', label: 'Candidates', description: 'New applications and status updates', enabled: true },
  { id: 'calendar', label: 'Calendar', description: 'Scheduled interviews and reminders', enabled: true },
];

interface NotificationPrefsPanelProps {
  onClose: () => void;
}

export function NotificationPrefsPanel({ onClose }: NotificationPrefsPanelProps) {
  const [prefs, setPrefs] = useState<NotificationPref[]>(DEFAULT_PREFS);

  const toggle = (id: string) => {
    setPrefs(p => p.map(pref => pref.id === id ? { ...pref, enabled: !pref.enabled } : pref));
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Notification preferences</span>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-4 text-xs text-muted-foreground">
          Choose which events trigger email and in-app notifications.
        </p>

        <div className="space-y-1">
          {prefs.map((pref, i) => (
            <div key={pref.id}>
              {i > 0 && <Separator className="my-3" />}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.label}</p>
                  <p className="text-xs text-muted-foreground">{pref.description}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={pref.enabled}
                  onClick={() => toggle(pref.id)}
                  className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    pref.enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      pref.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button className="w-full" size="sm" onClick={onClose}>
          Save preferences
        </Button>
      </div>
    </aside>
  );
}
