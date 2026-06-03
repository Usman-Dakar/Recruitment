import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Home, Zap, CircleUser, Briefcase, Mail, Info, LayoutGrid, Send,
  LogOut, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'

const navItems = [
  { to: '/',          label: 'Home',            icon: Home,        end: true  },
  { to: '/dashboard', label: 'My Applications', icon: Zap,         end: true  },
  { to: '/profile',   label: 'My Profile',      icon: CircleUser,  end: true  },
  { to: '/jobs',      label: 'Vacancy Search',  icon: Briefcase,   end: false },
  { to: '/inbox',     label: 'Inbox',           icon: Mail,        end: true  },
  { to: '/information', label: 'Information',   icon: Info,        end: false },
  { to: '/about',     label: 'About Us',        icon: LayoutGrid,  end: false },
  { to: '/contact',   label: 'Contact Us',      icon: Send,        end: false },
]

function getInitials(firstName: string, lastName: string, displayName: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (displayName) return displayName[0].toUpperCase()
  return 'U'
}

const SIDEBAR_WIDTH = 'w-[220px]'

interface SidebarNavProps {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const profileReset = useProfileStore((s) => s.reset)

  const handleSignOut = () => {
    profileReset()
    logout()
    onNavigate?.()
    navigate('/')
  }

  const initials = user ? getInitials(user.firstName, user.lastName, user.displayName) : 'U'

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 font-bold text-lg text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          AX Jobs
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Sidebar navigation">
        <ul>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors relative',
                    isActive
                      ? 'bg-black/30 text-white after:absolute after:right-0 after:top-0 after:h-full after:w-0.5 after:bg-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-1 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-1 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside
        className={cn(
          'hidden md:flex fixed inset-y-0 left-0 z-40 flex-col',
          SIDEBAR_WIDTH,
        )}
        style={{ background: 'linear-gradient(180deg, #7b78c4 0%, #6b68b4 100%)' }}
      >
        <SidebarNav />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-white/10"
        style={{ background: '#7b78c4' }}
      >
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </div>
          AX Jobs
        </Link>
        <button
          type="button"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((v) => !v)}
          className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {drawerOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className={cn(
              'md:hidden fixed inset-y-0 left-0 z-50 flex flex-col animate-fade-in-up',
              SIDEBAR_WIDTH,
            )}
            style={{ background: 'linear-gradient(180deg, #7b78c4 0%, #6b68b4 100%)' }}
          >
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}
    </>
  )
}
