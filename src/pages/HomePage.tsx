import { useState, useTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, ChevronDown, Bookmark, TrendingUp,
  Building2, LayoutGrid, Stethoscope, Code2, HardHat,
  Monitor, Home, Zap, ArrowRight, Sparkles,
} from 'lucide-react'
import { mockJobs } from '@/data/mockJobs'
import { useSearchStore, defaultSearchParams } from '@/store/searchStore'
import { useJobSearch } from '@/hooks/useJobSearch'

/* ── mock enrichment (salary + company not in Job type) ── */
const JOB_META: Record<number, { salary: string; company: string; companyShort: string; companyColor: string; city: string }> = {
  1:  { salary: '€38–46k', company: 'AX Hotels',      companyShort: 'AH', companyColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',   city: "St. Julian's, Malta" },
  2:  { salary: '€42–55k', company: 'AX Group',       companyShort: 'AG', companyColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',         city: 'Mosta, Malta' },
  3:  { salary: '€26–32k', company: 'Palazzo Capua',  companyShort: 'PC', companyColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300', city: 'Valletta, Malta' },
  4:  { salary: '€30–38k', company: 'AX Group',       companyShort: 'AG', companyColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',         city: 'Mosta, Malta' },
  5:  { salary: '€24–28k', company: 'AX Hotels',      companyShort: 'AH', companyColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',     city: 'Sliema, Malta' },
  6:  { salary: '€36–48k', company: 'AX Group',       companyShort: 'AG', companyColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',         city: 'Mosta, Malta' },
  7:  { salary: '€28–35k', company: 'Capua Hospital', companyShort: 'CH', companyColor: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',         city: 'Valletta, Malta' },
  8:  { salary: '€22–26k', company: 'AX Wellness',    companyShort: 'AW', companyColor: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',         city: 'St. Julian\'s, Malta' },
  9:  { salary: '€45–60k', company: 'AX Energy',      companyShort: 'AE', companyColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300', city: 'Mosta, Malta' },
  10: { salary: '€32–40k', company: 'AX Construction', companyShort: 'AC', companyColor: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',    city: 'Birkirkara, Malta' },
}
const fallbackMeta = { salary: '€25–35k', company: 'AX Group', companyShort: 'AG', companyColor: 'bg-blue-100 text-blue-700', city: 'Malta' }

const CATEGORIES = [
  { id: 11, label: 'Administrative',     sub: 'Admin & ops',        count: 34, icon: LayoutGrid   },
  { id: 12, label: 'Business & Finance', sub: 'Finance & strategy', count: 22, icon: TrendingUp   },
  { id: 13, label: 'Hotels',             sub: 'Front office, spa',  count: 41, icon: Building2    },
  { id: 14, label: 'Healthcare',         sub: 'Clinical & wellness',count: 18, icon: Stethoscope  },
  { id: 15, label: 'Development',        sub: 'Code & devops',      count: 11, icon: Code2        },
  { id: 16, label: 'Construction',       sub: 'Site & structural',  count: 27, icon: HardHat      },
  { id: 17, label: 'Information Tech',   sub: 'Software & infra',   count: 19, icon: Monitor      },
  { id: 21, label: 'Real Estate',        sub: 'Sales & lettings',   count: 14, icon: Home         },
]

const STATS = [
  { value: '542+', label: 'Open Vacancies' },
  { value: '128+', label: 'Hiring Employers' },
  { value: '10,400+', label: 'Active Candidates' },
  { value: '9d', label: 'Avg. Time-to-Offer' },
]

const COMPANIES = ['AX Hotels', 'AX Real Estate', 'AX Construction', 'AX Energy', 'AX Wellness', 'Palazzo Capua', 'Capua Hospital', 'Verdala Suites']

const TRENDING = ['Software Developer', 'Front Office', 'Chef de Partie', 'Marketing', 'Construction']

function daysSince(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  return `${diff}d ago`
}

function employmentShort(name: string) {
  if (name.toLowerCase().includes('full')) return 'Full Time'
  if (name.toLowerCase().includes('part')) return 'Part Time'
  if (name.toLowerCase().includes('contract')) return 'Contract'
  return name
}

/* ── Job card (used in Latest Openings) ── */
function JobCard({ job }: { job: typeof mockJobs[0] }) {
  const meta = JOB_META[job.id] ?? fallbackMeta
  const navigate = useNavigate()
  return (
    <div className="bg-white dark:bg-surface-800 border border-slate-100 dark:border-white/8 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/20 transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${meta.companyColor}`}>
            {meta.companyShort}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{meta.company}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <MapPin size={10} /> {meta.city}
            </p>
          </div>
        </div>
        <button type="button" className="text-slate-300 dark:text-slate-600 hover:text-brand-500 transition-colors shrink-0">
          <Bookmark size={16} />
        </button>
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[11px] font-semibold border border-brand-100 dark:border-brand-500/20">
          {employmentShort(job.employmentTypeName)}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400 text-[11px] font-medium">
          {job.experienceLevelName}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={13} />
          {meta.salary}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">{daysSince(job.datePosted)}</span>
          <button
            type="button"
            onClick={() => navigate(`/jobs/${job.jobCategoryId}`)}
            className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => navigate(`/jobs/${job.jobCategoryId}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-semibold transition-colors"
          >
            <Zap size={10} /> Apply
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Floating hero job card ── */
function HeroJobCard() {
  const previewJobs = [
    { city: 'St. Julian\'s, Malta', cat: 'Hotels',           meta: JOB_META[1],  title: 'Front Office Manager' },
    { city: 'Mosta, Malta',         cat: 'Information Tech', meta: JOB_META[2],  title: 'Software Developer (.NET)' },
    { city: 'Valletta, Malta',      cat: 'Hospitality',      meta: JOB_META[3],  title: 'Restaurant Supervisor' },
  ]
  const main = previewJobs[0]
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl w-80 overflow-hidden">
      {/* Main job */}
      <div className="p-5 border-b border-slate-100 dark:border-white/8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${main.meta.companyColor}`}>
            {main.meta.companyShort}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{main.meta.company}</p>
            <p className="text-[11px] text-slate-400">{main.city}</p>
          </div>
        </div>
        <p className="font-bold text-slate-900 dark:text-slate-100 text-base mb-3">{main.title}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold">Full Time</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400 text-xs font-medium">Manager</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
            <TrendingUp size={12} className="opacity-70" />{main.meta.salary}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1"><MapPin size={10}/>{main.city} <span className="ml-auto">· {main.cat}</span></p>
      </div>
      {/* Other jobs list */}
      {previewJobs.slice(1).map((j) => (
        <div key={j.title} className="px-5 py-3 flex items-center justify-between border-b border-slate-50 dark:border-white/5 last:border-0">
          <div className="flex items-center gap-2">
            <MapPin size={11} className="text-slate-300 dark:text-slate-600 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400">{j.city}</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">{j.cat}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate()
  const { setParams } = useSearchStore()
  const { search } = useJobSearch()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [category] = useState('All categories')
  const [isPending, startTransition] = useTransition()

  const handleSearch = () => {
    const p = { ...defaultSearchParams, freeText: keyword, pageNo: 1 }
    setParams(p)
    startTransition(async () => {
      await search(p)
      navigate('/jobs')
    })
  }

  const latestJobs = mockJobs.slice(0, 6)

  return (
    <div className="bg-white dark:bg-surface-950 min-h-screen">

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden pt-20 pb-0 px-4 sm:px-6">
        {/* Light mode: lavender gradient */}
        <div className="dark:hidden absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 40%, #eff6ff 80%, #ffffff 100%)'
        }} />
        {/* Dark mode: subtle purple glow + grid texture */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none hero-grid opacity-60" />
        <div className="hidden dark:block absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(109,40,217,0.06) 45%, transparent 100%)'
        }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[560px] py-16">

            {/* Left */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-full text-sm font-medium text-slate-600 dark:text-brand-300 mb-7 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shrink-0" />
                Malta's Premier Job Portal
                <span className="h-3.5 w-px bg-slate-200 dark:bg-brand-500/40 mx-1" />
                25 new this week
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                <span className="text-slate-900 dark:text-white">Find work that</span>
                <br />
                <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  moves you forward.
                </span>
              </h1>

              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                Browse roles across hospitality, real estate, tech, and energy at AX Group. Apply in one click — no middlemen.
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-0 bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-sm mb-5">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Job title or skill — e.g. Software Developer"
                    className="flex-1 text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-0 py-2.5"
                  />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 border-l border-slate-100 dark:border-white/8">
                  <MapPin size={15} className="text-slate-400 shrink-0" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="text-sm bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none w-24 py-2.5"
                  />
                </div>
                <div className="hidden sm:flex items-center gap-1 px-4 border-l border-slate-100 dark:border-white/8 cursor-pointer">
                  <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap py-2.5">{category}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 shrink-0"
                >
                  <Search size={15} />
                  {isPending ? 'Searching…' : 'Search'}
                </button>
              </div>

              {/* Trending */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">Trending:</span>
                {TRENDING.map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => { setKeyword(t); handleSearch() }}
                    className="px-3 py-1.5 rounded-full bg-white dark:bg-white/8 border border-slate-200 dark:border-white/10 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-sm"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hidden lg:flex items-center justify-end relative pr-8">
              <div className="relative">
                <HeroJobCard />
                {/* "25 new roles" badge */}
                <div className="absolute -bottom-6 -left-10 bg-white dark:bg-surface-800 border border-slate-100 dark:border-white/10 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">25 new roles</p>
                    <p className="text-xs text-slate-400">added this week</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-1 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative max-w-7xl mx-auto border-t border-slate-100 dark:border-white/8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HIRING NOW ══ */}
      <section className="border-y border-slate-100 dark:border-white/8 py-4 overflow-hidden bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 shrink-0">Hiring Now</span>
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1">
            {COMPANIES.map((c) => (
              <span key={c} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors whitespace-nowrap shrink-0">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { n: '01', icon: <Sparkles size={14} />, title: 'Create your profile', sub: 'Upload CV or fill in 2 min' },
            { n: '02', icon: <Search size={14} />, title: 'Browse & get matched', sub: 'AI surfaces the best roles' },
            { n: '03', icon: <Zap size={14} />, title: 'Apply with one click', sub: 'No cover letters needed' },
          ].map((step) => (
            <div key={step.n} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500/10 dark:bg-brand-500/15 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-500 dark:text-brand-400 mb-0.5">{step.n}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{step.title}</p>
                <p className="text-xs text-slate-400">{step.sub}</p>
              </div>
              <ArrowRight size={14} className="text-slate-200 dark:text-white/15 shrink-0 hidden sm:block last:hidden" />
            </div>
          ))}
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="py-10 px-4 sm:px-6 bg-slate-50/70 dark:bg-white/[0.015] border-y border-slate-100 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 mb-1">Explore</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by category</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Click any category to filter roles instantly.</p>
            </div>
            <Link to="/jobs" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              All categories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(({ id, label, sub, count, icon: Icon }) => (
              <button
                key={id} type="button"
                onClick={() => navigate(`/jobs/${id}`)}
                className="bg-white dark:bg-surface-800 border border-slate-100 dark:border-white/8 rounded-2xl p-5 text-left hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-100 dark:group-hover:bg-brand-500/20 transition-colors">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{count}</span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-0.5">{label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LATEST OPENINGS ══ */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 mb-1">Open Roles</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest openings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{mockJobs.length} roles · newest first</p>
            </div>
            <Link to="/jobs" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {mockJobs.length > 6 && (
            <div className="text-center mt-8">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Show {mockJobs.length - 6} more roles <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-50 dark:bg-surface-800 border border-slate-100 dark:border-white/8 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 mb-2">Get Matched</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                Create a profile once.<br />
                <span className="text-brand-600 dark:text-brand-400">Get matched to roles forever.</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload your CV and we surface openings as soon as they're posted. One-click apply, every time.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <Link
                to="/login#register"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Create candidate profile <ArrowRight size={15} />
              </Link>
              <Link
                to="/jobs"
                className="flex items-center justify-center gap-2 px-8 py-3.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium rounded-xl transition-colors text-sm"
              >
                Browse all openings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-slate-100 dark:border-white/8 bg-white dark:bg-surface-950 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <Building2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">AX Jobs</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              AX Group is one of Malta's leading employers — careers across hospitality, real estate, construction, and technology.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {['Browse Jobs', 'Career Information', 'About AX Group', 'Contact Us', 'My Profile'].map((l) => (
                <li key={l}>
                  <Link to={l === 'Browse Jobs' ? '/jobs' : l === 'My Profile' ? '/profile' : l === 'Contact Us' ? '/contact' : l === 'About AX Group' ? '/about' : '/information'}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-4">Contact</p>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand-400" />
                AX Business Centre, Triq Id-Difesa Civili, Mosta MST 1741, Malta
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-400 text-xs">📞</span>
                +356 2331 2345
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-400 text-xs">✉</span>
                info@axgroup.mt
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-white/8 pt-6 flex items-center justify-between text-xs text-slate-400">
          <span>© 2026 AX Group. All rights reserved.</span>
          <span>axgroup.mt</span>
        </div>
      </footer>
    </div>
  )
}
