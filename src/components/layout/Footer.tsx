import { Link } from 'react-router-dom'
import { Briefcase, MapPin, Phone, Mail } from 'lucide-react'

const quickLinks = [
  { to: '/jobs',        label: 'Browse Jobs' },
  { to: '/information', label: 'Career Information' },
  { to: '/about',       label: 'About AX Group' },
  { to: '/contact',     label: 'Contact Us' },
  { to: '/login',       label: 'Login / Register' },
]

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-white/5 mt-auto">
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
            <p className="text-sm text-slate-400 leading-relaxed">
              AX Group is one of Malta's leading employers, offering exciting career opportunities across hospitality, real estate, construction, and technology sectors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Contact
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" aria-hidden="true" />
                <span>
                  AX Business Centre, Triq Id-Difiza Civili,
                  <br />Mosta MST 1741, Malta
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
                <a href="tel:+35623312345" className="hover:text-brand-400 transition-colors">
                  +356 2331 2345
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
                <a href="mailto:info@axgroup.mt" className="hover:text-brand-400 transition-colors">
                  info@axgroup.mt
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AX Group. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            <a href="https://axgroup.mt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">
              axgroup.mt
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
