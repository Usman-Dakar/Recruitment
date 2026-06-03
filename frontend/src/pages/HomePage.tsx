import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Layers, ChevronDown, Briefcase, Building2,
  Users, Clock, Zap, ArrowRight, Bookmark, TrendingUp, X, Check,
  Home, Shield, Cpu, Hammer, Code2, Activity, Utensils, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { jobCategories } from '@/data/jobCategories'
import { mockJobs } from '@/data/mockJobs'
import { useAuthStore } from '@/store/authStore'
import { useProfileStore } from '@/store/profileStore'
import { useInView } from '@/hooks/useInView'
import type { Job } from '@/types'

/* ─────────────────────────────────────────
   Static data
───────────────────────────────────────── */

const JOB_META: Record<number, { company: string; salary: string }> = {
  1:  { company: 'AX Hotels',       salary: '€38–46k' },
  2:  { company: 'AX Group',        salary: '€42–55k' },
  3:  { company: 'Palazzo Capua',   salary: '€26–32k' },
  4:  { company: 'AX Group',        salary: '€30–38k' },
  5:  { company: 'AX Hotels',       salary: '€24–28k' },
  6:  { company: 'AX Group',        salary: '€36–48k' },
  7:  { company: 'Palazzo Capua',   salary: '€28–34k' },
  8:  { company: 'AX Group',        salary: '€22–25k' },
  9:  { company: 'AX Group',        salary: '€34–44k' },
  10: { company: 'AX Wellness',     salary: '€26–30k' },
  11: { company: 'AX Group',        salary: '€38–48k' },
  12: { company: 'AX Hotels',       salary: '€28–34k' },
  13: { company: 'AX Wellness',     salary: '€30–36k' },
  14: { company: 'AX Hotels',       salary: '€22–26k' },
  15: { company: 'AX Group',        salary: '€32–40k' },
  16: { company: 'AX Construction', salary: '€48–62k' },
  17: { company: 'AX Real Estate',  salary: '€26–32k' },
  18: { company: 'AX Energy',       salary: '€30–38k' },
  19: { company: 'AX Group',        salary: '€22–26k' },
  20: { company: 'AX Hotels',       salary: '€40–52k' },
  21: { company: 'AX Group',        salary: '€28–36k' },
  22: { company: 'AX Group',        salary: '€26–32k' },
  23: { company: 'AX Group',        salary: '€24–30k' },
  24: { company: 'Palazzo Capua',   salary: '€32–42k' },
  25: { company: 'AX Group',        salary: '€20–24k' },
}

const CATEGORY_ICONS: Record<number, React.ElementType> = {
  11: Briefcase, 12: TrendingUp, 13: Building2, 14: Activity,
  15: Code2,     16: Hammer,     17: Cpu,       21: Home,
  22: Zap,       27: Utensils,   28: Shield,    29: Sparkles,
}

const CATEGORY_SUBLINES: Record<number, string> = {
  11: 'Admin & ops',         12: 'Finance & strategy',     13: 'Front office, spa',
  14: 'Clinical & wellness', 15: 'Code & devops',          16: 'Site & structural',
  17: 'Software & infra',    21: 'Sales & lettings',       22: 'Solar & storage',
  27: 'Kitchen & F&B',       28: 'Officers & supervisors', 29: 'Cross-functional',
}

const CATEGORY_COUNTS: Record<number, number> = {
  11: 34, 12: 22, 13: 41, 14: 18, 15: 11, 16: 27,
  17: 19, 21: 14, 22:  9, 27: 38, 28: 12, 29:  7,
}

const EMPLOYERS = [
  'AX Hotels', 'AX Real Estate', 'AX Construction', 'AX Energy', 'AX Wellness',
  'Palazzo Capua', 'Capua Hospital', 'Verdala Suites', 'Sunny Coast', 'Seashells',
]

const HOW_STEPS = [
  { icon: Users,  num: '01', title: 'Create your profile',  desc: 'Upload CV or fill in 2 min'      },
  { icon: Search, num: '02', title: 'Browse & get matched', desc: 'AI surfaces the best roles'       },
  { icon: Zap,    num: '03', title: 'Apply with one click', desc: 'No cover letters needed'          },
]

const STATS = [
  { label: 'Open Vacancies',     value: 542,   suffix: '+', icon: Briefcase, color: 'text-brand-600 bg-brand-50 border-brand-100'        },
  { label: 'Hiring Employers',   value: 128,   suffix: '+', icon: Building2, color: 'text-cyan-700 bg-cyan-50 border-cyan-100'            },
  { label: 'Active Candidates',  value: 10400, suffix: '+', icon: Users,     color: 'text-violet-700 bg-violet-50 border-violet-100'      },
  { label: 'Avg. Time-to-Offer', value: 9,     suffix: 'd', icon: Clock,     color: 'text-emerald-700 bg-emerald-50 border-emerald-100'   },
]

/* ─────────────────────────────────────────
   Utilities
───────────────────────────────────────── */

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  if (diff < 1) return 'today'
  if (diff < 2) return 'yesterday'
  if (diff < 14) return `${Math.round(diff)}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function abbr(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('')
}

/* ─────────────────────────────────────────
   CountUp
───────────────────────────────────────── */

function CountUp({ value, suffix = '', durationMs = 1600, start }: {
  value: number; suffix?: string; durationMs?: number; start: boolean
}) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) { setN(0); return }
    let raf: number
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / durationMs)
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs, start])
  return <span>{n.toLocaleString()}{suffix}</span>
}

/* ─────────────────────────────────────────
   HeroSearch — white pill, 3 fields
───────────────────────────────────────── */

function HeroSearch({ onSubmit }: {
  onSubmit: (p: { kw: string; loc: string; catId: number | '' }) => void
}) {
  const [kw, setKw]   = useState('')
  const [loc, setLoc] = useState('')
  const [catId, setCatId] = useState<number | ''>('')

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit({ kw, loc, catId }) }}
      className="bg-white rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-lg border border-gray-200 ring-1 ring-brand-500/10"
      aria-label="Find jobs"
    >
      {/* Keyword */}
      <label className="flex-1 min-w-0 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search" value={kw} onChange={(e) => setKw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit({ kw, loc, catId })}
          placeholder="Job title or skill — e.g. Software Developer"
          className="w-full pl-10 pr-3 py-3.5 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      </label>
      <div className="hidden md:block w-px bg-gray-100" aria-hidden="true" />

      {/* Location */}
      <label className="md:w-48 relative">
        <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          value={loc} onChange={(e) => setLoc(e.target.value)}
          placeholder="Location"
          className="w-full pl-10 pr-3 py-3.5 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      </label>
      <div className="hidden md:block w-px bg-gray-100" aria-hidden="true" />

      {/* Category */}
      <label className="md:w-44 relative">
        <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        <select
          value={catId} onChange={(e) => setCatId(e.target.value ? Number(e.target.value) : '')}
          className="appearance-none w-full pl-10 pr-8 py-3.5 bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
        >
          <option value="">All categories</option>
          {jobCategories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="press inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors whitespace-nowrap shadow-sm shadow-brand-500/20"
      >
        <Search size={15} aria-hidden="true" /> Search
      </button>
    </form>
  )
}

/* ─────────────────────────────────────────
   HeroPreviewCards — floating job tiles
───────────────────────────────────────── */

function HeroPreviewCards() {
  const cards   = mockJobs.slice(0, 3)
  const rotations = [-3, 1.5, -1.2]
  const tops    = [0, 30, 56]
  const rights  = [0, 18, 8]

  return (
    <div className="relative hidden lg:block select-none shrink-0" style={{ width: 290, height: 380 }} aria-hidden="true">
      {cards.map((job, i) => {
        const meta = JOB_META[job.id] ?? { company: 'AX Group', salary: 'Competitive' }
        return (
          <div key={job.id}
            className="absolute bg-white rounded-2xl p-4 w-[266px] border border-gray-200 shadow-xl"
            style={{
              top: tops[i], right: rights[i],
              transform: `rotate(${rotations[i]}deg)`,
              zIndex: 10 - i,
              animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: `${500 + i * 160}ms`,
            }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-500/10 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                {abbr(meta.company)}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gray-400 truncate">{meta.company}</div>
                <div className="text-xs font-semibold text-gray-900 truncate leading-tight">{job.title}</div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-emerald-600">{meta.salary}</span>
              <span className="text-[10px] px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-600 rounded-full">
                {job.employmentTypeName.replace('Indefinite - ', '').replace('Definite - ', '')}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
              <MapPin size={10} /> {job.location}
              <span className="ml-auto text-gray-300">{job.jobCategoryName}</span>
            </div>
          </div>
        )
      })}

      {/* "25 new roles" badge */}
      <div
        className="absolute -bottom-6 left-2 bg-white rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg border border-gray-200"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '860ms' }}
      >
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-900">25 new roles</div>
          <div className="text-[10px] text-gray-400">added this week</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot ml-1 shrink-0" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   StatsStrip — count-up on scroll
───────────────────────────────────────── */

function StatsStrip() {
  const [ref, inView] = useInView(0.3)
  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {STATS.map(({ label, value, suffix, icon: Icon, color }, i) => (
        <div
          key={label}
          className={cn(
            'bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm transition-all duration-700',
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
          )}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn('w-9 h-9 rounded-lg border flex items-center justify-center', color)}>
              <Icon size={17} aria-hidden="true" />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot inline-block" aria-hidden="true" />
              Live
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums tracking-tight">
            <CountUp value={value} suffix={suffix} start={inView} />
          </div>
          <div className="mt-1 text-xs text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   EmployersMarquee
───────────────────────────────────────── */

function EmployersMarquee() {
  const row = [...EMPLOYERS, ...EMPLOYERS]
  return (
    <div className="fade-edges overflow-hidden">
      <div className="marquee-track inline-flex gap-10 items-center whitespace-nowrap">
        {row.map((b, i) => (
          <div key={`${b}-${i}`} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors cursor-default">
            <div className="w-6 h-6 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
              {abbr(b)}
            </div>
            <span className="font-medium text-sm tracking-tight">{b}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   HowItWorks
───────────────────────────────────────── */

function HowItWorks() {
  const [ref, inView] = useInView(0.2)
  return (
    <section ref={ref} className="border-y border-gray-200 bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-0 sm:divide-x sm:divide-gray-100">
          {HOW_STEPS.map(({ icon: Icon, num, title, desc }, i) => (
            <div
              key={num}
              className={cn(
                'flex-1 flex items-center gap-4 px-0 sm:px-8 first:pl-0 last:pr-0 transition-all duration-500',
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <div className="text-[9px] font-bold text-brand-500 tracking-widest uppercase mb-0.5">{num}</div>
                <div className="text-sm font-semibold text-gray-900 leading-tight">{title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </div>
              {i < HOW_STEPS.length - 1 && (
                <ArrowRight size={14} className="text-gray-300 hidden sm:block ml-auto" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   CategoryCard
───────────────────────────────────────── */

function CategoryCard({ cat, active, onClick }: {
  cat: { value: number; label: string }; active: boolean; onClick: () => void
}) {
  const Icon    = CATEGORY_ICONS[cat.value] ?? Sparkles
  const count   = CATEGORY_COUNTS[cat.value] ?? 0
  const subline = CATEGORY_SUBLINES[cat.value] ?? ''

  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={cn(
        'press lift relative group rounded-2xl p-4 text-left border flex flex-col gap-2.5 transition-all w-full',
        active
          ? 'bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/20'
          : 'bg-white border-gray-200 hover:border-brand-300 hover:shadow-md',
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
          active ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100',
        )}>
          <Icon size={19} aria-hidden="true" />
        </div>
        <span className={cn(
          'text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider',
          active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-brand-50 group-hover:text-brand-600',
        )}>
          {count}
        </span>
      </div>
      <div>
        <div className={cn('text-sm font-semibold leading-tight', active ? 'text-white' : 'text-gray-900')}>{cat.label}</div>
        <div className={cn('mt-0.5 text-[11px]', active ? 'text-white/70' : 'text-gray-400 group-hover:text-gray-500')}>{subline}</div>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────
   FeaturedJobCard — white card with salary
───────────────────────────────────────── */

function FeaturedJobCard({ job, saved, onSave, onApply }: {
  job: Job; saved: boolean;
  onSave: (id: number) => void;
  onApply: (job: Job) => void;
}) {
  const meta = JOB_META[job.id] ?? { company: 'AX Group', salary: 'Competitive' }

  return (
    <article className="bg-white rounded-2xl p-5 flex flex-col gap-3 border border-gray-200 hover:border-brand-300 hover:shadow-md lift transition-all">
      {/* Company + save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
            {abbr(meta.company)}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-gray-400 truncate">{meta.company}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <MapPin size={10} aria-hidden="true" /> {job.location}
            </div>
          </div>
        </div>
        <button
          type="button" onClick={() => onSave(job.id)}
          aria-label={saved ? 'Remove bookmark' : 'Save this job'}
          className={cn(
            'press shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors',
            saved
              ? 'bg-brand-50 border-brand-200 text-brand-600'
              : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300',
          )}
        >
          <Bookmark size={13} aria-hidden="true" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{job.title}</h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] px-2 py-0.5 bg-brand-50 border border-brand-100 text-brand-600 rounded-full font-medium">
          {job.employmentTypeName.replace('Indefinite - ', '').replace('Definite - ', '')}
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-full font-medium">
          {job.experienceLevelName}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
          <TrendingUp size={13} className="text-emerald-500 shrink-0" aria-hidden="true" />
          {meta.salary}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-300">{timeAgo(job.datePosted)}</span>
          <Link
            to={`/job/${job.id}`}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
          >
            View
          </Link>
          <button
            type="button" onClick={() => onApply(job)}
            className="press inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white transition-colors shadow-sm shadow-brand-500/20"
          >
            <Zap size={11} aria-hidden="true" /> Apply
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */

function Toast({ msg, onDone }: { msg: { title: string; body?: string } | null; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [msg, onDone])

  if (!msg) return null
  return (
    <div
      role="status" aria-live="polite"
      className="toast fixed bottom-5 right-5 z-[60] max-w-xs bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl border border-gray-200"
    >
      <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
        <Check size={16} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">{msg.title}</div>
        {msg.body && <div className="text-xs text-gray-500 truncate">{msg.body}</div>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */

export default function HomePage() {
  const navigate = useNavigate()

  const [activeCat, setActiveCat] = useState<number | null>(null)
  const [toast, setToast]         = useState<{ title: string; body?: string } | null>(null)
  const [showAll, setShowAll]     = useState(false)
  const jobsRef = useRef<HTMLDivElement>(null)

  const [catsRef,    catsInView]  = useInView(0.08)
  const [jobsSecRef, jobsInView]  = useInView(0.05)
  const [ctaRef,     ctaInView]   = useInView(0.2)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const bookmarkedJobs  = useProfileStore((s) => s.bookmarkedJobs)
  const toggleBookmark  = useProfileStore((s) => s.toggleBookmark)

  /* Apply light body background for this page only */
  useEffect(() => {
    const prev = document.body.style.background
    const prevColor = document.body.style.color
    document.body.style.background = '#f8fafc'
    document.body.style.color = '#111827'
    return () => {
      document.body.style.background = prev
      document.body.style.color = prevColor
    }
  }, [])

  const savedSet = useMemo(
    () => new Set(bookmarkedJobs.map((j) => j.jobId)),
    [bookmarkedJobs],
  )

  const filteredJobs = useMemo(() => {
    const base = activeCat == null ? mockJobs : mockJobs.filter((j) => j.jobCategoryId === activeCat)
    return showAll ? base : base.slice(0, 6)
  }, [activeCat, showAll])

  const totalCount = useMemo(() =>
    (activeCat == null ? mockJobs : mockJobs.filter((j) => j.jobCategoryId === activeCat)).length,
    [activeCat],
  )

  const scrollToJobs = useCallback(() => {
    setTimeout(() => {
      const el = jobsRef.current
      if (!el) return
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
    }, 60)
  }, [])

  const handleCatClick = useCallback((id: number) => {
    setActiveCat((prev) => (prev === id ? null : id))
    setShowAll(false)
    scrollToJobs()
  }, [scrollToJobs])

  const handleSearch = useCallback(({ kw, loc, catId }: { kw: string; loc: string; catId: number | '' }) => {
    if (catId) { setActiveCat(Number(catId)); setShowAll(false) }
    const parts = [
      kw && `"${kw}"`,
      loc,
      catId ? jobCategories.find((c) => c.value === Number(catId))?.label : '',
    ].filter(Boolean)
    setToast({ title: 'Searching jobs…', body: parts.length ? parts.join(' · ') : 'All open roles' })
    scrollToJobs()
  }, [scrollToJobs])

  const handleApply = useCallback((job: Job) => {
    if (!isAuthenticated) { navigate('/login'); return }
    const meta = JOB_META[job.id] ?? { company: 'AX Group', salary: 'Competitive' }
    setToast({ title: 'Application sent!', body: `${job.title} · ${meta.company}` })
  }, [isAuthenticated, navigate])

  const handleSave = useCallback((id: number) => {
    if (!isAuthenticated) { navigate('/login'); return }
    const job = mockJobs.find((j) => j.id === id)
    if (!job) return
    const wasBookmarked = bookmarkedJobs.some((j) => j.jobId === id)
    toggleBookmark(id, job.title)
    setToast({ title: wasBookmarked ? 'Removed from saved' : 'Job saved!', body: job.title })
  }, [isAuthenticated, navigate, toggleBookmark, bookmarkedJobs])

  return (
    <div className="min-h-[calc(100svh-4rem)] bg-gray-50 text-gray-900">

      {/* ── Hero ── */}
      <section className="relative hero-grid-light overflow-hidden bg-white">
        {/* Ambient glow */}
        <div
          className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-[30%] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="flex items-center justify-between gap-12">

            {/* ── Left ── */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-xs font-medium text-brand-700 mb-6 animate-fade-in-up">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" aria-hidden="true" />
                Malta's Premier Job Portal
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">25 new this week</span>
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-5 animate-fade-in-up"
                style={{ animationDelay: '80ms' }}
              >
                <span className="text-gray-900 block">Find work that</span>
                <span className="gradient-text block">moves you forward.</span>
              </h1>

              <p
                className="text-base sm:text-lg text-gray-500 mb-8 max-w-xl leading-relaxed animate-fade-in-up"
                style={{ animationDelay: '160ms' }}
              >
                Browse roles across hospitality, real estate, tech, and energy at AX Group.
                Apply in one click — no middlemen.
              </p>

              <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
                <HeroSearch onSubmit={handleSearch} />
              </div>

              {/* Trending chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs animate-fade-in-up" style={{ animationDelay: '320ms' }}>
                <span className="text-gray-400">Trending:</span>
                {['Software Developer', 'Front Office', 'Chef de Partie', 'Marketing', 'Construction'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => handleSearch({ kw: t, loc: '', catId: '' })}
                    className="press px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: floating preview cards ── */}
            <div className="animate-fade-in-up shrink-0" style={{ animationDelay: '200ms' }}>
              <HeroPreviewCards />
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-14 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* ── Employers marquee ── */}
      <section className="border-y border-gray-200 bg-gray-50 py-5 px-4 sm:px-6" aria-label="Hiring companies">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 shrink-0">Hiring now</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <EmployersMarquee />
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Categories ── */}
      <section ref={catsRef} className="pt-16 pb-10 px-4 sm:px-6 bg-gray-50" aria-labelledby="cats-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div className={cn('transition-all duration-700', catsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 mb-2">Explore</div>
              <h2 id="cats-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Browse by category</h2>
              <p className="mt-1.5 text-sm text-gray-500">Click any category to filter roles instantly.</p>
            </div>
            <Link
              to="/jobs"
              className={cn(
                'press hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-all duration-700',
                catsInView ? 'opacity-100' : 'opacity-0',
              )}
            >
              All categories <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {jobCategories.slice(0, 8).map((cat, i) => (
              <div
                key={cat.value}
                className={cn('transition-all duration-500', catsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <CategoryCard cat={cat} active={activeCat === cat.value} onClick={() => handleCatClick(cat.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs grid ── */}
      <section ref={jobsSecRef} className="pb-16 px-4 sm:px-6 bg-gray-50" aria-labelledby="jobs-heading">
        <div ref={jobsRef} className="max-w-7xl mx-auto scroll-mt-24">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div className={cn('transition-all duration-500', jobsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 mb-2">Open roles</div>
              <h2 id="jobs-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3 flex-wrap">
                {activeCat == null ? 'Latest openings' : jobCategories.find((c) => c.value === activeCat)?.label}
                {activeCat != null && (
                  <button
                    type="button"
                    onClick={() => { setActiveCat(null); setShowAll(false) }}
                    className="press inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-600 hover:bg-brand-100 animate-fade-in-up"
                  >
                    <X size={12} aria-hidden="true" /> Clear
                  </button>
                )}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{totalCount} role{totalCount !== 1 ? 's' : ''} · newest first</p>
            </div>
            <Link
              to="/jobs"
              className={cn(
                'press hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-all duration-500',
                jobsInView ? 'opacity-100' : 'opacity-0',
              )}
            >
              View all <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>

          <div key={activeCat} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job, i) => (
              <div
                key={job.id}
                style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both', animationDelay: `${Math.min(i, 6) * 55}ms` }}
              >
                <FeaturedJobCard job={job} saved={savedSet.has(job.id)} onSave={handleSave} onApply={handleApply} />
              </div>
            ))}
          </div>

          {totalCount > 6 && !showAll && (
            <div className="mt-8 text-center animate-fade-in-up">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-colors shadow-sm"
              >
                Show {totalCount - 6} more roles <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section ref={ctaRef} className="px-4 sm:px-6 pb-20 bg-gray-50">
        <div className={cn(
          'max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-8 sm:p-12 shadow-sm transition-all duration-700',
          ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        )}>
          <div
            className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 mb-3">Get matched</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Create a profile once.<br />
                <span className="gradient-text">Get matched to roles forever.</span>
              </h3>
              <p className="mt-3 text-sm text-gray-500 max-w-md">
                Upload your CV and we surface openings as soon as they're posted. One-click apply, every time.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/login#register"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20"
              >
                Create candidate profile <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <Link
                to="/jobs"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-700 text-sm font-semibold transition-colors"
              >
                Browse all openings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}
