import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Filter, X, ChevronDown, ChevronUp, ChevronLeft,
  Bookmark, Send, Check, Share2, Clock, Users, Briefcase, Star,
  ArrowUpDown, Bell, ExternalLink, Layers,
} from 'lucide-react'
import { mockJobs } from '@/data/mockJobs'
import type { Job } from '@/types'

/* ── Category colour + initials maps ── */
const CAT_COLOR: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'Hotels':                 { bg: 'bg-brand-50 dark:bg-brand-500/10',   border: 'border-brand-200 dark:border-brand-500/30',   text: 'text-brand-600 dark:text-brand-400',   dot: 'bg-brand-500' },
  'Information Technology': { bg: 'bg-cyan-50 dark:bg-cyan-500/10',     border: 'border-cyan-200 dark:border-cyan-500/30',     text: 'text-cyan-700 dark:text-cyan-400',     dot: 'bg-cyan-500' },
  'Hospitality':            { bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/30',   text: 'text-amber-700 dark:text-amber-400',   dot: 'bg-amber-500' },
  'Administrative':         { bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/30', text: 'text-violet-700 dark:text-violet-400', dot: 'bg-violet-500' },
  'Business and Finance':   { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  'Construction':           { bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
  'Healthcare':             { bg: 'bg-rose-50 dark:bg-rose-500/10',     border: 'border-rose-200 dark:border-rose-500/30',     text: 'text-rose-600 dark:text-rose-400',     dot: 'bg-rose-500' },
  'Real Estate':            { bg: 'bg-teal-50 dark:bg-teal-500/10',     border: 'border-teal-200 dark:border-teal-500/30',     text: 'text-teal-700 dark:text-teal-400',     dot: 'bg-teal-500' },
  'Renewable Energy':       { bg: 'bg-lime-50 dark:bg-lime-500/10',     border: 'border-lime-200 dark:border-lime-500/30',     text: 'text-lime-700 dark:text-lime-400',     dot: 'bg-lime-500' },
  'Security':               { bg: 'bg-gray-100 dark:bg-gray-800',       border: 'border-gray-200 dark:border-gray-700',        text: 'text-gray-600 dark:text-gray-400',     dot: 'bg-gray-500' },
}
const FALLBACK_COLOR = CAT_COLOR['Administrative']

function catInitials(cat: string) {
  return cat.split(/[\s&]+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

/* ── Normalise employment type to short label ── */
function shortType(name: string) {
  if (name.toLowerCase().includes('part')) return 'Part Time'
  if (name.toLowerCase().includes('full')) return 'Full Time'
  if (name.toLowerCase().includes('seasonal')) return 'Seasonal'
  return name
}
function contractOf(name: string) {
  if (name.toLowerCase().includes('indefinite')) return 'Indefinite'
  if (name.toLowerCase().includes('definite')) return 'Definite'
  if (name.toLowerCase().includes('seasonal')) return 'Seasonal'
  return 'Indefinite'
}

function daysAgo(d: string) {
  const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (n <= 0) return 'Today'
  if (n === 1) return '1 day ago'
  if (n < 7) return `${n} days ago`
  if (n < 14) return '1 week ago'
  return `${Math.floor(n / 7)} weeks ago`
}

/* Synthetic applicant count derived from id (stable) */
function applicantsOf(id: number) { return 8 + ((id * 37) % 65) }

const EXP_LEVELS = ['Entry level', 'Mid level', 'Experienced', 'Manager', 'Senior manager / Supervisor']
const EMP_TYPES  = ['Full Time', 'Part Time']
const CONTRACTS  = ['Indefinite', 'Definite', 'Seasonal']

const ALL_CATS = Array.from(new Set(mockJobs.map((j) => j.jobCategoryName))).sort()

/* ── Filter section (collapsible) ── */
function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
        {title}
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

function CheckRow({ label, count, checked, onToggle }: { label: string; count?: number; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input type="checkbox" checked={checked} onChange={onToggle}
        className="rounded border-gray-300 dark:border-gray-600 accent-brand-500" />
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex-1">{label}</span>
      {count != null && <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{count}</span>}
    </label>
  )
}

/* ── Compact job row (centre list) ── */
function JobRow({ job, selected, saved, onSelect, onSave }: {
  job: Job; selected: boolean; saved: boolean; onSelect: (id: number) => void; onSave: (id: number) => void
}) {
  const c = CAT_COLOR[job.jobCategoryName] ?? FALLBACK_COLOR
  const init = catInitials(job.jobCategoryName)
  const applicants = applicantsOf(job.id)
  return (
    <div role="button" tabIndex={0} onClick={() => onSelect(job.id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(job.id)}
      className={'group w-full text-left px-4 py-3.5 border-b border-gray-100 dark:border-gray-800/80 transition-all relative cursor-pointer ' +
        (selected
          ? 'job-card-selected border-l-2 border-l-brand-500 dark:border-l-brand-400'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 border-l-2 border-l-transparent')}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl border flex-shrink-0 flex items-center justify-center text-[11px] font-bold ${c.bg} ${c.border} ${c.text}`}>
          {init}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className={'text-sm font-semibold leading-snug truncate transition-colors ' +
              (selected ? 'text-brand-600 dark:text-brand-400' : 'text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400')}>
              {job.title}
            </p>
            <span role="button" tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onSave(job.id) }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onSave(job.id) } }}
              className={'flex-shrink-0 p-0.5 rounded transition-colors ' + (saved ? 'text-brand-500 dark:text-brand-400' : 'text-gray-300 dark:text-gray-600 hover:text-brand-400')}>
              <Bookmark size={13} className={saved ? 'fill-current' : ''} />
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{job.company ?? 'AX Group'} · {job.departmentName}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {job.jobCategoryName}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{shortType(job.employmentTypeName)}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">{daysAgo(job.datePosted)}</span>
          </div>
        </div>
      </div>
      {applicants > 40 && (
        <div className="mt-2 pl-13">
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <Users size={10} /> {applicants}+ applicants · Active
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Detail panel (right) ── */
function DetailPanel({ job, saved, applied, onSave, onApply }: {
  job: Job; saved: boolean; applied: boolean; onSave: (id: number) => void; onApply: (id: number) => void
}) {
  const c = CAT_COLOR[job.jobCategoryName] ?? FALLBACK_COLOR
  const init = catInitials(job.jobCategoryName)
  const applicants = applicantsOf(job.id)
  const [tab, setTab] = useState<'about' | 'company' | 'similar'>('about')
  useEffect(() => { setTab('about') }, [job.id])

  // synthetic skills from title words + category
  const skills = useMemo(() => {
    const base = [job.jobCategoryName, job.experienceLevelName, shortType(job.employmentTypeName)]
    return Array.from(new Set(base)).slice(0, 6)
  }, [job])

  const similar = mockJobs.filter((j) => j.id !== job.id && j.jobCategoryName === job.jobCategoryName).slice(0, 4)

  return (
    <div className="animate-slide-in-right flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm ${c.bg} ${c.border} ${c.text}`}>
            {init}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">{job.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.company ?? 'AX Group'} · {job.departmentName} · {job.location}</p>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{job.jobCategoryName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock size={11} /> {daysAgo(job.datePosted)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Users size={11} /> {applicants} applicants</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg">
            <Briefcase size={11} /> {contractOf(job.employmentTypeName)} · {shortType(job.employmentTypeName)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg">
            <MapPin size={11} /> {job.location}, On-site
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg">
            <Star size={11} className="text-amber-400" /> {job.experienceLevelName}
          </span>
        </div>

        {/* CTA */}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={() => onApply(job.id)}
            className={'press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ' +
              (applied ? 'bg-emerald-500 text-white cursor-default' : 'bg-brand-500 hover:bg-brand-600 text-white')}>
            {applied ? <><Check size={14} /> Applied</> : <><Send size={13} /> Easy Apply</>}
          </button>
          <button type="button" onClick={() => onSave(job.id)}
            className={'press flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ' +
              (saved ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-300 dark:border-brand-500/40 text-brand-600 dark:text-brand-400'
                     : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:text-brand-600')}>
            <Bookmark size={13} className={saved ? 'fill-current' : ''} /> {saved ? 'Saved' : 'Save'}
          </button>
          <button type="button"
            className="press flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <Share2 size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
        {([['about', 'About'], ['company', 'Company'], ['similar', 'Similar Jobs']] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            className={'text-sm font-medium py-3 mr-5 border-b-2 transition-colors ' +
              (tab === k ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200')}>
            {l}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 job-list-scroll">
        {tab === 'about' && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">About this role</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{job.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2.5">Skills & Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2.5">What we offer</h3>
              <ul className="space-y-1.5">
                {['Competitive salary package', 'Private health insurance', 'Career development opportunities', 'Employee discounts across AX properties', 'Flexible working arrangements', 'Paid training & certifications'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
              <div className="flex items-center gap-2 mb-1.5">
                <Bell size={14} className="text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Set a job alert</span>
              </div>
              <p className="text-xs text-brand-600/80 dark:text-brand-400/80">Get notified when similar {job.jobCategoryName} roles are posted.</p>
              <button type="button" className="press mt-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">Create alert →</button>
            </div>
          </>
        )}

        {tab === 'company' && (
          <>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                <Layers size={22} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{job.company ?? 'AX Group'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hospitality & Leisure · Malta</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([['Founded', '1975'], ['Employees', '2,000+'], ['Locations', '12+ properties'], ['Industry', 'Hospitality']] as const).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{k}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              AX Group is Malta's leading hospitality and lifestyle company, operating hotels, restaurants, real estate, healthcare and construction divisions across the Maltese Islands since 1975.
            </p>
            <Link to="/about" className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
              View all AX Group jobs <ExternalLink size={12} />
            </Link>
          </>
        )}

        {tab === 'similar' && (
          <div className="space-y-3">
            {similar.map((j) => {
              const cc = CAT_COLOR[j.jobCategoryName] ?? FALLBACK_COLOR
              return (
                <div key={j.id} className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-500/40 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${cc.bg} ${cc.border} ${cc.text}`}>{catInitials(j.jobCategoryName)}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">{j.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{j.company ?? 'AX Group'} · {shortType(j.employmentTypeName)} · {daysAgo(j.datePosted)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            {similar.length === 0 && <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No similar roles currently posted.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function JobSearchPage() {
  const navigate = useNavigate()
  const [draftKey, setDraftKey] = useState('')
  const [keyword, setKeyword]   = useState('')
  const [location, setLocation] = useState('')
  const [selCats, setSelCats]   = useState<string[]>([])
  const [selExp, setSelExp]     = useState<string[]>([])
  const [selType, setSelType]   = useState<string[]>([])
  const [selContract, setSelContract] = useState<string[]>([])
  const [sort, setSort]         = useState<'recent' | 'relevant'>('recent')
  const [selectedId, setSelectedId] = useState<number>(mockJobs[0].id)
  const [saved, setSaved]       = useState<Set<number>>(new Set())
  const [applied, setApplied]   = useState<Set<number>>(new Set())
  const [mobileDetail, setMobileDetail] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    setter((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val])
  const toggleNum = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, val: number) =>
    setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })

  const filtered = useMemo(() => {
    let list = mockJobs
    if (keyword) {
      const kw = keyword.toLowerCase()
      list = list.filter((j) =>
        j.title.toLowerCase().includes(kw) || j.departmentName.toLowerCase().includes(kw) ||
        j.jobCategoryName.toLowerCase().includes(kw) || j.description.toLowerCase().includes(kw))
    }
    if (selCats.length)     list = list.filter((j) => selCats.includes(j.jobCategoryName))
    if (selExp.length)      list = list.filter((j) => selExp.includes(j.experienceLevelName))
    if (selType.length)     list = list.filter((j) => selType.includes(shortType(j.employmentTypeName)))
    if (selContract.length) list = list.filter((j) => selContract.includes(contractOf(j.employmentTypeName)))
    if (sort === 'recent')  list = [...list].sort((a, b) => +new Date(b.datePosted) - +new Date(a.datePosted))
    return list
  }, [keyword, selCats, selExp, selType, selContract, sort])

  const selectedJob = mockJobs.find((j) => j.id === selectedId) ?? filtered[0] ?? mockJobs[0]
  const activeFilterCount = selCats.length + selExp.length + selType.length + selContract.length + (keyword ? 1 : 0)

  const handleSelect = (id: number) => { setSelectedId(id); setMobileDetail(true) }
  const clearFilters = () => { setKeyword(''); setDraftKey(''); setLocation(''); setSelCats([]); setSelExp([]); setSelType([]); setSelContract([]) }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setKeyword(draftKey) }

  const Filters = (
    <>
      <FilterSection title="Category">
        <div className="space-y-1">
          {ALL_CATS.map((cat) => (
            <CheckRow key={cat} label={cat} count={mockJobs.filter((j) => j.jobCategoryName === cat).length}
              checked={selCats.includes(cat)} onToggle={() => toggle(setSelCats, cat)} />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Experience Level">
        <div className="space-y-1">
          {EXP_LEVELS.filter((l) => mockJobs.some((j) => j.experienceLevelName === l)).map((lvl) => (
            <CheckRow key={lvl} label={lvl} checked={selExp.includes(lvl)} onToggle={() => toggle(setSelExp, lvl)} />
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Job Type">
        <div className="space-y-1">
          {EMP_TYPES.map((t) => <CheckRow key={t} label={t} checked={selType.includes(t)} onToggle={() => toggle(setSelType, t)} />)}
        </div>
      </FilterSection>
      <FilterSection title="Contract" defaultOpen={false}>
        <div className="space-y-1">
          {CONTRACTS.map((t) => <CheckRow key={t} label={t} checked={selContract.includes(t)} onToggle={() => toggle(setSelContract, t)} />)}
        </div>
      </FilterSection>
      <FilterSection title="Saved Jobs" defaultOpen={false}>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
          <Bookmark size={14} className="text-brand-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{saved.size} job{saved.size !== 1 ? 's' : ''} saved</span>
        </div>
      </FilterSection>
    </>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Search bar row */}
      <div className="shrink-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSearch} className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-2">
          <div className="flex-1 relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={draftKey} onChange={(e) => setDraftKey(e.target.value)} placeholder="Job title or keyword…"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-brand-300 dark:focus:border-brand-500/50 rounded-lg transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none" />
          </div>
          <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div className="hidden sm:flex flex-1 max-w-[200px] relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-brand-300 dark:focus:border-brand-500/50 rounded-lg transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none" />
          </div>
          <button type="submit" className="press px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5">
            <Search size={13} /><span className="hidden sm:inline">Search</span>
          </button>
          {/* Mobile filter trigger */}
          <button type="button" onClick={() => setMobileFilters(true)}
            className="press lg:hidden ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Filter size={13} /> {activeFilterCount > 0 && <span className="bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
        </form>
      </div>

      {/* 3-panel row — fills remaining height, each column scrolls independently */}
      <div className="flex flex-1 min-h-0 max-w-screen-2xl mx-auto w-full">

        {/* Left: filters (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full overflow-y-auto job-list-scroll">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Filter size={14} className="text-brand-500" /> Filters
              {activeFilterCount > 0 && <span className="bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </span>
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className="press text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">Clear all</button>
            )}
          </div>
          <div className="p-4 space-y-0.5">{Filters}</div>
        </aside>

        {/* Centre: job list */}
        <div className={`flex flex-col h-full overflow-hidden border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${mobileDetail ? 'hidden lg:flex' : 'flex'} w-full lg:w-80 xl:w-96 flex-shrink-0`}>
          <div className="shrink-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {filtered.length} <span className="font-normal text-gray-500 dark:text-gray-400">result{filtered.length !== 1 ? 's' : ''}</span>
              </p>
              {activeFilterCount > 0 && <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</p>}
            </div>
            <button type="button" onClick={() => setSort((s) => s === 'recent' ? 'relevant' : 'recent')}
              className="press flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 transition-colors">
              <ArrowUpDown size={12} /> {sort === 'recent' ? 'Most Recent' : 'Relevant'}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="shrink-0 px-4 py-2 flex items-center gap-1.5 flex-wrap border-b border-gray-50 dark:border-gray-800/50">
              {[...selCats, ...selExp, ...selType, ...selContract].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-600 dark:text-brand-400">
                  {f}
                  <button type="button" onClick={() => {
                    if (ALL_CATS.includes(f)) toggle(setSelCats, f)
                    else if (EXP_LEVELS.includes(f)) toggle(setSelExp, f)
                    else if (EMP_TYPES.includes(f)) toggle(setSelType, f)
                    else toggle(setSelContract, f)
                  }} className="ml-0.5 hover:text-brand-800 dark:hover:text-brand-200"><X size={9} /></button>
                </span>
              ))}
            </div>
          )}

          {/* Rows */}
          <div ref={listRef} className="flex-1 overflow-y-auto job-list-scroll">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3"><Search size={20} className="text-gray-400" /></div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No jobs found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
                <button type="button" onClick={clearFilters} className="press mt-3 text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">Clear all filters</button>
              </div>
            ) : filtered.map((job) => (
              <JobRow key={job.id} job={job} selected={selectedId === job.id} saved={saved.has(job.id)}
                onSelect={handleSelect} onSave={(id) => toggleNum(setSaved, id)} />
            ))}
          </div>
        </div>

        {/* Right: detail */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900 ${mobileDetail ? 'flex' : 'hidden lg:flex'} min-w-0`}>
          <div className="lg:hidden shrink-0 z-10 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button type="button" onClick={() => setMobileDetail(false)} className="press flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 font-medium">
              <ChevronLeft size={15} /> Back to results
            </button>
          </div>
          {selectedJob ? (
            <div className="flex-1 min-h-0">
              <DetailPanel key={selectedJob.id} job={selectedJob}
                saved={saved.has(selectedJob.id)} applied={applied.has(selectedJob.id)}
                onSave={(id) => toggleNum(setSaved, id)}
                onApply={(id) => { toggleNum(setApplied, id); navigate(`/job/${id}`) }} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4"><Briefcase size={28} className="text-brand-400" /></div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Select a job to see details</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click any role from the list.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close filters" onClick={() => setMobileFilters(false)} className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-left">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Filter size={14} className="text-brand-500" /> Filters
              </span>
              <button type="button" onClick={() => setMobileFilters(false)} className="press h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5 job-list-scroll">{Filters}</div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button type="button" onClick={clearFilters} className="press flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">Clear all</button>
              <button type="button" onClick={() => setMobileFilters(false)} className="press flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold">Show {filtered.length} results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
