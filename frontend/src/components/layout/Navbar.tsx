import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, X, Briefcase, ChevronDown, LogOut, Settings,
  Home, Zap, CircleUser, Mail, Info, LayoutGrid, Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'

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
  const location = useLocation()
  const isHome = location.pathname === '/'

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const profileReset = useProfileStore((s) => s.reset)
  const profilePicUrl = useProfileStore((s) => s.personalInfo.profilePicUrl)

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
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 border-b',
      isHome
        ? 'bg-white/95 backdrop-blur-md border-gray-200 shadow-sm'
        : 'glass border-white/5',
    )}>
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="gradient-text hidden sm:block">AX Jobs</span>
        </Link>

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
                      ? isHome ? 'bg-brand-500/10 text-brand-600' : 'bg-brand-500/15 text-brand-400'
                      : isHome ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5',
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
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                  isHome ? 'hover:bg-gray-100' : 'hover:bg-white/5',
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden',
                  isHome ? 'bg-brand-50 border border-brand-200 text-brand-600' : 'bg-brand-500/20 border border-brand-500/30 text-brand-300',
                )}>
                  {(profilePicUrl || user.avatarUrl) ? (
                    <img src={profilePicUrl || user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <span className={cn('text-sm font-medium max-w-[100px] truncate', isHome ? 'text-gray-800' : 'text-slate-200')}>
                  {user.firstName || user.displayName}
                </span>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>

              {dropdownOpen && (
                <div className={cn(
                  'absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl overflow-hidden animate-fade-in-up border',
                  isHome ? 'bg-white border-gray-200' : 'glass border-white/10',
                )}>
                  <div className={cn('px-4 py-3 border-b', isHome ? 'border-gray-100' : 'border-white/5')}>
                    <p className={cn('text-sm font-semibold truncate', isHome ? 'text-gray-900' : 'text-slate-100')}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className={cn('text-xs truncate', isHome ? 'text-gray-500' : 'text-slate-400')}>{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                        isHome ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' : 'text-slate-300 hover:text-white hover:bg-white/5',
                      )}
                    >
                      <Settings className={cn('w-4 h-4', isHome ? 'text-gray-400' : 'text-slate-400')} aria-hidden="true" />
                      Account Settings
                    </Link>
                  </div>
                  <div className={cn('border-t py-1', isHome ? 'border-gray-100' : 'border-white/5')}>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={cn(
                        'flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors',
                        isHome ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-red-400 hover:text-red-300 hover:bg-red-500/5',
                      )}
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
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors border',
                  isHome
                    ? 'text-gray-700 border-gray-200 hover:border-brand-500/50 hover:text-brand-600 hover:bg-brand-500/5'
                    : 'text-slate-300 border-white/10 hover:border-brand-500/40 hover:text-white',
                )}
              >
                <CircleUser className="w-3.5 h-3.5" aria-hidden="true" />
                My Profile
              </Link>
              <Link
                to="/login"
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                  isHome
                    ? 'text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
                    : 'text-slate-300 border-white/10 hover:border-brand-500/40 hover:text-white',
                )}
              >
                Login
              </Link>
              <Link
                to="/login#register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-400 transition-colors shadow-sm"
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
            'p-2 rounded-lg transition-colors touch-target',
            isHome ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-400 hover:text-white hover:bg-white/5',
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
        <div className={cn(
          'border-t animate-fade-in-up',
          isHome
            ? 'border-gray-200 bg-white'
            : 'border-white/5 bg-surface-900/95 backdrop-blur-xl',
        )}>
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
                        ? isHome ? 'bg-brand-500/10 text-brand-600' : 'bg-brand-500/15 text-brand-400'
                        : isHome ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5',
                    )
                  }
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
                  {label}
                </NavLink>
              </li>
            ))}
            {/* My Profile — shown in mobile nav when unauthenticated (matches design) */}
            {!isAuthenticated && (
              <li>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isHome ? 'text-brand-600 hover:bg-brand-50' : 'text-brand-400 hover:bg-brand-500/10',
                  )}
                >
                  <CircleUser className="w-4 h-4 shrink-0" aria-hidden="true" />
                  My Profile
                </Link>
              </li>
            )}
          </ul>

          <div className={cn('px-4 py-3 border-t', isHome ? 'border-gray-200' : 'border-white/5')}>
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden',
                    isHome ? 'bg-brand-50 border border-brand-200 text-brand-600' : 'bg-brand-500/20 border border-brand-500/30 text-brand-300',
                  )}>
                    {(profilePicUrl || user.avatarUrl) ? (
                      <img src={profilePicUrl || user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium truncate', isHome ? 'text-gray-900' : 'text-slate-200')}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className={cn('text-xs truncate', isHome ? 'text-gray-500' : 'text-slate-400')}>{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isHome ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-300 hover:text-white hover:bg-white/5',
                  )}
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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
                  className={cn(
                    'flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                    isHome ? 'text-gray-700 border-gray-200 hover:border-brand-500/50' : 'text-slate-300 border-white/10 hover:border-brand-500/40 hover:text-white',
                  )}
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
