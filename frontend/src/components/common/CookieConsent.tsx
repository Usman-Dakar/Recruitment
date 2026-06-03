import { useState } from 'react'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('ax-cookie-consent') === '1',
  )

  if (dismissed) return null

  const accept = () => {
    localStorage.setItem('ax-cookie-consent', '1')
    setDismissed(true)
  }

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:right-4 md:left-6 md:right-auto md:max-w-lg z-50">
      <div className="glass rounded-xl p-4 flex items-start gap-3 shadow-2xl border-brand-500/20">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 leading-relaxed">
            We use cookies to ensure that we give you the best experience on our website.{' '}
            <a
              href="/cookies"
              className="text-brand-400 underline underline-offset-2 hover:text-brand-300 transition-colors"
            >
              More Info
            </a>
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <button
            type="button"
            onClick={accept}
            className="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors touch-target"
          >
            Got It
          </button>
          <button
            type="button"
            aria-label="Dismiss cookie notice"
            onClick={accept}
            className="p-1.5 text-slate-400 hover:text-white transition-colors touch-target rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
