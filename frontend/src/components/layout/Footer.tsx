import { Link, useLocation } from 'react-router-dom'
import { Briefcase, MapPin, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const quickLinks = [
  { to: '/jobs',        label: 'Browse Jobs'        },
  { to: '/information', label: 'Career Information' },
  { to: '/about',       label: 'About AX Group'     },
  { to: '/contact',     label: 'Contact Us'         },
  { to: '/profile',     label: 'My Profile'         },
]

export default function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <footer className={cn(
      'border-t mt-auto',
      isHome ? 'bg-gray-50 border-gray-200' : 'bg-surface-900 border-white/5',
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="gradient-text">AX Jobs</span>
            </div>
            <p className={cn('text-sm leading-relaxed max-w-xs', isHome ? 'text-gray-500' : 'text-slate-400')}>
              AX Group is one of Malta's leading employers — careers across hospitality, real estate, construction, and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={cn('text-xs font-semibold uppercase tracking-widest mb-4', isHome ? 'text-gray-500' : 'text-slate-300')}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn(
                      'text-sm transition-colors',
                      isHome ? 'text-gray-500 hover:text-brand-600' : 'text-slate-400 hover:text-brand-400',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={cn('text-xs font-semibold uppercase tracking-widest mb-4', isHome ? 'text-gray-500' : 'text-slate-300')}>
              Contact
            </h3>
            <address className="not-italic space-y-3">
              <div className={cn('flex items-start gap-2.5 text-sm', isHome ? 'text-gray-500' : 'text-slate-400')}>
                <MapPin className={cn('w-4 h-4 mt-0.5 shrink-0', isHome ? 'text-brand-500' : 'text-brand-400')} aria-hidden="true" />
                <span>AX Business Centre, Triq Id-Difiza Civili,<br />Mosta MST 1741, Malta</span>
              </div>
              <div className={cn('flex items-center gap-2.5 text-sm', isHome ? 'text-gray-500' : 'text-slate-400')}>
                <Phone className={cn('w-4 h-4 shrink-0', isHome ? 'text-brand-500' : 'text-brand-400')} aria-hidden="true" />
                <a href="tel:+35623312345" className={cn('transition-colors', isHome ? 'hover:text-brand-600' : 'hover:text-brand-400')}>
                  +356 2331 2345
                </a>
              </div>
              <div className={cn('flex items-center gap-2.5 text-sm', isHome ? 'text-gray-500' : 'text-slate-400')}>
                <Mail className={cn('w-4 h-4 shrink-0', isHome ? 'text-brand-500' : 'text-brand-400')} aria-hidden="true" />
                <a href="mailto:info@axgroup.mt" className={cn('transition-colors', isHome ? 'hover:text-brand-600' : 'hover:text-brand-400')}>
                  info@axgroup.mt
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className={cn('mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3', isHome ? 'border-gray-200' : 'border-white/5')}>
          <p className={cn('text-xs', isHome ? 'text-gray-400' : 'text-slate-500')}>
            &copy; {new Date().getFullYear()} AX Group. All rights reserved.
          </p>
          <p className={cn('text-xs', isHome ? 'text-gray-300' : 'text-slate-600')}>
            <a href="https://axgroup.mt" target="_blank" rel="noopener noreferrer" className={cn('transition-colors', isHome ? 'hover:text-gray-500' : 'hover:text-slate-400')}>
              axgroup.mt
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
