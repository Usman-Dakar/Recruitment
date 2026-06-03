import { Link } from 'react-router-dom'
import { Briefcase, Bookmark, ArrowRight, Calendar } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const appliedJobs = useProfileStore((s) => s.appliedJobs)
  const bookmarkedJobs = useProfileStore((s) => s.bookmarkedJobs)

  const firstName = user?.firstName || user?.displayName || 'there'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, <span className="gradient-text">{firstName}</span>!
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here's a summary of your job activity.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Applications', value: appliedJobs.length, icon: <Briefcase className="w-5 h-5" /> },
          { label: 'Bookmarks', value: bookmarkedJobs.length, icon: <Bookmark className="w-5 h-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Applied Vacancies */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" aria-hidden="true" />
              <h2 className="font-semibold text-slate-200 text-sm">My Applied Vacancies</h2>
            </div>
            <Link
              to="/jobs"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              Find jobs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4">
            {appliedJobs.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-700/60 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-5 h-5 text-slate-500" aria-hidden="true" />
                </div>
                <p className="text-sm text-slate-400">No applications yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Browse open positions and apply.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {appliedJobs.map((job) => (
                  <li key={job.jobId} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/job/${job.jobId}`}
                        className="text-sm font-medium text-slate-200 hover:text-brand-300 transition-colors truncate block"
                      >
                        {job.title}
                      </Link>
                      <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Calendar className="w-3 h-3" aria-hidden="true" />
                        Applied {job.dateApplied}
                      </span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400">
                      Applied
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-brand-400" aria-hidden="true" />
              <h2 className="font-semibold text-slate-200 text-sm">My Bookmarks</h2>
            </div>
            <Link
              to="/jobs"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              Browse <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4">
            {bookmarkedJobs.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-700/60 flex items-center justify-center mx-auto mb-3">
                  <Bookmark className="w-5 h-5 text-slate-500" aria-hidden="true" />
                </div>
                <p className="text-sm text-slate-400">No bookmarks yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Save jobs you're interested in.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {bookmarkedJobs.map((job) => (
                  <li key={job.jobId} className="py-3">
                    <Link
                      to={`/job/${job.jobId}`}
                      className="text-sm font-medium text-slate-200 hover:text-brand-300 transition-colors"
                    >
                      {job.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 glass rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick Links</p>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/profile', label: 'My CV Builder' },
            { to: '/jobs', label: 'Search Vacancies' },
            { to: '/inbox', label: 'Inbox' },
            { to: '/account', label: 'Account Settings' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm text-slate-300 glass rounded-lg hover:border-brand-500/30 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
