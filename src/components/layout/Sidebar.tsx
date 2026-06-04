import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Bookmark,
  Briefcase,
  Crosshair,
  Home,
  LogOut,
  Mail,
  Menu,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { to: '/home', icon: Home, label: 'Home', end: true },
      { to: '/candidates', icon: Users, label: 'Candidates', end: false },
      { to: '/jobs', icon: Briefcase, label: 'Jobs', end: false },
      { to: '/mailbox', icon: Mail, label: 'Mailbox', end: false },
      { to: '/analytics', icon: BarChart2, label: 'Analytics', end: false },
      { to: '/talent-pools', icon: Bookmark, label: 'Talent Pools', end: false },
    ],
  },
  {
    label: 'Sourcing',
    items: [
      { to: '/acquisitions', icon: Crosshair, label: 'Acquisitions', end: false },
      { to: '/marketplace', icon: Store, label: 'Marketplace', end: false },
    ],
  },
];

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'group relative flex h-9 w-full items-center rounded-md text-sm font-medium transition-colors',
              collapsed ? 'justify-center' : 'gap-3 px-3',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && !collapsed && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-primary" />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
            </>
          )}
        </NavLink>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" sideOffset={10}>
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const collapsed = !sidebarOpen;

  const initials = user?.name ? getInitials(user.name) : '??';

  function handleSignOut() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-border bg-slate-50 overflow-x-hidden transition-[width,transform] duration-300 ease-in-out',
        // Mobile: fixed overlay
        'fixed inset-y-0 left-0 z-50 w-60',
        // Desktop: inline in flex row
        'md:relative md:inset-y-auto md:left-auto md:z-auto',
        sidebarOpen
          ? 'translate-x-0 md:w-60'
          : '-translate-x-full md:translate-x-0 md:w-16',
      )}
    >
      {/* Header — logo + hamburger toggle */}
      <div className="flex h-14 shrink-0 items-center border-b border-border">
        {collapsed ? (
          /* Collapsed: full-width hamburger button */
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="flex h-full w-full items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : (
          /* Expanded: logo on left, hamburger on right */
          <>
            <div className="flex flex-1 items-center gap-2.5 pl-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
                <span className="text-[13px] font-bold leading-none text-primary-foreground">D</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-slate-800">
                Dakar
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && 'mt-1')}>
            {!collapsed && (
              <p className="mx-4 mb-1 mt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
            )}
            {gi > 0 && collapsed && (
              <div className="mx-auto mb-1 mt-2 h-px w-8 bg-border" />
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map(item => (
                <li key={item.to}>
                  <NavItemLink item={item} collapsed={collapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Settings — always last, separated */}
        <div className={cn('mt-1', collapsed && 'mt-2')}>
          {!collapsed && (
            <p className="mx-4 mb-1 mt-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Config
            </p>
          )}
          {collapsed && <div className="mx-auto mb-1 mt-2 h-px w-8 bg-border" />}
          <div className="px-2">
            <NavItemLink
              item={{ to: '/settings', icon: Settings, label: 'Settings', end: false }}
              collapsed={collapsed}
            />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border">
        {/* User row */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleSignOut}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-slate-100',
                collapsed && 'justify-center px-0',
              )}
            >
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{user?.name ?? 'User'}</p>
                  <p className="truncate text-[10px] text-slate-400">{user?.email ?? ''}</p>
                </div>
              )}
              {!collapsed && <LogOut className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              Sign out
            </TooltipContent>
          )}
        </Tooltip>

      </div>
    </aside>
  );
}
