import {
  Briefcase, ChevronDown, HelpCircle, Menu, Plus, Search, Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { NotificationBell } from './NotificationBell';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const initials = user?.name ? getInitials(user.name) : 'AK';

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSearchOpen]);

  function handleSignOut() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <>
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-4 gap-3 relative z-50">
      {/* Mobile hamburger — only visible when sidebar is closed on small screens */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Logo — width syncs with sidebar state */}
      <Link
        to="/home"
        className={cn(
          'flex items-center gap-2 shrink-0 transition-[width] duration-300',
          sidebarOpen ? 'w-60' : 'w-16',
        )}
      >
        <div className="h-7 w-7 shrink-0 rounded-md bg-primary flex items-center justify-center">
          <span className="text-[11px] font-bold text-primary-foreground leading-none">R</span>
        </div>
        {sidebarOpen && (
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
            <span className="text-muted-foreground">softens</span>
            <span className="text-primary"> recruitee</span>
          </span>
        )}
      </Link>

      {/* Workspace breadcrumb */}
      <button className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted transition-colors shrink-0">
        Your trial
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {/* Search — click or Ctrl+K opens the search modal */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setSearchOpen(true)}
        onKeyDown={e => e.key === 'Enter' && setSearchOpen(true)}
        className="relative flex flex-1 max-w-md cursor-pointer"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <div className="flex h-9 w-full items-center rounded-md border border-input bg-background pl-9 pr-16 text-sm text-muted-foreground select-none hover:border-ring transition-colors">
          Search, jump to, and more
        </div>
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-80 sm:flex">
          CTRL K
        </kbd>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-0.5">
        {/* Quick create */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="New"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate('/jobs')}>
              <Briefcase className="h-4 w-4 mr-2" />
              New job
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/candidates')}>New candidate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <button
          aria-label="Help"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Settings */}
        <button
          aria-label="Settings"
          onClick={() => navigate('/settings')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link to="/settings/my-account">Profile & settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
