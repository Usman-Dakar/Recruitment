import { useState } from 'react'
import { Mail, Search } from 'lucide-react'

type ReadFilter = 'all' | 'read' | 'unread'
type OrderFilter = 'desc' | 'asc'

export default function InboxPage() {
  const [readFilter, setReadFilter] = useState<ReadFilter>('all')
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('desc')

  const selectClass =
    'bg-surface-700 border border-white/10 rounded-lg text-sm text-slate-200 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Inbox</h1>
        <p className="text-sm text-slate-400">Notifications and messages from the HR team.</p>
      </div>

      {/* Filter bar */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="readStatus" className="text-xs text-slate-400 shrink-0">
              Status
            </label>
            <select
              id="readStatus"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value as ReadFilter)}
              className={selectClass}
            >
              <option value="all">All</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="orderBy" className="text-xs text-slate-400 shrink-0">
              Order by
            </label>
            <select
              id="orderBy"
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value as OrderFilter)}
              className={selectClass}
            >
              <option value="desc">Latest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            Search
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-14 h-14 rounded-full bg-surface-700/60 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-slate-500" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold text-slate-300 mb-1">No messages</h2>
        <p className="text-xs text-slate-500">
          {readFilter === 'unread'
            ? 'No unread messages at this time.'
            : 'Your inbox is empty. Notifications will appear here.'}
        </p>
      </div>
    </div>
  )
}
