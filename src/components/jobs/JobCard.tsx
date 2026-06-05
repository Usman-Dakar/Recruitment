import { Calendar, Briefcase, TrendingUp, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Job } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate()

  return (
    <article className="glass rounded-xl p-5 hover:border-brand-500/30 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors leading-snug">
            {job.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{job.departmentName}</p>
        </div>
        <time
          dateTime={job.datePosted}
          className="shrink-0 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 mt-0.5"
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {formatDate(job.datePosted)}
        </time>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs rounded-full">
          <Briefcase className="w-3 h-3" aria-hidden="true" />
          {job.employmentTypeName}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-surface-600/60 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs rounded-full">
          <TrendingUp className="w-3 h-3" aria-hidden="true" />
          {job.experienceLevelName}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-surface-600/60 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs rounded-full">
          <Tag className="w-3 h-3" aria-hidden="true" />
          {job.jobCategoryName}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
        <span className="text-xs text-slate-500 dark:text-slate-500">{job.location}</span>
        <button
          type="button"
          onClick={() => navigate(`/job/${job.id}`)}
          className="px-4 py-1.5 text-xs font-semibold text-brand-400 border border-brand-500/30 rounded-lg hover:bg-brand-500/10 hover:border-brand-500/50 transition-colors"
        >
          View Details
        </button>
      </div>
    </article>
  )
}
