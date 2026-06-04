import { NavLink, Outlet } from 'react-router-dom';
import { User, Settings, GitBranch, FileText, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/settings/my-account', label: 'My Account', icon: User },
  { to: '/settings/general', label: 'General', icon: Settings },
  { to: '/settings/workflow', label: 'Workflow', icon: GitBranch },
  { to: '/settings/templates', label: 'Templates', icon: FileText },
  { to: '/settings/plugins', label: 'Plugins', icon: Puzzle },
];

export function SettingsLayout() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <nav className="w-52 shrink-0 border-r border-border bg-white overflow-y-auto">
        <div className="px-3 py-4">
          <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Settings
          </p>
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
