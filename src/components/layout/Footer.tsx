import { Link } from 'react-router-dom'
import { Sparkles, MapPin, Phone, Mail } from 'lucide-react'

const quickLinks = [
  { to: '/jobs',        label: 'Browse Jobs'       },
  { to: '/information', label: 'Career Information' },
  { to: '/about',       label: 'About AX Group'    },
  { to: '/contact',     label: 'Contact Us'         },
  { to: '/profile',     label: 'My Profile'         },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-surface-950 border-t border-gray-200 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="gradient-text tracking-tight">AX Jobs</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-xs">
              AX Group is one of Malta's leading employers — careers across hospitality, real estate, construction, and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">
              Contact
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <MapPin size={15} className="mt-0.5 text-brand-500 shrink-0" aria-hidden="true" />
                <span>AX Business Centre, Triq Id-Difesa Civili,<br />Mosta MST 1741, Malta</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <Phone size={15} className="text-brand-500 shrink-0" aria-hidden="true" />
                <a href="tel:+35623312345" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">+356 2331 2345</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <Mail size={15} className="text-brand-500 shrink-0" aria-hidden="true" />
                <a href="mailto:info@axgroup.mt" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">info@axgroup.mt</a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-slate-500">&copy; {new Date().getFullYear()} AX Group. All rights reserved.</p>
          <p className="text-xs text-gray-300 dark:text-slate-600">axgroup.mt</p>
        </div>
      </div>
    </footer>
  )
}
