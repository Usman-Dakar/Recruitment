import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu, X, Layers, Briefcase, ChevronDown, LogOut, Settings,
  Home, Zap, CircleUser, Mail, Info, LayoutGrid, Send, Sun, Moon, User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useThemeStore } from '@/store/themeStore'

/* ── Nav link definitions ── */
const publicNavLinks = [
  { to: '/',            label: 'Home',        end: true,  icon: null },
  { to: '/jobs',        label: 'Jobs',        end: false, icon: null },
  { to: '/information', label: 'Information', end: false, icon: null },
  { to: '/about',       label: 'About Us',    end: false, icon: null },
  { to: '/contact',     label: 'Contact',     end: false, icon: null },
]

const authNavLinks = [
  { to: '/',            label: 'Home',            end: true,  icon: Home        },
  { to: '/dashboard',   label: 'My Applications', end: true,  icon: Zap         },
  { to: '/profile',     label: 'My Profile',      end: true,  icon: CircleUser  },
  { to: '/jobs',        label: 'Vacancy Search',  end: false, icon: Briefcase   },
  { to: '/inbox',       label: 'Inbox',           end: true,  icon: Mail        },
  { to: '/information', label: 'Information',     end: false, icon: Info        },
  { to: '/about',       label: 'About Us',        end: false, icon: LayoutGrid  },
  { to: '/contact',     label: 'Contact Us',      end: false, icon: Send        },
]

function getInitials(firstName: string, lastName: string, displayName: string) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (displayName) return displayName[0].toUpperCase()
  return 'U'
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const profileReset = useProfileStore((s) => s.reset)
  const profilePicUrl = useProfileStore((s) => s.personalInfo.profilePicUrl)
  const { theme, toggle: toggleTheme } = useThemeStore()

  const navLinks = isAuthenticated ? authNavLinks : publicNavLinks

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    profileReset()
    logout()
    setDropdownOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  const initials = user ? getInitials(user.firstName, user.lastName, user.displayName) : 'U'

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2"
        aria-label="Main navigation"
      >
        {/* Logo + theme toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="gradient-text font-bold hidden sm:block tracking-tight">AX Jobs</span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="ml-1 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5" aria-hidden="true" />
              : <Moon className="w-5 h-5" aria-hidden="true" />
            }
          </button>
        </div>

        {/* Desktop nav — hidden on mobile, shown lg+ when authenticated (8 items), md+ when public (5 items) */}
        <ul
          className={cn(
            'hidden items-center gap-0.5 flex-1 justify-center',
            isAuthenticated ? 'lg:flex' : 'md:flex',
          )}
        >
          {navLinks.map(({ to, label, end, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg font-medium transition-colors whitespace-nowrap',
                    isAuthenticated ? 'px-2.5 py-2 text-xs' : 'px-3 py-2 text-sm',
                    isActive
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5',
                  )
                }
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop: auth section */}
        <div
          className={cn(
            'hidden items-center gap-2 shrink-0',
            isAuthenticated ? 'lg:flex' : 'md:flex',
          )}
        >
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-xs font-bold overflow-hidden">
                  {(profilePicUrl || user.avatarUrl) ? (
                    <img src={profilePicUrl || user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium max-w-[100px] truncate">
                  {user.firstName || user.displayName}
                </span>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border border-white/10 shadow-xl overflow-hidden animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      Account Settings
                    </Link>
                  </div>
                  <div className="border-t border-white/5 py-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-brand-400 hover:text-brand-600 dark:hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                My Profile
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login#register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — shown below lg when authenticated, below md when public */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            'p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors touch-target',
            isAuthenticated ? 'lg:hidden' : 'md:hidden',
          )}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-100 dark:border-white/5 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl animate-fade-in-up">
          <ul className="px-4 py-3 space-y-0.5">
            {navLinks.map(({ to, label, end, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5',
                    )
                  }
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 border-t border-white/5">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors mb-1"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />
              }
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-xs font-bold shrink-0 overflow-hidden">
                    {(profilePicUrl || user.avatarUrl) ? (
                      <img src={profilePicUrl || user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-white/10 hover:border-brand-500/40 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/login#register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
