import { Skeleton } from '@/components/ui/skeleton';
import { useNotificationPrefs, useUpdateNotificationPref } from '../hooks';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary' : 'bg-input'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform mt-0.5 ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function NotificationPrefsSection() {
  const { data: prefs, isLoading } = useNotificationPrefs();
  const updateMutation = useUpdateNotificationPref();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[1fr_4rem_4rem] gap-4 px-4 pb-2">
        <span />
        <span className="text-xs font-medium text-muted-foreground text-center">Email</span>
        <span className="text-xs font-medium text-muted-foreground text-center">In-app</span>
      </div>
      {prefs?.map(pref => (
        <div
          key={pref.id}
          className="grid grid-cols-[1fr_4rem_4rem] gap-4 items-center px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div>
            <p className="text-sm font-medium">{pref.label}</p>
            <p className="text-xs text-muted-foreground">{pref.description}</p>
          </div>
          <div className="flex justify-center">
            <Toggle
              checked={pref.email}
              disabled={updateMutation.isPending}
              onChange={v => updateMutation.mutate({ id: pref.id, channel: 'email', value: v })}
            />
          </div>
          <div className="flex justify-center">
            <Toggle
              checked={pref.inApp}
              disabled={updateMutation.isPending}
              onChange={v => updateMutation.mutate({ id: pref.id, channel: 'inApp', value: v })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
