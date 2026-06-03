import { useState, useEffect, useRef, useMemo, useCallback, useTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, ChevronDown, Bookmark, TrendingUp,
  Building2, LayoutGrid, Stethoscope, Code2, HardHat,
  Monitor, Home, Zap, ArrowRight, Sparkles, Layers,
  Users, Clock, Briefcase, Check, Phone, Mail, X,
  Sun, Cpu, Hammer, UtensilsCrossed,
} from 'lucide-react'
import { mockJobs } from '@/data/mockJobs'
import { useSearchStore, defaultSearchParams } from '@/store/searchStore'
import { useJobSearch } from '@/hooks/useJobSearch'

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

/* ── Count-up ── */
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
      const ease = 1 - Math.pow(1 - k, 3)
      setN(Math.round(value * ease))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs, start])
  return <span>{n.toLocaleString()}{suffix}</span>
}

/* ── Stats strip ── */
const STATS = [
  { value: 542,   suffix: '+', label: 'Open Vacancies',     Icon: Briefcase, color: 'text-brand-600 bg-brand-50 border-brand-100'         },
  { value: 128,   suffix: '+', label: 'Hiring Employers',   Icon: Building2, color: 'text-cyan-700 bg-cyan-50 border-cyan-100'             },
  { value: 10400, suffix: '+', label: 'Active Candidates',  Icon: Users,     color: 'text-violet-700 bg-violet-50 border-violet-100'       },
  { value: 9,     suffix: 'd', label: 'Avg. Time-to-Offer', Icon: Clock,     color: 'text-emerald-700 bg-emerald-50 border-emerald-100'    },
]

function StatsStrip() {
  const [ref, inView] = useInView(0.3)
  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {STATS.map(({ value, suffix, label, Icon, color }, i) => (
        <div key={label}
          className={'bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-6 border border-gray-100 dark:border-white/8 shadow-sm transition-all duration-700 '
            + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}
          style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${color}`}>
              <Icon size={17} />
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot inline-block" />
              Live
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
            <CountUp value={value} suffix={suffix} start={inView} />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">{label}</div>
        </div>
      ))}
    </div>
  )
}

/* ── Hero search ── */
const CATEGORIES_LIST = [
  { value: 11, label: 'Administrative' },
  { value: 12, label: 'Business & Finance' },
  { value: 13, label: 'Hotels' },
  { value: 14, label: 'Healthcare' },
  { value: 15, label: 'Development' },
  { value: 16, label: 'Construction' },
  { value: 17, label: 'Information Tech' },
  { value: 21, label: 'Real Estate' },
]

function HeroSearch({ onSubmit }: { onSubmit: (v: { kw: string; loc: string; cat: string }) => void }) {
  const [kw, setKw] = useState('')
  const [loc, setLoc] = useState('')
  const [cat, setCat] = useState('')
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ kw, loc, cat }) }}
      className="bg-white dark:bg-surface-800 rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-lg border border-gray-200 dark:border-white/10 ring-1 ring-brand-500/10"
      aria-label="Find jobs">
      <label className="flex-1 min-w-0 relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input value={kw} onChange={(e) => setKw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit({ kw, loc, cat })}
          placeholder="Job title or skill — e.g. Software Developer"
          className="w-full pl-10 pr-3 py-3.5 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none" />
      </label>
      <div className="hidden md:block w-px bg-gray-100 dark:bg-white/8" />
      <label className="md:w-44 relative">
        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location"
          className="w-full pl-10 pr-3 py-3.5 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none" />
      </label>
      <div className="hidden md:block w-px bg-gray-100 dark:bg-white/8" />
      <label className="md:w-44 relative">
        <Layers size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          className="appearance-none w-full pl-10 pr-8 py-3.5 bg-transparent text-sm text-gray-900 dark:text-slate-100 focus:outline-none cursor-pointer">
          <option value="">All categories</option>
          {CATEGORIES_LIST.map((c) => <option key={c.value} value={String(c.value)}>{c.label}</option>)}
        </select>
      </label>
      <button type="submit"
        className="press inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors whitespace-nowrap shadow-sm shadow-brand-500/20">
        <Search size={15} /> Search
      </button>
    </form>
  )
}

/* ── Hero preview cards ── */
function HeroPreviewCards() {
  const cards = mockJobs.slice(0, 3)
  const rotations = [-3, 1.5, -1.2]
  const tops      = [0, 28, 52]
  const rights    = [0, 16, 6]
  return (
    <div className="relative hidden lg:block select-none shrink-0" style={{ width: 290, height: 370 }}>
      {cards.map((job, i) => {
        const initials = (job.company ?? '').split(' ').map((w) => w[0]).slice(0, 2).join('')
        return (
          <div key={job.id}
            className="absolute bg-white dark:bg-surface-800 rounded-2xl p-4 w-[266px] border border-gray-200 dark:border-white/10 shadow-xl"
            style={{
              top: tops[i], right: rights[i],
              transform: `rotate(${rotations[i]}deg)`,
              zIndex: 10 - i,
              animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: `${500 + i * 160}ms`,
            }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gray-400 truncate">{job.company}</div>
                <div className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate leading-tight">{job.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full font-medium">
                {job.employmentTypeName.includes('Full') ? 'Full Time' : job.employmentTypeName.split(' ')[0]}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 rounded-full">
                {job.experienceLevelName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp size={11} className="opacity-70" />{job.salary ?? '€28–40k'}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500">
              <MapPin size={10} /> {job.location}
              <span className="ml-auto text-gray-300 dark:text-slate-600">{job.jobCategoryName}</span>
            </div>
          </div>
        )
      })}
      {/* 25 new roles badge */}
      <div className="absolute -bottom-8 left-2 bg-white dark:bg-surface-800 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg border border-gray-200 dark:border-white/10"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '860ms' }}>
        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-900 dark:text-slate-100">25 new roles</div>
          <div className="text-[10px] text-gray-400 dark:text-slate-500">added this week</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot ml-1 shrink-0" />
      </div>
    </div>
  )
}

/* ── Employers marquee ── */
const EMPLOYERS = [
  'AX Hotels', 'AX Real Estate', 'AX Construction', 'AX Energy', 'AX Wellness',
  'Palazzo Capua', 'Capua Hospital', 'Verdala Suites', 'Sunny Coast', 'Seashells',
]

function EmployersMarquee() {
  const row = [...EMPLOYERS, ...EMPLOYERS]
  return (
    <div className="fade-edges overflow-hidden">
      <div className="marquee-track inline-flex gap-10 items-center whitespace-nowrap">
        {row.map((b, i) => (
          <div key={`${b}-${i}`} className="flex items-center gap-2 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors cursor-default">
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-slate-400">
              {b.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </div>
            <span className="font-medium text-sm tracking-tight">{b}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── How It Works ── */
function HowItWorks() {
  const [ref, inView] = useInView(0.2)
  const steps = [
    { Icon: Users,  num: '01', title: 'Create your profile',  desc: 'Upload CV or fill in 2 min'  },
    { Icon: Search, num: '02', title: 'Browse & get matched', desc: 'AI surfaces the best roles'  },
    { Icon: Zap,    num: '03', title: 'Apply with one click', desc: 'No cover letters needed'      },
  ]
  return (
    <section ref={ref} className="border-y border-gray-200 dark:border-white/8 bg-white dark:bg-surface-900 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-0 sm:divide-x sm:divide-gray-100 dark:sm:divide-white/8">
          {steps.map(({ Icon, num, title, desc }, i) => (
            <div key={num}
              className={'flex-1 flex items-center gap-4 px-0 sm:px-8 first:pl-0 last:pr-0 transition-all duration-500 '
                + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
              style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Icon size={20} />
              </div>
              <div>
                <div className="text-[9px] font-bold text-brand-500 tracking-widest uppercase mb-0.5">{num}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight">{title}</div>
                <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{desc}</div>
              </div>
              {i < steps.length - 1 && <ArrowRight size={14} className="text-gray-200 dark:text-white/15 hidden sm:block ml-auto shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Categories ── */
const CATEGORIES = [
  { id: 11, label: 'Administrative',     sub: 'Admin & ops',         Icon: LayoutGrid,     count: 34 },
  { id: 12, label: 'Business & Finance', sub: 'Finance & strategy',  Icon: TrendingUp,     count: 22 },
  { id: 13, label: 'Hotels',             sub: 'Front office, spa',   Icon: Building2,      count: 41 },
  { id: 14, label: 'Healthcare',         sub: 'Clinical & wellness', Icon: Stethoscope,    count: 18 },
  { id: 15, label: 'Development',        sub: 'Code & devops',       Icon: Code2,          count: 11 },
  { id: 16, label: 'Construction',       sub: 'Site & structural',   Icon: HardHat,        count: 27 },
  { id: 17, label: 'Information Tech',   sub: 'Software & infra',    Icon: Monitor,        count: 19 },
  { id: 21, label: 'Real Estate',        sub: 'Sales & lettings',    Icon: Home,           count: 14 },
]

function CategoryCard({ cat, active, onClick }: {
  cat: typeof CATEGORIES[0]; active: boolean; onClick: (id: number) => void
}) {
  const { Icon } = cat
  return (
    <button type="button" onClick={() => onClick(cat.id)} aria-pressed={active}
      className={
        'press lift relative group rounded-2xl p-4 text-left border flex flex-col gap-2.5 transition-all w-full '
        + (active
          ? 'bg-brand-500 border-brand-500 shadow-lg shadow-brand-500/20'
          : 'bg-white dark:bg-surface-800 border-gray-200 dark:border-white/8 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md')
      }>
      <div className="flex items-start justify-between">
        <div className={
          'w-10 h-10 rounded-xl flex items-center justify-center transition-colors '
          + (active ? 'bg-white/20 text-white' : 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20')
        }>
          <Icon size={19} />
        </div>
        <span className={
          'text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider '
          + (active ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600')
        }>
          {cat.count}
        </span>
      </div>
      <div>
        <div className={'text-sm font-semibold leading-tight ' + (active ? 'text-white' : 'text-gray-900 dark:text-slate-100')}>{cat.label}</div>
        <div className={'mt-0.5 text-[11px] ' + (active ? 'text-white/70' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-500')}>{cat.sub}</div>
      </div>
    </button>
  )
}

/* ── Time ago ── */
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 86400000
  if (diff < 1) return 'today'
  if (diff < 2) return '1d ago'
  if (diff < 14) return `${Math.round(diff)}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/* ── Job card ── */
function JobCard({ job, saved, onApply, onSave }: {
  job: typeof mockJobs[0]
  saved: boolean
  onApply: (job: typeof mockJobs[0]) => void
  onSave: (id: number) => void
}) {
  const navigate = useNavigate()
  const initials = (job.company ?? '').split(' ').map((w) => w[0]).slice(0, 2).join('')
  const typeShort = job.employmentTypeName.includes('Full') ? 'Full Time'
    : job.employmentTypeName.includes('Part') ? 'Part Time'
    : job.employmentTypeName.split(' ')[0]

  return (
    <article className="bg-white dark:bg-surface-800 rounded-2xl p-5 flex flex-col gap-3 border border-gray-200 dark:border-white/8 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md lift transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xs">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{job.company}</div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500">
              <MapPin size={10} />{job.location}
            </div>
          </div>
        </div>
        <button type="button" onClick={() => onSave(job.id)} aria-label={saved ? 'Unsave' : 'Save'}
          className={
            'press shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors '
            + (saved
              ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30 text-brand-600 dark:text-brand-400'
              : 'border-gray-200 dark:border-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-white/20')
          }>
          <Bookmark size={13} />
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2">{job.title}</h3>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] px-2 py-0.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full font-medium">{typeShort}</span>
        <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 rounded-full font-medium">{job.experienceLevelName}</span>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
          <TrendingUp size={13} className="text-emerald-500 shrink-0" />
          {job.salary ?? '€28–40k'}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-300 dark:text-slate-600">{timeAgo(job.datePosted)}</span>
          <button type="button" onClick={() => navigate(`/job/${job.id}`)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:border-gray-300 transition-colors">
            View
          </button>
          <button type="button" onClick={() => onApply(job)}
            className="press inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white transition-colors shadow-sm shadow-brand-500/20">
            <Zap size={11} /> Apply
          </button>
        </div>
      </div>
    </article>
  )
}

/* ── Toast ── */
function Toast({ msg, onDone }: { msg: { title: string; body?: string } | null; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [msg, onDone])
  if (!msg) return null
  return (
    <div role="status" aria-live="polite"
      className="fixed bottom-5 right-5 z-[60] max-w-xs bg-white dark:bg-surface-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl border border-gray-200 dark:border-white/10 animate-fade-in-up">
      <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
        <Check size={16} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{msg.title}</div>
        {msg.body && <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{msg.body}</div>}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
const TRENDING = ['Software Developer', 'Front Office', 'Chef de Partie', 'Marketing', 'Construction']

export default function HomePage() {
  const navigate = useNavigate()
  const { setParams } = useSearchStore()
  const { search } = useJobSearch()
  const [, startTransition] = useTransition()

  const [activeCat, setActiveCat] = useState<number | null>(null)
  const [saved, setSaved]         = useState<Set<number>>(new Set())
  const [toast, setToast]         = useState<{ title: string; body?: string } | null>(null)
  const [showAll, setShowAll]     = useState(false)
  const [mounted, setMounted]     = useState(false)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const jobsRef = useRef<HTMLDivElement>(null)
  const [catsRef, catsInView]     = useInView(0.08)
  const [jobsSecRef, jobsInView]  = useInView(0.05)
  const [ctaRef, ctaInView]       = useInView(0.2)
  const [aboutRef, aboutInView]   = useInView(0.15)

  const filteredJobs = useMemo(() => {
    const base = activeCat == null ? mockJobs : mockJobs.filter((j) => j.jobCategoryId === activeCat)
    return showAll ? base : base.slice(0, 6)
  }, [activeCat, showAll])

  const totalCount = useMemo(() =>
    (activeCat == null ? mockJobs : mockJobs.filter((j) => j.jobCategoryId === activeCat)).length,
    [activeCat]
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

  const handleSearch = useCallback(({ kw, loc, cat }: { kw: string; loc: string; cat: string }) => {
    const p = { ...defaultSearchParams, freeText: kw, pageNo: 1 }
    setParams(p)
    if (cat) { setActiveCat(Number(cat)); setShowAll(false) }
    setToast({ title: 'Searching jobs…', body: [kw, loc].filter(Boolean).join(' · ') || 'All open roles' })
    startTransition(async () => {
      await search(p)
      navigate('/jobs')
    })
  }, [setParams, search, navigate, startTransition])

  const onApply = useCallback((job: typeof mockJobs[0]) => {
    setToast({ title: 'Application sent!', body: `${job.title} · ${job.company}` })
  }, [])

  const onSave = useCallback((id: number) => {
    setSaved((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }, [])

  const onContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setToast({ title: 'Message sent!', body: "We'll get back to you within one business day." })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-surface-950">

      {/* ══ HERO ══ */}
      <section className="relative hero-grid overflow-hidden bg-white dark:bg-surface-950">
        {/* Ambient glows — light mode */}
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 65%)' }} />
        <div className="absolute top-[30%] right-[-150px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
        {/* Dark mode gradient overlay */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(109,40,217,0.05) 45%, transparent 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="flex items-center justify-between gap-12">

            {/* Left */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <div className={'inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-6 transition-all duration-700 '
                + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" />
                Malta's Premier Job Portal
                <span className="text-gray-300 dark:text-white/20">·</span>
                <span className="text-gray-500 dark:text-slate-400">25 new this week</span>
              </div>

              <h1 className={'text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-5 transition-all duration-700 '
                + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '80ms' }}>
                <span className="text-gray-900 dark:text-white block">Find work that</span>
                <span className="gradient-text block">moves you forward.</span>
              </h1>

              <p className={'text-base sm:text-lg text-gray-500 dark:text-slate-400 mb-8 max-w-xl leading-relaxed transition-all duration-700 '
                + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '160ms' }}>
                Browse roles across hospitality, real estate, tech, and energy at AX Group. Apply in one click — no middlemen.
              </p>

              <div className={'transition-all duration-700 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '240ms' }}>
                <HeroSearch onSubmit={handleSearch} />
              </div>

              <div className={'mt-5 flex flex-wrap items-center gap-2 text-xs transition-all duration-700 '
                + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
                style={{ transitionDelay: '320ms' }}>
                <span className="text-gray-400 dark:text-slate-500">Trending:</span>
                {TRENDING.map((t) => (
                  <button key={t} type="button"
                    onClick={() => handleSearch({ kw: t, loc: '', cat: '' })}
                    className="press px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/8 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: floating cards */}
            <div className={'shrink-0 transition-all duration-700 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
              style={{ transitionDelay: '200ms' }}>
              <HeroPreviewCards />
            </div>
          </div>

          {/* Stats */}
          <div className={'mt-14 transition-all duration-700 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
            style={{ transitionDelay: '400ms' }}>
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* ══ EMPLOYERS MARQUEE ══ */}
      <section className="border-y border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/[0.02] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 shrink-0">Hiring now</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/8" />
          </div>
          <EmployersMarquee />
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <HowItWorks />

      {/* ══ CATEGORIES ══ */}
      <section ref={catsRef} className="pt-16 pb-10 px-4 sm:px-6 bg-gray-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div className={'transition-all duration-700 ' + (catsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Explore</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Browse by category</h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">Click any category to filter roles instantly.</p>
            </div>
            <Link to="/jobs"
              className={'press hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-all duration-700 '
                + (catsInView ? 'opacity-100' : 'opacity-0')}>
              All categories <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id}
                className={'transition-all duration-500 ' + (catsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
                style={{ transitionDelay: `${i * 60}ms` }}>
                <CategoryCard cat={cat} active={activeCat === cat.id} onClick={handleCatClick} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOBS GRID ══ */}
      <section id="jobs" ref={jobsSecRef} className="pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-surface-950">
        <div ref={jobsRef} className="max-w-7xl mx-auto scroll-mt-24">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div className={'transition-all duration-500 ' + (jobsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Open roles</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3 flex-wrap">
                {activeCat == null ? 'Latest openings' : CATEGORIES.find((c) => c.id === activeCat)?.label}
                {activeCat != null && (
                  <button type="button" onClick={() => { setActiveCat(null); setShowAll(false) }}
                    className="press inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 animate-fade-in-up">
                    <X size={12} /> Clear
                  </button>
                )}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{totalCount} role{totalCount !== 1 ? 's' : ''} · newest first</p>
            </div>
            <Link to="/jobs"
              className={'press hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-surface-800 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-500 '
                + (jobsInView ? 'opacity-100' : 'opacity-0')}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div key={activeCat} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job, i) => (
              <div key={job.id}
                style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both', animationDelay: `${Math.min(i, 6) * 55}ms` }}>
                <JobCard job={job} saved={saved.has(job.id)} onApply={onApply} onSave={onSave} />
              </div>
            ))}
          </div>

          {totalCount > 6 && !showAll && (
            <div className="mt-8 text-center animate-fade-in-up">
              <button type="button" onClick={() => setShowAll(true)}
                className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-800 text-sm font-medium text-gray-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-500/30 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 transition-colors shadow-sm">
                Show {totalCount - 6} more roles <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section ref={ctaRef} className="px-4 sm:px-6 pb-20 bg-gray-50 dark:bg-surface-950">
        <div className={
          'max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-brand-200 dark:border-brand-500/20 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-500/10 dark:via-surface-800 dark:to-surface-800 p-8 sm:p-12 shadow-sm transition-all duration-700 '
          + (ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)' }} />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Get matched</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Create a profile once.<br />
                <span className="gradient-text">Get matched to roles forever.</span>
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-slate-400 max-w-md">
                Upload your CV and we surface openings as soon as they're posted. One-click apply, every time.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/login#register"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
                Create candidate profile <ArrowRight size={14} />
              </Link>
              <Link to="/jobs"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-800 hover:border-gray-300 text-gray-700 dark:text-slate-300 text-sm font-semibold transition-colors">
                Browse all openings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT US ══ */}
      <section id="about" ref={aboutRef} className="px-4 sm:px-6 py-14 bg-white dark:bg-surface-900 border-t border-gray-200 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className={
            'grid lg:grid-cols-2 gap-10 items-center transition-all duration-700 '
            + (aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Who we are</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                Built in Malta.<br />
                <span className="gradient-text">Grown over 50 years.</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                AX Group is one of Malta's most respected and diversified business groups — spanning hospitality, construction, real estate, technology, and renewable energy. Over 2,000 people call us their employer.
              </p>
              <Link to="/about"
                className="press inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
                Learn more about AX Group <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { Icon: Building2,       name: 'AX Hotels',       color: 'text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20'       },
                { Icon: Hammer,          name: 'AX Construction', color: 'text-brand-700 bg-brand-50 border-brand-100 dark:text-brand-400 dark:bg-brand-500/10 dark:border-brand-500/20'       },
                { Icon: Home,            name: 'AX Real Estate',  color: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
                { Icon: Cpu,             name: 'AX Tech',         color: 'text-cyan-700 bg-cyan-50 border-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20'              },
                { Icon: UtensilsCrossed, name: 'AX Hospitality',  color: 'text-rose-700 bg-rose-50 border-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20'             },
                { Icon: Sun,             name: 'AX Energy',       color: 'text-yellow-700 bg-yellow-50 border-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20'  },
              ].map(({ Icon, name, color }) => (
                <div key={name} className={`lift flex flex-col items-center gap-2 p-4 rounded-2xl border text-center cursor-pointer ${color}`}>
                  <Icon size={20} />
                  <span className="text-xs font-semibold leading-tight">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="px-4 sm:px-6 py-14 bg-gray-50 dark:bg-surface-950 border-t border-gray-200 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Info */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Get in touch</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Contact us</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                Have a question about a role, or want to talk to our recruitment team? We respond to every message within one business day.
              </p>
              <div className="space-y-4">
                {[
                  { Icon: MapPin, label: 'Address', val: 'AX Business Centre, Triq Id-Difesa Civili,\nMosta MST 1741, Malta', href: undefined },
                  { Icon: Phone,  label: 'Phone',   val: '+356 2331 2345', href: 'tel:+35623312345' },
                  { Icon: Mail,   label: 'Email',   val: 'careers@axgroup.mt', href: 'mailto:careers@axgroup.mt' },
                ].map(({ Icon, label, val, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 dark:text-slate-300">{label}</div>
                      {href
                        ? <a href={href} className="text-xs text-brand-600 dark:text-brand-400 hover:underline mt-0.5 block">{val}</a>
                        : <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 whitespace-pre-line">{val}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onContactSubmit}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-white/8 shadow-sm p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">First name</label>
                  <input required type="text" placeholder="Jane"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Last name</label>
                  <input required type="text" placeholder="Doe"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Email</label>
                <input required type="email" placeholder="jane@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Message</label>
                <textarea required rows={4} placeholder="Your question or message…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition-colors resize-none" />
              </div>
              <button type="submit"
                className="press w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
                Send message <ArrowRight size={13} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-gray-50 dark:bg-surface-950 border-t border-gray-200 dark:border-white/8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="gradient-text tracking-tight">AX Jobs</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-xs">
                AX Group is one of Malta's leading employers — careers across hospitality, real estate, construction, and technology.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { to: '/jobs', label: 'Browse Jobs' },
                  { to: '/information', label: 'Career Information' },
                  { to: '/about', label: 'About AX Group' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/profile', label: 'My Profile' },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">Contact</h3>
              <address className="not-italic space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                  <MapPin size={15} className="mt-0.5 text-brand-500 shrink-0" />
                  <span>AX Business Centre, Triq Id-Difesa Civili,<br />Mosta MST 1741, Malta</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                  <Phone size={15} className="text-brand-500 shrink-0" />
                  <a href="tel:+35623312345" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">+356 2331 2345</a>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                  <Mail size={15} className="text-brand-500 shrink-0" />
                  <a href="mailto:info@axgroup.mt" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">info@axgroup.mt</a>
                </div>
              </address>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400 dark:text-slate-500">© {new Date().getFullYear()} AX Group. All rights reserved.</p>
            <p className="text-xs text-gray-300 dark:text-slate-600">axgroup.mt</p>
          </div>
        </div>
      </footer>

      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  )
}
