import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  GraduationCap,
  TrendingUp,
  MapPin,
  Tag,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
} from 'lucide-react'
import { mockJobs } from '@/data/mockJobs'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import MessageModal from '@/components/modals/MessageModal'
import { useState } from 'react'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface BadgeProps {
  icon: React.ReactNode
  text: string
  variant?: 'brand' | 'default'
}

function Badge({ icon, text, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={
        variant === 'brand'
          ? 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs rounded-full'
          : 'inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-600/60 border border-white/5 text-slate-400 text-xs rounded-full'
      }
    >
      <span className="w-3 h-3 shrink-0" aria-hidden="true">{icon}</span>
      {text}
    </span>
  )
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [applyModal, setApplyModal] = useState(false)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const appliedJobs = useProfileStore((s) => s.appliedJobs)
  const bookmarkedJobs = useProfileStore((s) => s.bookmarkedJobs)
  const applyToJob = useProfileStore((s) => s.applyToJob)
  const toggleBookmark = useProfileStore((s) => s.toggleBookmark)

  const job = mockJobs.find((j) => j.id === Number(id))

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-400 mb-4">This position could not be found.</p>
        <Link to="/jobs" className="text-brand-400 hover:text-brand-300 transition-colors">
          ← Back to search
        </Link>
      </div>
    )
  }

  const isApplied = appliedJobs.some((j) => j.jobId === job.id)
  const isBookmarked = bookmarkedJobs.some((j) => j.jobId === job.id)

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    applyToJob(job.id, job.title)
    setApplyModal(true)
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleBookmark(job.id, job.title)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back
      </button>

      {/* Header card */}
      <div className="glass rounded-xl p-6 sm:p-8 mb-5 glow-brand">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-100 leading-snug">{job.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {job.departmentName} · {job.location}
            </p>
          </div>
          <button
            type="button"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this job'}
            onClick={handleBookmark}
            className="shrink-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-brand-400" aria-hidden="true" />
            ) : (
              <Bookmark className="w-5 h-5 text-slate-400 hover:text-brand-400 transition-colors" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge icon={<Briefcase />} text={job.employmentTypeName} variant="brand" />
          <Badge icon={<TrendingUp />} text={job.experienceLevelName} />
          <Badge icon={<GraduationCap />} text={job.educationLevelName} />
          <Badge icon={<Tag />} text={job.jobCategoryName} />
          <Badge icon={<MapPin />} text={job.location} />
          <Badge icon={<Calendar />} text={`Posted ${formatDate(job.datePosted)}`} />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Job Description
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">{job.description}</p>
        </div>
      </div>

      {/* Apply card */}
      <div className="glass rounded-xl p-6">
        {isApplied ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-200">Application submitted</p>
              <p className="text-xs text-slate-400 mt-0.5">
                You've already applied for this position. We'll be in touch.
              </p>
            </div>
          </div>
        ) : (
          <div className="sm:flex items-center justify-between gap-6">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm font-semibold text-slate-200">
                Interested in this role?
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAuthenticated
                  ? 'Your CV from your profile will be sent to the employer.'
                  : 'Log in to apply. Your stored CV will be sent automatically.'}
              </p>
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleApply}
                className="w-full sm:w-auto px-6 py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors shrink-0"
              >
                Apply Now
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full sm:w-auto text-center px-6 py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors"
              >
                Login to Apply
              </Link>
            )}
          </div>
        )}
      </div>

      <MessageModal
        isOpen={applyModal}
        message={`Your application for "${job.title}" has been submitted successfully. The HR team will review your CV and be in touch.`}
        onClose={() => setApplyModal(false)}
      />
    </div>
  )
}
