import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Sparkles, Briefcase, GraduationCap, Award, Plus, Trash2, X,
  Camera, ChevronDown, ChevronRight, ChevronLeft, Check, Eye,
  Download, FileText, MapPin, Mail, Globe, Tag, Languages,
  Lock, Bookmark, ZoomIn, ZoomOut,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import CvPreview from '@/components/cv/CvPreview'
import type { WorkExperience, Education, LanguageEntry } from '@/types'

/* ── helpers ── */
function rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const ACCENTS = [
  { id: 'violet', hex: '#7c3aed', label: 'Violet' },
  { id: 'blue',   hex: '#2563eb', label: 'Blue'   },
  { id: 'teal',   hex: '#0d9488', label: 'Teal'   },
  { id: 'rose',   hex: '#e11d48', label: 'Rose'   },
  { id: 'amber',  hex: '#d97706', label: 'Amber'  },
  { id: 'slate',  hex: '#475569', label: 'Slate'  },
]

const SECTIONS = [
  { id: 'personal',     label: 'Personal',     icon: User          },
  { id: 'summary',      label: 'Summary',      icon: Sparkles      },
  { id: 'experience',   label: 'Experience',   icon: Briefcase     },
  { id: 'education',    label: 'Education',    icon: GraduationCap },
  { id: 'skills',       label: 'Skills',       icon: Tag           },
  { id: 'languages',    label: 'Languages',    icon: Languages     },
  { id: 'certificates', label: 'Certificates', icon: Award         },
]

const LANG_LEVELS = ['Basic', 'Conversational', 'Proficient', 'Fluent', 'Native'] as const

/* ── completion hook ── */
function useCompletion() {
  const p  = useProfileStore((s) => s.personalInfo)
  const ps = useProfileStore((s) => s.personalStatement)
  const we = useProfileStore((s) => s.workExperiences)
  const ed = useProfileStore((s) => s.educations)
  const sk = useProfileStore((s) => s.digitalSkills)
  const ln = useProfileStore((s) => s.otherLanguages)
  const checks = [
    !!p.firstName, !!p.lastName, !!p.headline, !!p.email, !!p.phone,
    !!(p.city || p.country), !!p.linkedin,
    ps.length > 30, we.length > 0, ed.length > 0, sk.length >= 3, ln.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

/* ── Section wrapper ── */
function Section({
  id, label, icon: Icon, action, children, registerRef,
}: {
  id: string; label: string; icon: React.ElementType
  action?: React.ReactNode; children: React.ReactNode
  registerRef?: (id: string, el: HTMLElement | null) => void
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { registerRef?.(id, ref.current) }, [])
  return (
    <section id={`sec-${id}`} ref={ref} className="scroll-mt-24">
      <header className="flex items-center justify-between gap-2 mb-2 px-1">
        <h2 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
          {Icon && <Icon size={12} />}{label}
        </h2>
        {action}
      </header>
      <div className="card p-4 sm:p-5 animate-fade-in-up">{children}</div>
    </section>
  )
}

/* ── Primitive buttons ── */
function PrimaryBtn({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button type="button" {...rest}
      className={`press inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50 ${className}`}>
      {children}
    </button>
  )
}
function GhostBtn({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button type="button" {...rest}
      className={`press inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-medium hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}>
      {children}
    </button>
  )
}

function QuietInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input className={`input ${className}`} {...props} />
}

function AutoTextarea({ value, onChange, rows = 2, className = '', ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])
  return (
    <textarea ref={ref} rows={rows} value={value} onChange={onChange}
      className={`input resize-none leading-relaxed ${className}`}
      style={{ overflow: 'hidden' }} {...rest} />
  )
}

/* ── Hero ── */
function Hero({ accent, onJump }: { accent: string; onJump: (id: string) => void }) {
  const p  = useProfileStore((s) => s.personalInfo)
  const we = useProfileStore((s) => s.workExperiences)
  const ed = useProfileStore((s) => s.educations)
  const sk = useProfileStore((s) => s.digitalSkills)
  const ln = useProfileStore((s) => s.otherLanguages)
  const ps = useProfileStore((s) => s.personalStatement)
  const u  = useProfileStore((s) => s.updatePersonalInfo)
  const user = useAuthStore((s) => s.user)
  const completion = useCompletion()
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'U'
  const location = [p.city, p.country].filter(Boolean).join(', ')

  const stats = [
    { icon: Briefcase,     label: 'Roles',     value: we.length },
    { icon: GraduationCap, label: 'Education', value: ed.length },
    { icon: Tag,           label: 'Skills',    value: sk.length },
    { icon: Globe,         label: 'Languages', value: ln.length },
  ]

  const missing = useMemo(() => {
    const hints: { id: string; label: string }[] = []
    if (!p.phone)              hints.push({ id: 'personal',   label: 'Phone' })
    if (!location)             hints.push({ id: 'personal',   label: 'Location' })
    if (ps.length < 30)        hints.push({ id: 'summary',    label: 'Summary' })
    if (!we.length)            hints.push({ id: 'experience', label: 'Experience' })
    if (!sk.length)            hints.push({ id: 'skills',     label: 'Skills' })
    if (!ln.length)            hints.push({ id: 'languages',  label: 'Languages' })
    return hints.slice(0, 3)
  }, [p, ps, we, sk, ln, location])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => u({ profilePicUrl: r.result as string })
    r.readAsDataURL(f)
    e.target.value = ''
  }

  return (
    <section className="card overflow-hidden animate-fade-in-up">
      {/* Cover */}
      <div className="h-28 sm:h-32 relative" style={{
        background: `radial-gradient(ellipse 80% 100% at 0% 0%, ${rgba(accent, 0.55)} 0%, transparent 55%),
                     radial-gradient(ellipse 70% 100% at 100% 100%, ${rgba(accent, 0.25)} 0%, transparent 65%),
                     linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`,
      }}>
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      </div>

      <div className="px-5 sm:px-6 pb-5">
        <div className="flex flex-wrap items-end gap-4 -mt-12 sm:-mt-14">
          {/* Avatar */}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="press relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-gray-900 bg-blue-100 dark:bg-blue-500/20 overflow-hidden shadow-lg flex items-center justify-center"
            aria-label="Upload photo">
            {p.profilePicUrl
              ? <img src={p.profilePicUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              : <span className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300">{initials}</span>}
            <span className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 text-white">
              <Camera size={16} />
              <span className="text-[9px] font-semibold tracking-wider uppercase">Change</span>
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onFile} />
          </button>

          <div className="flex-1 min-w-0 pb-1">
            <div className="flex flex-wrap gap-1 items-baseline">
              <QuietInput value={p.firstName} onChange={(e) => u({ firstName: e.target.value })} placeholder="First name"
                className="!text-2xl sm:!text-3xl !font-bold !p-1 -ml-1 !rounded-md max-w-[190px]" />
              <QuietInput value={p.lastName} onChange={(e) => u({ lastName: e.target.value })} placeholder="Last name"
                className="!text-2xl sm:!text-3xl !font-bold !p-1 !rounded-md max-w-[190px]" />
            </div>
            <QuietInput value={p.headline} onChange={(e) => u({ headline: e.target.value })}
              placeholder="Your professional headline"
              className="!text-sm !font-medium !p-1 !-ml-1 !mt-0.5 !rounded-md"
              style={{ color: accent }} />
            {/* Contact chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {location && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <MapPin size={11} className="text-gray-400 shrink-0" />{location}
                </span>
              )}
              {p.email && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/25 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <Mail size={11} className="shrink-0" />{p.email}
                </span>
              )}
              {p.linkedin && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/25 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  <Globe size={11} className="shrink-0" />{p.linkedin.replace(/^https?:\/\//, '')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-4 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden divide-x divide-gray-100 dark:divide-gray-800">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center py-3 bg-gray-50/60 dark:bg-gray-900/40 gap-0.5">
              <div className="text-xl font-bold text-gray-900 dark:text-white tabular-nums leading-none">{value}</div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                <Icon size={10} />{label}
              </div>
            </div>
          ))}
        </div>

        {/* Completion */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Profile <span style={{ color: accent }}>{completion}%</span> complete
            </span>
            {completion === 100
              ? <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Fully set up ✓</span>
              : <span className="text-[11px] text-gray-500">Every section improves matching</span>}
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completion}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
          </div>
          {missing.length > 0 && completion < 100 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">Add:</span>
              {missing.map((m) => (
                <button key={m.label} type="button" onClick={() => onJump(m.id)}
                  className="press inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border border-dashed border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                  <Plus size={9} />{m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Sidebar drawer ── */
function SidebarDrawer({ icon: Icon, label, count, children }: {
  icon: React.ElementType; label: string; count: number; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-gray-100 dark:border-gray-800 shrink-0">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="press w-full flex items-center gap-2.5 px-3 py-2 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
        <Icon size={14} className="shrink-0" />
        <span className="flex-1 text-[13px] font-medium">{label}</span>
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 tabular-nums">{count}</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="max-h-56 overflow-y-auto border-t border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Sidebar ── */
function ProfileSidebar({ activeId, onJump, onDownload }: {
  activeId: string; onJump: (id: string) => void; accent?: string; onDownload: () => void
}) {
  const p   = useProfileStore((s) => s.personalInfo)
  const ps  = useProfileStore((s) => s.personalStatement)
  const we  = useProfileStore((s) => s.workExperiences)
  const ed  = useProfileStore((s) => s.educations)
  const sk  = useProfileStore((s) => s.digitalSkills)
  const ln  = useProfileStore((s) => s.otherLanguages)
  const cr  = useProfileStore((s) => s.certifications)
  const bk  = useProfileStore((s) => s.bookmarkedJobs)
  const ap  = useProfileStore((s) => s.appliedJobs)

  const status = useMemo(() => {
    const done = (c: boolean) => c ? 'done' : 'empty'
    const part = (c: boolean, d: boolean) => d ? 'done' : c ? 'partial' : 'empty'
    return {
      personal:     part([p.firstName, p.lastName, p.email, p.phone, p.city || p.country].some(Boolean),
                         [p.firstName, p.lastName, p.email, p.phone].every(Boolean) && !!(p.city || p.country)),
      summary:      ps.length > 30 ? 'done' : ps.length > 0 ? 'partial' : 'empty',
      experience:   done(we.length > 0),
      education:    done(ed.length > 0),
      skills:       part(sk.length > 0, sk.length >= 3),
      languages:    done(ln.length > 0),
      certificates: done(cr.length > 0),
    } as Record<string, 'done' | 'partial' | 'empty'>
  }, [p, ps, we, ed, sk, ln, cr])

  const counts: Record<string, number | null> = {
    personal: null, summary: null,
    experience:   we.length, education:    ed.length,
    skills:       sk.length, languages:    ln.length, certificates: cr.length,
  }

  return (
    <aside className="hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-800 max-h-[calc(100vh-108px)] sticky top-[108px] w-full overflow-hidden">
      {/* Section nav */}
      <nav className="flex-1 overflow-y-auto p-2 pt-3" aria-label="Profile sections">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-600">
          Sections
        </div>
        {SECTIONS.map(({ id, label, icon: Icon }) => {
          const active = activeId === id
          const s = status[id]
          const dotCls = s === 'done' ? 'bg-emerald-500' : s === 'partial' ? 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-700'
          const cnt = counts[id]
          return (
            <button key={id} type="button" onClick={() => onJump(id)}
              className={`press relative flex items-center gap-2.5 w-full px-3 py-2 rounded-lg mb-0.5 text-left transition-colors ${
                active
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-blue-600 dark:bg-blue-400" />}
              <Icon size={14} className="shrink-0" />
              <span className="flex-1 text-[13px] font-medium">{label}</span>
              {cnt !== null && cnt > 0 && <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 tabular-nums">{cnt}</span>}
              <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dotCls}`} />
            </button>
          )
        })}
      </nav>

      {/* Drawers */}
      <SidebarDrawer icon={Bookmark} label="Saved Jobs" count={bk.length}>
        {bk.length === 0
          ? <p className="px-4 py-6 text-xs text-center text-gray-400">No saved jobs yet</p>
          : bk.map((j) => (
            <div key={j.jobId} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{j.title}</p>
            </div>
          ))
        }
      </SidebarDrawer>
      <SidebarDrawer icon={Briefcase} label="Applications" count={ap.length}>
        {ap.length === 0
          ? <p className="px-4 py-6 text-xs text-center text-gray-400">No applications yet</p>
          : ap.map((a) => (
            <div key={a.jobId} className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{a.title}</p>
              <p className="text-[10px] text-gray-400">{a.dateApplied}</p>
            </div>
          ))
        }
      </SidebarDrawer>

      {/* Download CV */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <button type="button" onClick={onDownload}
          className="press w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20">
          <Download size={15} /> Download CV
        </button>
        <button type="button"
          className="press w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <FileText size={13} /> Open CV Builder
        </button>
      </div>
    </aside>
  )
}

/* ── TopBar ── */
function StylePopover({ accent, setAccent }: { accent: string; setAccent: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="press inline-flex items-center gap-2 h-9 pl-2 pr-2.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
        <span className="w-4 h-4 rounded-sm border border-white/40 shadow-sm" style={{ backgroundColor: accent }} />
        <span className="hidden sm:inline">Style</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-64 card p-3 shadow-xl animate-slide-down">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-2">Accent colour</div>
          <div className="flex items-center gap-2 flex-wrap">
            {ACCENTS.map((a) => {
              const active = accent === a.hex
              return (
                <button key={a.id} type="button" onClick={() => { setAccent(a.hex); setOpen(false) }}
                  aria-label={a.label} aria-pressed={active}
                  className={`press relative w-7 h-7 rounded-full transition-transform ${active ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-950 ring-offset-white' : 'hover:scale-110'}`}
                  style={{ backgroundColor: a.hex }}>
                  {active && <Check size={12} className="absolute inset-0 m-auto text-white" strokeWidth={3} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function TopBar({ accent, setAccent, previewOpen, onTogglePreview, onDownload, dirty }: {
  accent: string; setAccent: (v: string) => void
  previewOpen: boolean; onTogglePreview: () => void
  onDownload: () => void; dirty: boolean
}) {
  return (
    <header className="sticky top-16 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-5 h-11 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-500">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            {dirty ? 'Saving…' : 'Auto-saved'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/profile/t2"
            className="press hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Template 2
          </Link>
          <button type="button" onClick={onDownload}
            className="press lg:hidden inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
            <Download size={13} /> Download
          </button>
          <StylePopover accent={accent} setAccent={setAccent} />
          <button type="button" onClick={onTogglePreview}
            className={`press hidden lg:inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-semibold transition-colors ${
              previewOpen
                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}>
            <Eye size={13} /> {previewOpen ? 'Hide preview' : 'Show preview'}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ── Personal section ── */
function PersonalSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const p = useProfileStore((s) => s.personalInfo)
  const u = useProfileStore((s) => s.updatePersonalInfo)
  return (
    <Section id="personal" label="Personal" icon={User} registerRef={registerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="label">Email</div>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-gray-50 dark:bg-gray-900/60 border border-transparent text-sm text-gray-700 dark:text-gray-200">
            <Mail size={13} className="text-gray-400 shrink-0" />
            <span className="flex-1 truncate">{p.email || '—'}</span>
            <Lock size={11} className="text-gray-400" />
          </div>
        </div>
        <div>
          <div className="label">Phone</div>
          <QuietInput value={p.phone} placeholder="+356 7777 1234" onChange={(e) => u({ phone: e.target.value })} />
        </div>
        <div>
          <div className="label">City</div>
          <QuietInput value={p.city} placeholder="Valletta" onChange={(e) => u({ city: e.target.value })} />
        </div>
        <div>
          <div className="label">Country</div>
          <QuietInput value={p.country} placeholder="Malta" onChange={(e) => u({ country: e.target.value })} />
        </div>
        <div>
          <div className="label">LinkedIn</div>
          <QuietInput value={p.linkedin} placeholder="linkedin.com/in/…" onChange={(e) => u({ linkedin: e.target.value })} />
        </div>
        <div>
          <div className="label">Date of birth</div>
          <QuietInput type="date" value={p.dateOfBirth} onChange={(e) => u({ dateOfBirth: e.target.value })} />
        </div>
        <div>
          <div className="label">Nationality</div>
          <QuietInput value={p.nationality} placeholder="Maltese" onChange={(e) => u({ nationality: e.target.value })} />
        </div>
        <div>
          <div className="label">Website</div>
          <QuietInput value={p.websites[0] ?? ''} placeholder="yoursite.com" onChange={(e) => u({ websites: [e.target.value] })} />
        </div>
      </div>
    </Section>
  )
}

/* ── Summary section ── */
function SummarySection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const summary    = useProfileStore((s) => s.personalStatement)
  const setSummary = useProfileStore((s) => s.updatePersonalStatement)
  const p          = useProfileStore((s) => s.personalInfo)
  const sk         = useProfileStore((s) => s.digitalSkills)
  const we         = useProfileStore((s) => s.workExperiences)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const [tone, setTone] = useState<'confident' | 'warm' | 'crisp'>('confident')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('short')
  const max = 600

  const simulate = () => {
    if (loading) return
    setLoading(true); setStreaming('')
    const name  = [p.firstName, p.lastName].filter(Boolean).join(' ')
    const role  = p.headline
    const top   = we.slice(0, 2).map((e) => `${e.jobTitle} at ${e.company}`).join('; ')
    const skills = sk.slice(0, 5).join(', ')
    const wordCount = length === 'short' ? '50' : length === 'medium' ? '80' : '110'
    const sample = `${name || 'A dedicated professional'}${role ? `, ${role},` : ''} brings ${wordCount === '50' ? 'focused' : 'extensive'} expertise${top ? ` from roles including ${top}` : ''}. ${skills ? `Skilled in ${skills}, they` : 'They'} deliver high-quality results and thrive in collaborative environments.`
    let i = 0
    const tick = () => {
      i = Math.min(sample.length, i + 3)
      setStreaming(sample.slice(0, i))
      if (i < sample.length) setTimeout(tick, 18)
      else { setSummary(sample); setStreaming(''); setLoading(false) }
    }
    tick()
  }

  return (
    <Section id="summary" label="Summary" icon={Sparkles} registerRef={registerRef}
      action={<span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] px-1.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20">AI</span>}>
      <div className="space-y-3">
        <div className="relative">
          {loading && streaming
            ? <div className="input is-bordered min-h-[80px] whitespace-pre-wrap text-sm leading-relaxed">{streaming}<span className="caret" /></div>
            : loading
            ? <div className="space-y-2 p-2">{[11,10,9].map((w) => <div key={w} className="h-3 rounded skeleton" style={{ width: `${w * 10}%` }} />)}</div>
            : <AutoTextarea value={summary} maxLength={max} onChange={(e) => setSummary(e.target.value)} placeholder="A few sentences about who you are and what you bring." rows={3} />
          }
          {!loading && (
            <span className={`absolute right-2 bottom-2 text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
              summary.length > max * 0.9 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'text-gray-400 dark:text-gray-600'
            }`}>{summary.length}/{max}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-violet-200 dark:border-violet-500/25 bg-violet-50/60 dark:bg-violet-500/[0.06] px-2 py-1.5">
          <div className="flex items-center gap-1.5 text-violet-700 dark:text-violet-300">
            <Sparkles size={12} /><span className="text-[11px] font-semibold">Help me write</span>
          </div>
          <div className="flex p-0.5 rounded bg-white dark:bg-gray-900 border border-violet-200/60 dark:border-violet-500/20">
            {(['confident', 'warm', 'crisp'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTone(t)}
                className={`press text-[10.5px] font-medium px-2 py-0.5 rounded capitalize ${tone === t ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{t}</button>
            ))}
          </div>
          <div className="flex p-0.5 rounded bg-white dark:bg-gray-900 border border-violet-200/60 dark:border-violet-500/20">
            {([['short','S'],['medium','M'],['long','L']] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setLength(v)} title={v}
                className={`press text-[10.5px] font-medium w-7 py-0.5 rounded text-center ${length === v ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{l}</button>
            ))}
          </div>
          <button type="button" onClick={simulate} disabled={loading}
            className="press ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold disabled:opacity-60">
            {loading
              ? <><span className="inline-block w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />Drafting…</>
              : <><Sparkles size={11} />{summary ? 'Regenerate' : 'Generate'}</>}
          </button>
        </div>
      </div>
    </Section>
  )
}

/* ── Experience section ── */
const newWork = (): Omit<WorkExperience, 'id'> => ({
  jobTitle: '', company: '', location: '', fromDate: '', toDate: '', current: false, description: '', skills: []
})

function WorkItem({ w, onEdit, onRemove, isEditing, onSave, onCancel }: {
  w: WorkExperience; onEdit: () => void; onRemove: () => void
  isEditing: boolean; onSave: (d: Omit<WorkExperience, 'id'>) => void; onCancel: () => void
}) {
  const [d, setD] = useState<Omit<WorkExperience, 'id'>>({ jobTitle: w.jobTitle, company: w.company, location: w.location, fromDate: w.fromDate, toDate: w.toDate, current: w.current, description: w.description, skills: w.skills })
  const f = (k: keyof typeof d, v: unknown) => setD((p) => ({ ...p, [k]: v }))

  if (!isEditing) return (
    <article className="group relative pl-5 border-l-2 border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <span className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full ring-4 ring-white dark:ring-gray-900 ${w.current ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
      <div className="absolute -right-1 top-0 flex gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button type="button" onClick={onEdit} className="press h-6 w-6 rounded text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Sparkles size={11} /></button>
        <button type="button" onClick={onRemove} className="press h-6 w-6 rounded text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Trash2 size={11} /></button>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{w.jobTitle || <span className="text-gray-400 italic">Untitled role</span>}</p>
      <p className="text-xs text-blue-600 dark:text-blue-400">{w.company}</p>
      {w.location && <p className="text-xs text-gray-400">{w.location}</p>}
      <p className="text-xs text-gray-400 mt-0.5">{w.fromDate && w.fromDate.slice(0, 7)} – {w.current ? 'Present' : w.toDate && w.toDate.slice(0, 7)}</p>
      {w.description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 whitespace-pre-line">{w.description}</p>}
    </article>
  )

  return (
    <div className="space-y-2 pl-5 border-l-2 border-blue-300 dark:border-blue-700">
      <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-900" />
      <div className="grid grid-cols-2 gap-2">
        <div><div className="label">Job Title</div><QuietInput value={d.jobTitle} onChange={(e) => f('jobTitle', e.target.value)} placeholder="Role" /></div>
        <div><div className="label">Company</div><QuietInput value={d.company} onChange={(e) => f('company', e.target.value)} placeholder="Company" /></div>
        <div><div className="label">Location</div><QuietInput value={d.location} onChange={(e) => f('location', e.target.value)} placeholder="City" /></div>
        <div className="flex items-end gap-2">
          <div className="flex-1"><div className="label">From</div><QuietInput type="month" className="is-bordered !text-xs !py-1" value={d.fromDate} onChange={(e) => f('fromDate', e.target.value)} /></div>
          <div className="flex-1"><div className="label">To</div><QuietInput type="month" className="is-bordered !text-xs !py-1" value={d.toDate} disabled={d.current} onChange={(e) => f('toDate', e.target.value)} /></div>
        </div>
      </div>
      <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600" checked={d.current} onChange={(e) => f('current', e.target.checked)} /> Current role
      </label>
      <div><div className="label">Description</div><AutoTextarea value={d.description} onChange={(e) => f('description', e.target.value)} placeholder="Describe your responsibilities and achievements." rows={3} /></div>
      <div className="flex gap-2 pt-1"><PrimaryBtn onClick={() => onSave(d)}>Save</PrimaryBtn><GhostBtn onClick={onCancel}>Cancel</GhostBtn></div>
    </div>
  )
}

function ExperienceSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const items  = useProfileStore((s) => s.workExperiences)
  const add    = useProfileStore((s) => s.addWorkExperience)
  const update = useProfileStore((s) => s.updateWorkExperience)
  const remove = useProfileStore((s) => s.removeWorkExperience)
  const [editId, setEditId]   = useState<string | null>(null)
  const [adding, setAdding]   = useState(false)
  const [draft, setDraft]     = useState<Omit<WorkExperience, 'id'>>(newWork())

  return (
    <Section id="experience" label={`Experience · ${items.length}`} icon={Briefcase} registerRef={registerRef}
      action={<button type="button" onClick={() => { setDraft(newWork()); setAdding(true) }} className="press inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"><Plus size={12} /> Add</button>}>
      <div className="space-y-4">
        {items.length === 0 && !adding && <p className="text-center py-6 text-sm text-gray-500">No experience yet. <button type="button" onClick={() => { setDraft(newWork()); setAdding(true) }} className="press text-blue-600 dark:text-blue-400 font-medium">Add your first role →</button></p>}
        {adding && (
          <div className="relative pl-5 border-l-2 border-blue-300 dark:border-blue-700 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><div className="label">Job Title</div><QuietInput value={draft.jobTitle} onChange={(e) => setDraft((p) => ({ ...p, jobTitle: e.target.value }))} placeholder="Role" /></div>
              <div><div className="label">Company</div><QuietInput value={draft.company} onChange={(e) => setDraft((p) => ({ ...p, company: e.target.value }))} placeholder="Company" /></div>
              <div><div className="label">Location</div><QuietInput value={draft.location} onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))} placeholder="City" /></div>
              <div className="flex items-end gap-2">
                <div className="flex-1"><div className="label">From</div><QuietInput type="month" className="is-bordered !text-xs !py-1" value={draft.fromDate} onChange={(e) => setDraft((p) => ({ ...p, fromDate: e.target.value }))} /></div>
                <div className="flex-1"><div className="label">To</div><QuietInput type="month" className="is-bordered !text-xs !py-1" value={draft.toDate} disabled={draft.current} onChange={(e) => setDraft((p) => ({ ...p, toDate: e.target.value }))} /></div>
              </div>
            </div>
            <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600" checked={draft.current} onChange={(e) => setDraft((p) => ({ ...p, current: e.target.checked }))} /> Current role
            </label>
            <div><div className="label">Description</div><AutoTextarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Describe responsibilities and achievements." rows={3} /></div>
            <div className="flex gap-2 pt-1"><PrimaryBtn onClick={() => { add(draft); setAdding(false) }}>Save</PrimaryBtn><GhostBtn onClick={() => setAdding(false)}>Cancel</GhostBtn></div>
          </div>
        )}
        {items.map((w) => (
          <div key={w.id} className="relative">
            <WorkItem w={w} isEditing={editId === w.id}
              onEdit={() => setEditId(w.id)} onRemove={() => remove(w.id)}
              onSave={(d) => { update(w.id, d); setEditId(null) }}
              onCancel={() => setEditId(null)} />
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Education section ── */
const newEdu = (): Omit<Education, 'id'> => ({ qualification: '', institution: '', location: '', fromDate: '', toDate: '', current: false, notes: '' })

function EducationSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const items  = useProfileStore((s) => s.educations)
  const add    = useProfileStore((s) => s.addEducation)
  const update = useProfileStore((s) => s.updateEducation)
  const remove = useProfileStore((s) => s.removeEducation)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft]   = useState<Omit<Education, 'id'>>(newEdu())

  const renderForm = (d: Omit<Education, 'id'>, setD: (v: Omit<Education, 'id'>) => void, onSave: () => void, onCancel: () => void) => (
    <div className="space-y-2">
      <div><div className="label">Degree / Qualification</div><QuietInput value={d.qualification} onChange={(e) => setD({ ...d, qualification: e.target.value })} placeholder="B.Sc. Computer Science" /></div>
      <div className="grid grid-cols-[1fr_80px] gap-2">
        <div><div className="label">Institution</div><QuietInput value={d.institution} onChange={(e) => setD({ ...d, institution: e.target.value })} placeholder="Institution" /></div>
        <div><div className="label">Year</div><QuietInput value={d.toDate?.slice(0, 4) ?? ''} onChange={(e) => setD({ ...d, toDate: e.target.value })} placeholder="2024" /></div>
      </div>
      <div><div className="label">Notes</div><AutoTextarea value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} placeholder="Grade, thesis, awards…" rows={1} /></div>
      <div className="flex gap-2 pt-1"><PrimaryBtn onClick={onSave}>Save</PrimaryBtn><GhostBtn onClick={onCancel}>Cancel</GhostBtn></div>
    </div>
  )

  return (
    <Section id="education" label={`Education · ${items.length}`} icon={GraduationCap} registerRef={registerRef}
      action={<button type="button" onClick={() => { setDraft(newEdu()); setAdding(true) }} className="press inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400"><Plus size={12} /> Add</button>}>
      <div className="space-y-3">
        {items.length === 0 && !adding && <p className="text-center py-6 text-sm text-gray-500">No education yet. <button type="button" onClick={() => { setDraft(newEdu()); setAdding(true) }} className="press text-blue-600 dark:text-blue-400 font-medium">Add your first qualification →</button></p>}
        {adding && (
          <div className="pl-5 border-l-2 border-blue-300 dark:border-blue-700">
            {renderForm(draft, setDraft, () => { add(draft); setAdding(false) }, () => setAdding(false))}
          </div>
        )}
        {items.map((e) => (
          <article key={e.id} className="group relative pl-5 border-l-2 border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900" />
            {editId === e.id ? (
              renderForm(
                { qualification: e.qualification, institution: e.institution, location: e.location, fromDate: e.fromDate, toDate: e.toDate, current: e.current, notes: e.notes },
                (d) => update(e.id, d),
                () => setEditId(null),
                () => setEditId(null)
              )
            ) : (
              <>
                <div className="absolute -right-1 top-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => setEditId(e.id)} className="press h-6 w-6 rounded text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Sparkles size={11} /></button>
                  <button type="button" onClick={() => remove(e.id)} className="press h-6 w-6 rounded text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Trash2 size={11} /></button>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{e.qualification || <span className="text-gray-400 italic">Untitled</span>}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{e.institution}</p>
                {e.toDate && <p className="text-xs text-gray-400">{e.toDate.slice(0, 4)}</p>}
                {e.notes && <p className="mt-1 text-xs text-gray-400 line-clamp-1">{e.notes}</p>}
              </>
            )}
          </article>
        ))}
      </div>
    </Section>
  )
}

/* ── Skills section ── */
function SkillsSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const skills = useProfileStore((s) => s.digitalSkills)
  const update = useProfileStore((s) => s.updateDigitalSkills)
  const [input, setInput] = useState('')
  const SUGGEST = ['React', 'TypeScript', 'Node.js', 'Excel', 'Figma', 'SQL']
  const add = (s?: string) => { const t = (s ?? input).trim(); if (!t || skills.includes(t)) return; update([...skills, t]); setInput('') }
  const remaining = SUGGEST.filter((s) => !skills.includes(s))
  return (
    <Section id="skills" label={`Skills · ${skills.length}`} icon={Tag} registerRef={registerRef}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {skills.length === 0 && <span className="text-sm text-gray-400 dark:text-gray-600 italic">No skills yet</span>}
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20 animate-scale-in">
              {s}
              <button type="button" onClick={() => update(skills.filter((x) => x !== s))} className="press -mr-0.5 ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/30">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input is-bordered flex-1" placeholder="Type a skill, press Enter" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
          <GhostBtn onClick={() => add()}><Plus size={11} /> Add</GhostBtn>
        </div>
        {remaining.length > 0 && (
          <div>
            <div className="label mb-1.5">Suggested</div>
            <div className="flex flex-wrap gap-1.5">
              {remaining.map((s) => (
                <button key={s} type="button" onClick={() => add(s)}
                  className="press inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                  <Plus size={9} /> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

/* ── Languages section ── */
function LanguagesSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const langs  = useProfileStore((s) => s.otherLanguages)
  const addLng = useProfileStore((s) => s.addLanguage)
  const updLng = useProfileStore((s) => s.updateLanguage)
  const rmLng  = useProfileStore((s) => s.removeLanguage)
  return (
    <Section id="languages" label={`Languages · ${langs.length}`} icon={Languages} registerRef={registerRef}
      action={<button type="button" onClick={() => addLng({ name: '', proficiency: 'Conversational' })} className="press inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400"><Plus size={12} /> Add</button>}>
      <div className="space-y-2">
        {langs.length === 0 && <p className="text-center py-4 text-sm text-gray-500">No languages yet.</p>}
        {langs.map((l) => (
          <div key={l.id} className="group flex items-center gap-2">
            <QuietInput className="flex-1 !text-sm" placeholder="Language" value={l.name} onChange={(e) => updLng(l.id, { name: e.target.value })} />
            <select className="input is-bordered w-auto !text-xs !py-1" value={l.proficiency} onChange={(e) => updLng(l.id, { proficiency: e.target.value as LanguageEntry['proficiency'] })}>
              {LANG_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
            </select>
            <button type="button" onClick={() => rmLng(l.id)} className="press h-7 w-7 rounded text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── Certificates section ── */
function CertificatesSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const certs = useProfileStore((s) => s.certifications)
  const addC  = useProfileStore((s) => s.addCertification)
  const updC  = useProfileStore((s) => s.updateCertification)
  const rmC   = useProfileStore((s) => s.removeCertification)
  return (
    <Section id="certificates" label={`Certificates · ${certs.length}`} icon={Award} registerRef={registerRef}
      action={<button type="button" onClick={() => addC({ name: '', issuer: '', year: '' })} className="press inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400"><Plus size={12} /> Add</button>}>
      <div className="space-y-2">
        {certs.length === 0 && <p className="text-center py-4 text-sm text-gray-500">No certificates yet.</p>}
        {certs.map((c) => (
          <div key={c.id} className="group grid grid-cols-[1fr_120px_70px_auto] gap-2 items-center">
            <QuietInput className="!text-sm" placeholder="Certificate name" value={c.name} onChange={(e) => updC(c.id, { name: e.target.value })} />
            <QuietInput className="!text-xs" placeholder="Issuer" value={c.issuer} onChange={(e) => updC(c.id, { issuer: e.target.value })} />
            <QuietInput className="!text-xs" placeholder="Year" value={c.year} onChange={(e) => updC(c.id, { year: e.target.value })} />
            <button type="button" onClick={() => rmC(c.id)} className="press h-7 w-7 rounded text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ── CV Preview panel ── */
function PreviewPanel({ onClose }: { onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const A4_W = 794

  useLayoutEffect(() => {
    const calc = () => {
      const el = wrapRef.current; if (!el) return
      setScale(Math.min(1, (el.clientWidth - 32) / A4_W))
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const finalScale = scale * zoom
  return (
    <section className="hidden lg:flex flex-col border-l border-gray-200 dark:border-gray-800 lg:max-h-[calc(100vh-108px)] sticky top-[108px]">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/40 dark:bg-gray-950/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Live CV Preview</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-semibold uppercase tracking-wider">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />Auto
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
            <button type="button" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} className="press h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-l"><ZoomOut size={11} /></button>
            <span className="px-1.5 text-[10px] tabular-nums text-gray-500 w-10 text-center">{Math.round(finalScale * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} className="press h-6 w-6 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-r"><ZoomIn size={11} /></button>
          </div>
          <button type="button" onClick={onClose} className="press h-6 w-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <div ref={wrapRef} className="flex-1 min-h-0 overflow-auto bg-gray-100 dark:bg-gray-900/50">
        <div className="flex justify-center p-4 pb-12">
          <div style={{ width: A4_W * finalScale, transformOrigin: 'top left' }}>
            <div style={{ transform: `scale(${finalScale})`, transformOrigin: 'top left' }}>
              <CvPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function MyProfilePage() {
  useThemeStore()
  const [accent, setAccent]           = useState(() => localStorage.getItem('ax-cv-accent') ?? ACCENTS[0].hex)
  const [previewOpen, setPreviewOpen] = useState(true)
  const [dirty, setDirty]             = useState(false)
  const [toast, setToast]             = useState<{ title: string; body?: string } | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})
  const [activeId, setActiveId]       = useState('personal')

  useEffect(() => { localStorage.setItem('ax-cv-accent', accent) }, [accent])

  // Dirty indicator — flashes when profile changes
  const profileSnapshot = useProfileStore((s) => s.personalInfo.firstName + s.workExperiences.length)
  useEffect(() => {
    setDirty(true)
    const t = setTimeout(() => setDirty(false), 1400)
    return () => clearTimeout(t)
  }, [profileSnapshot])

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el
  }, [])

  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id]
        if (el && el.getBoundingClientRect().top < 140) current = s.id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jumpTo = useCallback((id: string) => {
    const el = sectionRefs.current[id] ?? document.getElementById(`sec-${id}`)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
  }, [])

  const onDownload = () => {
    setToast({ title: 'Preparing CV…', body: 'A print dialog will open — choose "Save as PDF".' })
    setTimeout(() => window.print(), 350)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <TopBar accent={accent} setAccent={setAccent} previewOpen={previewOpen} onTogglePreview={() => setPreviewOpen((v) => !v)} onDownload={onDownload} dirty={dirty} />

      <main className={`flex-1 max-w-[1700px] mx-auto w-full grid transition-all duration-300 ease-out ${
        previewOpen ? 'lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1.1fr)]' : 'lg:grid-cols-[200px_minmax(0,1fr)]'
      }`}>
        <ProfileSidebar activeId={activeId} onJump={jumpTo} onDownload={onDownload} />

        <section className="px-3 sm:px-5 py-5 lg:py-6 lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto">
          <Hero accent={accent} onJump={jumpTo} />
          <div className="mt-5 space-y-5">
            <PersonalSection    registerRef={registerRef} />
            <SummarySection     registerRef={registerRef} />
            <ExperienceSection  registerRef={registerRef} />
            <EducationSection   registerRef={registerRef} />
            <SkillsSection      registerRef={registerRef} />
            <LanguagesSection   registerRef={registerRef} />
            <CertificatesSection registerRef={registerRef} />
          </div>
        </section>

        {previewOpen && <PreviewPanel onClose={() => setPreviewOpen(false)} />}
      </main>

      {/* Collapsed preview tab */}
      {!previewOpen && (
        <button type="button" onClick={() => setPreviewOpen(true)} aria-label="Expand CV preview"
          className="press fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-1 py-3 px-1.5 rounded-l-lg border-l border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 shadow-lg">
          <ChevronLeft size={14} />
          <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Preview</div>
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div role="status" aria-live="polite"
          className="fixed bottom-5 right-5 z-[70] max-w-xs card flex items-center gap-3 px-4 py-3 animate-fade-in-up border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10">
          <div className="w-8 h-8 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Check size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{toast.title}</div>
            {toast.body && <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{toast.body}</div>}
          </div>
          <button type="button" onClick={() => setToast(null)} className="press shrink-0 ml-1 h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
