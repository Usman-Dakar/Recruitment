import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Mail, Phone, MapPin, Globe, Camera, Briefcase, GraduationCap,
  Sparkles, Download, Edit2, Eye, Lock, Bell, Shield, Trash2, Check, X,
  Plus, FileText, Upload, ChevronRight, Calendar, Tag,
  ArrowLeft, AlertCircle, Bookmark, Clock,
} from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import { mockJobs } from '@/data/mockJobs'

/* ── Local types ── */
interface DraftExp  { id: string; role: string; company: string; location: string; from: string; to: string; current: boolean; description: string }
interface DraftEdu  { id: string; degree: string; institution: string; year: string; grade: string }
interface CvMeta    { name: string; sizeKB: number; uploadedAt: string }
interface Notifs    { jobAlerts: boolean; applicationUpdates: boolean; weeklyDigest: boolean; productNews: boolean }
interface Prefs     { category: number; employment: number; industry: number; salaryMin: number; salaryMax: number; availableFrom: string; remote: boolean }
interface Draft {
  firstName: string; lastName: string; headline: string; email: string
  phone: string; dateOfBirth: string; nationality: string; city: string
  address: string; linkedin: string; bio: string; avatarUrl: string
  experiences: DraftExp[]; educations: DraftEdu[]; skills: string[]
  cv: CvMeta | null; notifications: Notifs; prefs: Prefs
}

/* ── Helpers ── */
const PHONE_RE = /^\+?[0-9\s\-().]{6,}$/
const URL_RE   = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i

const JOB_CATEGORIES = [
  { value: 11, label: 'Administrative' }, { value: 12, label: 'Business & Finance' },
  { value: 13, label: 'Hotels' },         { value: 14, label: 'Healthcare' },
  { value: 15, label: 'Development' },    { value: 16, label: 'Construction' },
  { value: 17, label: 'Information Technology' }, { value: 21, label: 'Real Estate' },
  { value: 22, label: 'Renewable Energy' }, { value: 27, label: 'Hospitality' },
  { value: 28, label: 'Security' },
]
const EMPLOYMENT_TYPES = [
  { value: 274, label: 'Indefinite — Full Time' }, { value: 276, label: 'Indefinite — Part Time' },
  { value: 243, label: 'Definite — Full Time' },   { value: 193, label: 'Definite — Part Time' },
  { value: 273, label: 'Seasonal' },               { value: 313, label: 'Extended Role' },
]
const INDUSTRIES = [
  { value: 51,  label: 'Banking' },             { value: 98,  label: 'Hospitality' },
  { value: 104, label: 'Information Technology' }, { value: 124, label: 'Marketing & Advertising' },
  { value: 160, label: 'Real Estate' },          { value: 165, label: 'Restaurants' },
  { value: 138, label: 'Renewable Energy' },     { value: 66,  label: 'Construction' },
  { value: 95,  label: 'Health & Wellness' },    { value: 79,  label: 'Events Services' },
]

function validate(p: Draft): Record<string, string> {
  const e: Record<string, string> = {}
  if (p.phone    && !PHONE_RE.test(p.phone))    e.phone    = 'Enter a valid phone number.'
  if (p.linkedin && !URL_RE.test(p.linkedin))   e.linkedin = 'Enter a valid LinkedIn URL or leave blank.'
  return e
}

function fmtMonth(s: string): string {
  if (!s) return ''
  const [y, m] = s.split('-')
  if (!y) return ''
  if (!m) return y
  return new Date(+y, +m - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function computeCompletion(p: Draft): number {
  const has = (v: unknown) => Array.isArray(v) ? v.length > 0 : !!(String(v ?? '').trim())
  const checks = [
    has(p.firstName), has(p.lastName), has(p.headline), has(p.email),
    has(p.phone),     has(p.dateOfBirth), has(p.city),
    has(p.linkedin),  has(p.bio),
    p.experiences.length > 0,
    p.educations.length > 0,
    p.skills.length >= 3,
    !!p.cv,
    has(p.prefs.availableFrom),
  ]
  return Math.round(checks.filter(Boolean).length / checks.length * 100)
}

/* ── Primitives ── */
function SectionCard({ title, icon: I, action, children }: {
  title?: string; icon?: React.ElementType; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <section className="card p-6 animate-fade-in-up">
      {title && (
        <header className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {I && <I size={16} className="text-blue-600 dark:text-blue-400" />}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

function Btn({ children, variant = 'ghost', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger'; className?: string }) {
  const base = 'press inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50 '
  const cls = variant === 'primary'
    ? base + 'bg-blue-600 hover:bg-blue-700 text-white '
    : variant === 'danger'
    ? base + 'bg-red-600 hover:bg-red-700 text-white '
    : base + 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 '
  return <button type="button" className={cls + className} {...rest}>{children}</button>
}

function Lbl({ label, htmlFor, children, hint, error, required }: {
  label?: string; htmlFor?: string; children: React.ReactNode; hint?: string; error?: string; required?: boolean
}) {
  return (
    <div>
      {label && <label htmlFor={htmlFor} className="label">{label}{required && <span className="text-blue-600 ml-0.5">*</span>}</label>}
      {children}
      {error  ? <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
              : hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

function StaticRow({ label, value, Icon }: { label: string; value?: string; Icon?: React.ElementType }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex items-center gap-2 min-h-[34px]">
        {Icon && <Icon size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />}
        <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
          {value || <span className="text-gray-400 dark:text-gray-600 italic">Not set</span>}
        </span>
      </div>
    </div>
  )
}

function SwitchRow({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer select-none">
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</div>
        {description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`press shrink-0 w-10 h-6 rounded-full relative transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </label>
  )
}

function SkillPill({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20">
      {label}
      {onRemove && (
        <button type="button" onClick={onRemove} className="press -mr-1 ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-500/30">
          <X size={10} />
        </button>
      )}
    </span>
  )
}

/* ── Modal ── */
function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <button type="button" aria-label="Close" onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm" />
      <div className="relative card w-full max-w-md shadow-2xl animate-scale-in">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button type="button" onClick={onClose}
            className="press h-8 w-8 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

/* ── Toast ── */
function Toast({ msg, onDone }: { msg: { title: string; body?: string; tone?: string } | null; onDone: () => void }) {
  useEffect(() => { if (!msg) return; const t = setTimeout(onDone, 2600); return () => clearTimeout(t) }, [msg, onDone])
  if (!msg) return null
  const isErr = msg.tone === 'error'
  return (
    <div role="status" aria-live="polite"
      className={`fixed bottom-5 right-5 z-[60] max-w-xs card flex items-center gap-3 px-4 py-3 animate-fade-in-up ${isErr ? 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10' : 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10'}`}>
      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${isErr ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>
        {isErr ? <X size={14} /> : <Check size={16} />}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{msg.title}</div>
        {msg.body && <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{msg.body}</div>}
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function ProfileSkeleton() {
  const bar = 'animate-pulse bg-gray-200 dark:bg-gray-800 rounded'
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <div className="card overflow-hidden">
        <div className={`h-32 ${bar} rounded-none`} />
        <div className="p-6 -mt-12 flex flex-wrap items-end gap-4">
          <div className={`w-24 h-24 ${bar} rounded-2xl border-4 border-white dark:border-gray-900`} />
          <div className="flex-1 space-y-2 pt-14">
            <div className={`h-5 w-48 ${bar}`} /><div className={`h-3 w-32 ${bar}`} />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          {[120, 160, 200].map((h, i) => <div key={i} className={`card ${bar}`} style={{ height: h }} />)}
        </div>
        <div className="lg:col-span-2 space-y-4">
          {[120, 160, 120].map((h, i) => <div key={i} className={`card ${bar}`} style={{ height: h }} />)}
        </div>
      </div>
    </div>
  )
}

/* ── Cover / Header ── */
function ProfileHeader({ draft, editing, onEdit, completion, onAvatar }: {
  draft: Draft; editing: boolean; onEdit: () => void; completion: number; onAvatar: (url: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const initials = `${draft.firstName?.[0] ?? ''}${draft.lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const r = new FileReader()
    r.onload = () => onAvatar(r.result as string)
    r.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <section className="card overflow-hidden animate-fade-in-up">
      {/* Cover */}
      <div className="cover-gradient h-32 sm:h-36 relative">
        <div className="absolute inset-0 cover-pattern opacity-60" aria-hidden="true" />
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
          {/* Avatar */}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="press relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-gray-900 bg-blue-100 dark:bg-blue-500/20 overflow-hidden shadow-md flex items-center justify-center"
            aria-label="Change profile photo">
            {draft.avatarUrl
              ? <img src={draft.avatarUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              : <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{initials}</span>}
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
              <Camera size={20} />
              <span className="text-[10px] font-semibold tracking-wide uppercase">Change</span>
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} />
          </button>
          {/* Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Btn onClick={() => window.print()}><Download size={14} /> Download CV</Btn>
            <Btn variant="primary" onClick={onEdit}>
              {editing ? <><Eye size={14} /> Preview</> : <><Edit2 size={14} /> Edit Profile</>}
            </Btn>
          </div>
        </div>
        {/* Name + headline + meta */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {draft.firstName || 'Your'} {draft.lastName || 'Name'}
          </h1>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">
            {draft.headline || 'Add a professional headline'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-500 dark:text-gray-400">
            {(draft.city) && <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{draft.city}</span>}
            {draft.email && <span className="inline-flex items-center gap-1.5"><Mail size={14} />{draft.email}</span>}
            {draft.linkedin && (
              <a href={draft.linkedin.startsWith('http') ? draft.linkedin : `https://${draft.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Globe size={14} />{draft.linkedin.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
        {/* Completion */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Profile {completion}% complete</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{completion < 100 ? 'Finish to boost matches' : "You're fully set up!"}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700 ease-out"
              style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Personal Info ── */
function PersonalInfoCard({ draft, editing, set, errors }: {
  draft: Draft; editing: boolean; set: (k: keyof Draft, v: unknown) => void; errors: Record<string, string>
}) {
  const countries = ['Maltese', 'British', 'Italian', 'Other']
  return (
    <SectionCard title="Personal Information" icon={User}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {editing ? (
          <>
            <Lbl label="First Name" htmlFor="fn" required><input id="fn" className="input" value={draft.firstName} onChange={(e) => set('firstName', e.target.value)} /></Lbl>
            <Lbl label="Last Name"  htmlFor="ln" required><input id="ln" className="input" value={draft.lastName}  onChange={(e) => set('lastName',  e.target.value)} /></Lbl>
          </>
        ) : (
          <>
            <StaticRow label="First Name" value={draft.firstName} Icon={User} />
            <StaticRow label="Last Name"  value={draft.lastName}  Icon={User} />
          </>
        )}
        {/* Email — always locked */}
        <div className="sm:col-span-2">
          <div className="label">Email</div>
          <div className="readfield">
            <Mail size={14} className="text-gray-400 shrink-0" />
            <span className="flex-1 truncate">{draft.email}</span>
            <Lock size={13} className="text-gray-400" aria-label="Verified — cannot be changed" />
          </div>
        </div>
        {editing ? (
          <>
            <Lbl label="Phone" htmlFor="ph" error={errors.phone}>
              <input id="ph" type="tel" className="input" value={draft.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+356 7777 1234" />
            </Lbl>
            <Lbl label="Date of Birth" htmlFor="dob">
              <input id="dob" type="date" className="input" value={draft.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
            </Lbl>
            <Lbl label="Nationality" htmlFor="nat">
              <select id="nat" className="input" value={draft.nationality} onChange={(e) => set('nationality', e.target.value)}>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Lbl>
            <Lbl label="City" htmlFor="city">
              <input id="city" className="input" value={draft.city} onChange={(e) => set('city', e.target.value)} placeholder="e.g. Sliema" />
            </Lbl>
            <div className="sm:col-span-2">
              <Lbl label="Address" htmlFor="addr">
                <input id="addr" className="input" value={draft.address} onChange={(e) => set('address', e.target.value)} placeholder="Street and number" />
              </Lbl>
            </div>
            <div className="sm:col-span-2">
              <Lbl label="LinkedIn URL" htmlFor="li" error={errors.linkedin}>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input id="li" className="input pl-9" value={draft.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/your-handle" />
                </div>
              </Lbl>
            </div>
          </>
        ) : (
          <>
            <StaticRow label="Phone"       value={draft.phone}       Icon={Phone} />
            <StaticRow label="Date of Birth" value={draft.dateOfBirth ? new Date(draft.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} Icon={Calendar} />
            <StaticRow label="Nationality" value={draft.nationality} Icon={Globe} />
            <StaticRow label="City"        value={draft.city}        Icon={MapPin} />
            <div className="sm:col-span-2"><StaticRow label="Address"  value={draft.address}  Icon={MapPin} /></div>
            <div className="sm:col-span-2"><StaticRow label="LinkedIn" value={draft.linkedin} Icon={Globe} /></div>
          </>
        )}
      </div>
    </SectionCard>
  )
}

/* ── About Me ── */
function AboutMeCard({ bio, editing, setBio }: { bio: string; editing: boolean; setBio: (v: string) => void }) {
  const max = 500
  return (
    <SectionCard title="About Me" icon={Sparkles}>
      {editing ? (
        <div className="relative">
          <textarea rows={5} maxLength={max} value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A few sentences about who you are and what you bring to a team…"
            className="input resize-none leading-relaxed pb-7" />
          <span className={`absolute right-3 bottom-2 text-[11px] tabular-nums ${bio.length > max * 0.9 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'}`}>
            {bio.length}/{max}
          </span>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {bio || <span className="text-gray-400 dark:text-gray-600 italic">No bio yet — tell employers about yourself.</span>}
        </p>
      )}
    </SectionCard>
  )
}

/* ── Experience ── */
function WorkForm({ d, setD, onSave, onCancel }: { d: DraftExp; setD: React.Dispatch<React.SetStateAction<DraftExp | null>>; onSave: () => void; onCancel: () => void }) {
  const f = (k: keyof DraftExp, v: unknown) => setD((p) => p ? { ...p, [k]: v } : p)
  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-500/5 p-4 space-y-3 animate-scale-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Lbl label="Role"    htmlFor="w-role"><input id="w-role" className="input" value={d.role}    onChange={(e) => f('role',    e.target.value)} placeholder="e.g. Senior Engineer" /></Lbl>
        <Lbl label="Company" htmlFor="w-co"  ><input id="w-co"   className="input" value={d.company} onChange={(e) => f('company', e.target.value)} placeholder="e.g. AX Group" /></Lbl>
        <Lbl label="From"    htmlFor="w-from"><input id="w-from" type="month" className="input" value={d.from} onChange={(e) => f('from', e.target.value)} /></Lbl>
        <Lbl label="To"      htmlFor="w-to"  ><input id="w-to"   type="month" className="input" value={d.to} disabled={d.current} onChange={(e) => f('to', e.target.value)} /></Lbl>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
        <input type="checkbox" className="w-4 h-4 rounded accent-blue-600" checked={d.current} onChange={(e) => f('current', e.target.checked)} /> I currently work here
      </label>
      <Lbl label="Description" htmlFor="w-desc">
        <textarea id="w-desc" rows={3} className="input resize-none" value={d.description} onChange={(e) => f('description', e.target.value)} placeholder="Key responsibilities and impact…" />
      </Lbl>
      <div className="flex gap-2 justify-end"><Btn onClick={onCancel}>Cancel</Btn><Btn variant="primary" onClick={onSave}>Save</Btn></div>
    </div>
  )
}

function ExperienceCard({ items, editing, onChange }: { items: DraftExp[]; editing: boolean; onChange: (v: DraftExp[]) => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [d, setD]           = useState<DraftExp | null>(null)

  const blank = (): DraftExp => ({ id: `new-${Date.now()}`, role: '', company: '', location: '', from: '', to: '', current: false, description: '' })
  const start  = (item: DraftExp) => { setEditId(item.id); setD({ ...item }) }
  const cancel = () => { setEditId(null); setD(null) }
  const save   = () => {
    if (!d) return
    const exists = items.some((i) => i.id === d.id)
    onChange(exists ? items.map((i) => (i.id === d.id ? d : i)) : [...items, d])
    cancel()
  }

  return (
    <SectionCard title="Work Experience" icon={Briefcase}
      action={editing && !editId && (
        <button type="button" onClick={() => start(blank())}
          className="press inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
          <Plus size={14} /> Add Experience
        </button>
      )}>
      <ol className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200 dark:before:bg-gray-800">
        {items.map((w) => (
          <li key={w.id} className="relative pl-6 group">
            <span className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-gray-900 ${w.current ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`} aria-hidden="true" />
            {editId === w.id && d ? (
              <WorkForm d={d} setD={setD} onSave={save} onCancel={cancel} />
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{w.role || <span className="italic text-gray-400">Untitled role</span>}</h3>
                    {w.current && <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">Current</span>}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    {w.company}
                    {w.from && <><span className="text-gray-400 dark:text-gray-600"> · </span><span className="text-xs text-gray-500 dark:text-gray-500">{fmtMonth(w.from)} – {w.current ? 'Present' : fmtMonth(w.to)}</span></>}
                  </div>
                  {w.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{w.description}</p>}
                </div>
                {editing && (
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button type="button" onClick={() => start(w)} className="press h-8 w-8 rounded-md text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Edit2 size={13} /></button>
                    <button type="button" onClick={() => onChange(items.filter((i) => i.id !== w.id))} className="press h-8 w-8 rounded-md text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
        {editId?.startsWith('new') && d && (
          <li className="relative pl-6">
            <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-gray-900" aria-hidden="true" />
            <WorkForm d={d} setD={setD} onSave={save} onCancel={cancel} />
          </li>
        )}
        {items.length === 0 && !editId && <li className="pl-6 text-sm text-gray-500 dark:text-gray-500 italic">No work experience yet.</li>}
      </ol>
    </SectionCard>
  )
}

/* ── Education ── */
function EduForm({ d, setD, onSave, onCancel }: { d: DraftEdu; setD: React.Dispatch<React.SetStateAction<DraftEdu | null>>; onSave: () => void; onCancel: () => void }) {
  const f = (k: keyof DraftEdu, v: string) => setD((p) => p ? { ...p, [k]: v } : p)
  return (
    <div className="rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-500/5 p-4 space-y-3 animate-scale-in">
      <Lbl label="Degree" htmlFor="ed-deg"><input id="ed-deg" className="input" value={d.degree} onChange={(e) => f('degree', e.target.value)} placeholder="e.g. B.Sc. Computer Science" /></Lbl>
      <div className="grid grid-cols-[1fr_90px] gap-3">
        <Lbl label="Institution" htmlFor="ed-inst"><input id="ed-inst" className="input" value={d.institution} onChange={(e) => f('institution', e.target.value)} placeholder="University of Malta" /></Lbl>
        <Lbl label="Year" htmlFor="ed-yr"><input id="ed-yr" className="input" value={d.year} onChange={(e) => f('year', e.target.value)} placeholder="2022" /></Lbl>
      </div>
      <Lbl label="Grade" htmlFor="ed-gr"><input id="ed-gr" className="input" value={d.grade} onChange={(e) => f('grade', e.target.value)} placeholder="First Class Honours" /></Lbl>
      <div className="flex gap-2 justify-end"><Btn onClick={onCancel}>Cancel</Btn><Btn variant="primary" onClick={onSave}>Save</Btn></div>
    </div>
  )
}

function EducationCard({ items, editing, onChange }: { items: DraftEdu[]; editing: boolean; onChange: (v: DraftEdu[]) => void }) {
  const [editId, setEditId] = useState<string | null>(null)
  const [d, setD]           = useState<DraftEdu | null>(null)

  const blank  = (): DraftEdu => ({ id: `new-${Date.now()}`, degree: '', institution: '', year: '', grade: '' })
  const start  = (item: DraftEdu) => { setEditId(item.id); setD({ ...item }) }
  const cancel = () => { setEditId(null); setD(null) }
  const save   = () => {
    if (!d) return
    const exists = items.some((i) => i.id === d.id)
    onChange(exists ? items.map((i) => (i.id === d.id ? d : i)) : [...items, d])
    cancel()
  }

  return (
    <SectionCard title="Education" icon={GraduationCap}
      action={editing && !editId && (
        <button type="button" onClick={() => start(blank())}
          className="press inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <Plus size={14} /> Add Education
        </button>
      )}>
      <ul className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200 dark:before:bg-gray-800">
        {items.map((e) => (
          <li key={e.id} className="relative pl-6 group">
            <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900" aria-hidden="true" />
            {editId === e.id && d ? (
              <EduForm d={d} setD={setD} onSave={save} onCancel={cancel} />
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{e.degree || <span className="italic text-gray-400">Untitled</span>}</h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{e.institution}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {e.year && <span className="flex items-center gap-1"><Calendar size={11} />{e.year}</span>}
                    {e.grade && <><span>·</span><span>{e.grade}</span></>}
                  </div>
                </div>
                {editing && (
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button type="button" onClick={() => start(e)} className="press h-8 w-8 rounded-md text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Edit2 size={13} /></button>
                    <button type="button" onClick={() => onChange(items.filter((i) => i.id !== e.id))} className="press h-8 w-8 rounded-md text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"><Trash2 size={13} /></button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
        {editId?.startsWith('new') && d && (
          <li className="relative pl-6">
            <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-gray-300 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-900" aria-hidden="true" />
            <EduForm d={d} setD={setD} onSave={save} onCancel={cancel} />
          </li>
        )}
        {items.length === 0 && !editId && <li className="pl-6 text-sm text-gray-400 dark:text-gray-600 italic">No education added yet.</li>}
      </ul>
    </SectionCard>
  )
}

/* ── Skills ── */
function SkillsCard({ skills, editing, onChange }: { skills: string[]; editing: boolean; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')
  const SUGGESTED = ['React', 'TypeScript', 'Node.js', 'Excel', 'Figma', 'SQL', 'Leadership', 'Agile']
  const add = (s?: string) => { const t = (s ?? input).trim(); if (!t || skills.includes(t)) return; onChange([...skills, t]); setInput('') }
  const remaining = SUGGESTED.filter((s) => !skills.includes(s))

  return (
    <SectionCard title="Skills" icon={Tag}>
      <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
        {skills.length === 0 && <span className="text-sm text-gray-400 dark:text-gray-600 italic">No skills yet</span>}
        {skills.map((s) => (
          <SkillPill key={s} label={s} onRemove={editing ? () => onChange(skills.filter((x) => x !== s)) : undefined} />
        ))}
      </div>
      {editing && (
        <>
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Add a skill — press Enter" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
            <Btn onClick={() => add()}><Plus size={14} /> Add</Btn>
          </div>
          {remaining.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-500 mb-2">Suggested</div>
              <div className="flex flex-wrap gap-1.5">
                {remaining.map((s) => (
                  <button key={s} type="button" onClick={() => add(s)}
                    className="press inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                    <Plus size={9} /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </SectionCard>
  )
}

/* ── Job Preferences ── */
function PrefsCard({ prefs, editing, set }: { prefs: Prefs; editing: boolean; set: (k: keyof Prefs, v: unknown) => void }) {
  return (
    <SectionCard title="Job Preferences" icon={Briefcase}>
      <div className="space-y-4">
        {editing ? (
          <>
            <Lbl label="Preferred Category" htmlFor="p-cat">
              <select id="p-cat" className="input" value={prefs.category} onChange={(e) => set('category', +e.target.value)}>
                {JOB_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Lbl>
            <Lbl label="Employment Type" htmlFor="p-emp">
              <select id="p-emp" className="input" value={prefs.employment} onChange={(e) => set('employment', +e.target.value)}>
                {EMPLOYMENT_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Lbl>
            <Lbl label="Industry" htmlFor="p-ind">
              <select id="p-ind" className="input" value={prefs.industry} onChange={(e) => set('industry', +e.target.value)}>
                {INDUSTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Lbl>
            <Lbl label="Expected Salary (€/year)">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min={0} step={500} placeholder="Min" className="input" value={prefs.salaryMin} onChange={(e) => set('salaryMin', +e.target.value)} />
                <input type="number" min={0} step={500} placeholder="Max" className="input" value={prefs.salaryMax} onChange={(e) => set('salaryMax', +e.target.value)} />
              </div>
            </Lbl>
            <Lbl label="Available From" htmlFor="p-av">
              <input id="p-av" type="date" className="input" value={prefs.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
            </Lbl>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StaticRow label="Category"  value={JOB_CATEGORIES.find((c) => c.value === prefs.category)?.label} />
            <StaticRow label="Type"      value={EMPLOYMENT_TYPES.find((c) => c.value === prefs.employment)?.label} />
            <StaticRow label="Industry"  value={INDUSTRIES.find((c) => c.value === prefs.industry)?.label} />
            <StaticRow label="Salary"    value={prefs.salaryMin ? `€${prefs.salaryMin.toLocaleString()} – €${prefs.salaryMax.toLocaleString()}` : undefined} />
            <div className="col-span-2">
              <StaticRow label="Available from" Icon={Calendar}
                value={prefs.availableFrom ? new Date(prefs.availableFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined} />
            </div>
          </div>
        )}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <SwitchRow checked={prefs.remote} onChange={(v) => set('remote', v)} label="Open to remote work" description="Show remote-friendly roles in your matches" />
        </div>
      </div>
    </SectionCard>
  )
}

/* ── Documents ── */
function DocumentsCard({ cv, onUpload, onRemove }: { cv: CvMeta | null; onUpload: (m: CvMeta) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const onFile = (file: File | null) => {
    if (!file) return
    onUpload({ name: file.name, sizeKB: Math.round(file.size / 1024), uploadedAt: new Date().toISOString().slice(0, 10) })
  }
  return (
    <SectionCard title="Documents" icon={FileText}>
      {cv && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-3 flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <FileText size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{cv.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{cv.sizeKB} KB · {new Date(cv.uploadedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          </div>
          <button type="button" onClick={onRemove}
            className="press h-8 w-8 rounded-md text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center" aria-label="Remove CV">
            <Trash2 size={14} />
          </button>
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0] ?? null) }}
        onClick={() => fileRef.current?.click()}
        className={`rounded-lg border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${drag ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-500/5'}`}
        role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}>
        <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
          <Upload size={18} />
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{cv ? 'Replace CV' : 'Upload your CV'}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, DOC or DOCX · max 5 MB</p>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      </div>
    </SectionCard>
  )
}

/* ── Account Settings ── */
function AccountCard({ notifications, setNotifications, onChangePw, onDelete }: {
  notifications: Notifs; setNotifications: (v: Notifs) => void; onChangePw: () => void; onDelete: () => void
}) {
  const n = notifications
  return (
    <SectionCard title="Account Settings" icon={Shield}>
      <div className="space-y-3">
        <button type="button" onClick={onChangePw}
          className="press w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center shrink-0"><Lock size={15} /></div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Change password</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Keep your account secure</div>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
        <div className="pt-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1.5"><Bell size={12} /> Notifications</div>
          <SwitchRow checked={n.jobAlerts}           onChange={(v) => setNotifications({ ...n, jobAlerts: v })}           label="Job alerts"           description="New roles matching your preferences" />
          <SwitchRow checked={n.applicationUpdates}  onChange={(v) => setNotifications({ ...n, applicationUpdates: v })}  label="Application updates"  description="Status changes on your applications" />
          <SwitchRow checked={n.weeklyDigest}        onChange={(v) => setNotifications({ ...n, weeklyDigest: v })}        label="Weekly digest"        description="A summary email every Monday" />
          <SwitchRow checked={n.productNews}         onChange={(v) => setNotifications({ ...n, productNews: v })}         label="Product news"         description="Tips and feature announcements" />
        </div>
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <button type="button" onClick={onDelete}
            className="press w-full flex items-center justify-between gap-3 p-3 rounded-lg border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-red-100 dark:bg-red-500/15 flex items-center justify-center shrink-0"><Trash2 size={15} /></div>
              <div className="text-left">
                <div className="text-sm font-semibold">Delete account</div>
                <div className="text-xs text-red-600/80 dark:text-red-400/80">Permanently remove your profile</div>
              </div>
            </div>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </SectionCard>
  )
}

/* ── Sticky save bar ── */
function SaveBar({ visible, saving, onSave, onDiscard, hasErrors }: { visible: boolean; saving: boolean; onSave: () => void; onDiscard: () => void; hasErrors: boolean }) {
  if (!visible) return null
  return (
    <div role="region" aria-label="Unsaved changes"
      className="fixed inset-x-0 bottom-0 z-30 px-4 sm:px-6 pb-4 animate-slide-down">
      <div className="max-w-4xl mx-auto card flex items-center justify-between gap-3 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {hasErrors
            ? <><AlertCircle size={15} className="text-red-500 shrink-0" /> Fix the highlighted fields to save.</>
            : <><span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" /> You have unsaved changes.</>}
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={onDiscard}>Discard</Btn>
          <Btn variant="primary" onClick={onSave} disabled={saving}>
            {saving ? <><span className="animate-spin-slow inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" /> Saving…</> : <><Check size={14} /> Save changes</>}
          </Btn>
        </div>
      </div>
    </div>
  )
}

/* ── Sidebar: Profile Strength ── */
function StrengthCard({ committed }: { committed: Draft }) {
  const pct = computeCompletion(committed)
  const r = 40, circ = 2 * Math.PI * r

  const items = [
    { done: !!(committed.firstName && committed.lastName && committed.phone && committed.city), label: 'Personal info' },
    { done: !!committed.avatarUrl, label: 'Profile photo' },
    { done: committed.experiences.length > 0, label: 'Work experience' },
    {
      done: committed.skills.length >= 5,
      label: committed.skills.length >= 5 ? 'Skills' : `Skills (add ${5 - committed.skills.length} more)`,
    },
    { done: !!committed.linkedin, label: 'LinkedIn URL' },
  ]

  const label = pct === 100 ? 'All-Star' : pct >= 75 ? 'Expert' : pct >= 50 ? 'Intermediate' : 'Beginner'

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile strength</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-20 h-20" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-gray-800" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="#7c3aed" strokeWidth="8"
              strokeDasharray={`${circ} ${circ}`}
              strokeDashoffset={circ * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-brand-600 dark:text-brand-400">{pct}%</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Complete your profile to get discovered faster</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
              {item.done ? <Check size={9} strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
            </div>
            <span className={item.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300 font-medium'}>{item.label}</span>
          </div>
        ))}
      </div>
      <button type="button" className="press mt-4 w-full py-2.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors">
        Complete profile
      </button>
    </div>
  )
}

/* ── Sidebar: Your CV ── */
function CVCard({ onDownload }: { onDownload: () => void }) {
  const [template, setTemplate] = useState<'Classic' | 'Modern' | 'Minimal'>('Classic')
  const p = useProfileStore((s) => s.personalInfo)
  const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name'

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Your CV</h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />Auto-updated
        </span>
      </div>
      {/* Mini preview */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 mb-3 text-center">
        <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">{name} · AX Group</div>
        <div className="space-y-1.5">
          {[75, 90, 60].map((w, i) => (
            <div key={i} className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      {/* Template picker */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {(['Classic', 'Modern', 'Minimal'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTemplate(t)}
            className={`press py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
              template === t
                ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-300'
            }`}>{t}</button>
        ))}
      </div>
      <button type="button" onClick={onDownload}
        className="press w-full py-2.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors">
        <Download size={13} /> Download PDF
      </button>
      <Link to="/profile"
        className="press mt-2 block w-full py-2 text-xs font-medium text-center border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-500/40 dark:hover:text-brand-400 transition-colors">
        Open CV Builder →
      </Link>
    </div>
  )
}

/* ── Sidebar: Activity ── */
function ActivityCard() {
  const saved  = useProfileStore((s) => s.bookmarkedJobs.length)
  const apps   = useProfileStore((s) => s.appliedJobs.length)

  const items = [
    { label: 'Saved jobs',    n: saved, color: 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400',   Icon: Bookmark  },
    { label: 'Applications',  n: apps,  color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',        Icon: Briefcase },
    { label: 'In review',     n: apps > 0 ? 1 : 0, color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400', Icon: Clock },
  ]

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Activity</h3>
      <div className="space-y-1">
        {items.map(({ label, n, color, Icon }) => (
          <Link key={label} to="/dashboard"
            className="press flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={14} />
            </div>
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium">{label}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{n}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ── Sidebar: Open roles ── */
function OpenRolesCard() {
  const roles = mockJobs.slice(0, 3)
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Open at AX Hotels</h3>
      <div className="space-y-2.5">
        {roles.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{r.title}</span>
            <Link to={`/job/${r.id}`}
              className="press text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex-shrink-0">
              View →
            </Link>
          </div>
        ))}
      </div>
      <Link to="/jobs"
        className="press mt-3 block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
        See all open roles →
      </Link>
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
function buildDraft(store: ReturnType<typeof useProfileStore.getState>): Draft {
  const p = store.personalInfo
  return {
    firstName:   p.firstName, lastName:    p.lastName,  headline: p.headline,
    email:       p.email,     phone:       p.phone,
    dateOfBirth: p.dateOfBirth, nationality: p.nationality,
    city:        p.city,      address:     p.address,   linkedin: p.linkedin,
    bio:         store.personalStatement,
    avatarUrl:   p.profilePicUrl,
    experiences: store.workExperiences.map((w) => ({
      id: w.id, role: w.jobTitle, company: w.company, location: w.location,
      from: w.fromDate, to: w.toDate, current: w.current, description: w.description,
    })),
    educations: store.educations.map((e) => ({
      id: e.id, degree: e.qualification, institution: e.institution,
      year: e.toDate?.slice(0, 4) ?? '', grade: e.notes,
    })),
    skills: store.digitalSkills,
    cv: null,
    notifications: { jobAlerts: true, applicationUpdates: true, weeklyDigest: false, productNews: false },
    prefs: { category: 17, employment: 274, industry: 104, salaryMin: 30000, salaryMax: 50000, availableFrom: '', remote: false },
  }
}

export default function ProfileLinkedInPage() {
  const store       = useProfileStore()
  useAuthStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t) }, [])

  const initial = useMemo(() => buildDraft(useProfileStore.getState()), [])
  const [committed, setCommitted] = useState<Draft>(initial)
  const [draft, setDraft]         = useState<Draft>(initial)
  const [editing, setEditing]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [touched, setTouched]     = useState(false)
  const [toast, setToast]         = useState<{ title: string; body?: string; tone?: string } | null>(null)
  const [pwOpen, setPwOpen]       = useState(false)
  const [delOpen, setDelOpen]     = useState(false)

  const isDirty    = useMemo(() => JSON.stringify(draft) !== JSON.stringify(committed), [draft, committed])
  const errors     = useMemo(() => validate(draft), [draft])
  const completion = useMemo(() => computeCompletion(committed), [committed])

  const set = useCallback((k: keyof Draft, v: unknown) => {
    setDraft((d) => ({ ...d, [k]: v }))
    setTouched(true)
  }, [])
  const setPrefs = useCallback((k: keyof Prefs, v: unknown) => {
    setDraft((d) => ({ ...d, prefs: { ...d.prefs, [k]: v } }))
    setTouched(true)
  }, [])

  const onToggleEdit = () => {
    if (editing && isDirty) {
      if (!window.confirm('Discard unsaved changes?')) return
      setDraft(committed)
    }
    setEditing((e) => !e)
    setTouched(false)
  }

  const onSave = () => {
    if (Object.keys(errors).length) {
      setToast({ tone: 'error', title: 'Fix highlighted fields' })
      setTouched(true)
      return
    }
    setSaving(true)
    setTimeout(() => {
      // Persist back to store
      store.updatePersonalInfo({
        firstName: draft.firstName, lastName: draft.lastName, headline: draft.headline,
        email: draft.email, phone: draft.phone, dateOfBirth: draft.dateOfBirth,
        nationality: draft.nationality, city: draft.city, address: draft.address,
        linkedin: draft.linkedin, profilePicUrl: draft.avatarUrl,
      })
      store.updatePersonalStatement(draft.bio)
      store.updateDigitalSkills(draft.skills)
      setCommitted(draft)
      setSaving(false)
      setTouched(false)
      setEditing(false)
      setToast({ title: 'Profile saved', body: 'Your changes have been published.' })
    }, 700)
  }

  const onDiscard = () => { setDraft(committed); setTouched(false); setToast({ title: 'Changes discarded' }) }

  const onAvatar   = (url: string) => { set('avatarUrl', url); setToast({ title: 'Photo updated' }) }
  const onDownload = () => { setToast({ title: 'Preparing CV…', body: 'A print dialog will open — save as PDF.' }); setTimeout(() => window.print(), 350) }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ProfileSkeleton />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4 pb-32">

          {/* Template switcher */}
          <div className="flex items-center justify-between">
            <Link to="/profile" className="press inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft size={14} /> Switch to Classic Editor (Template 1)
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
              Template 2 — LinkedIn Style
            </span>
          </div>

          {/* Main flex layout — left column + sticky right sidebar */}
          <div className="flex gap-5 items-start">

            {/* ── Main column ── */}
            <div className="flex-1 min-w-0 space-y-4">
              <ProfileHeader draft={draft} editing={editing} onEdit={onToggleEdit} completion={completion} onAvatar={onAvatar} />
              <PersonalInfoCard draft={draft} editing={editing} set={set} errors={touched ? errors : {}} />
              <AboutMeCard bio={draft.bio} editing={editing} setBio={(v) => set('bio', v)} />
              <ExperienceCard items={draft.experiences} editing={editing} onChange={(v) => { set('experiences', v); setTouched(true) }} />
              <EducationCard  items={draft.educations}  editing={editing} onChange={(v) => { set('educations',  v); setTouched(true) }} />
              <SkillsCard     skills={draft.skills}     editing={editing} onChange={(v) => { set('skills', v);     setTouched(true) }} />
              <PrefsCard      prefs={draft.prefs}       editing={editing} set={setPrefs} />
              <DocumentsCard
                cv={draft.cv}
                onUpload={(m) => { set('cv', m); setToast({ title: 'CV uploaded', body: m.name }) }}
                onRemove={() => { set('cv', null); setToast({ title: 'CV removed' }) }} />
              <AccountCard
                notifications={draft.notifications}
                setNotifications={(v) => set('notifications', v)}
                onChangePw={() => setPwOpen(true)}
                onDelete={() => setDelOpen(true)} />
            </div>

            {/* ── Right sidebar ── */}
            <aside className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0 sticky top-[108px]">
              <StrengthCard committed={committed} />
              <CVCard onDownload={onDownload} />
              <ActivityCard />
              <OpenRolesCard />
            </aside>
          </div>
        </div>
      </main>

      {/* Sticky save bar */}
      <SaveBar visible={editing && isDirty} saving={saving} onSave={onSave} onDiscard={onDiscard} hasErrors={Object.keys(errors).length > 0 && touched} />

      {/* Toast */}
      <Toast msg={toast} onDone={() => setToast(null)} />

      {/* Change password modal */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change password"
        footer={<><Btn onClick={() => setPwOpen(false)}>Cancel</Btn><Btn variant="primary" onClick={() => { setPwOpen(false); setToast({ title: 'Password updated' }) }}>Update password</Btn></>}>
        <div className="space-y-3">
          <Lbl label="Current password" htmlFor="cp-c"><input id="cp-c" type="password" className="input" /></Lbl>
          <Lbl label="New password" htmlFor="cp-n" hint="At least 8 characters with a number and symbol."><input id="cp-n" type="password" className="input" /></Lbl>
          <Lbl label="Confirm new password" htmlFor="cp-cn"><input id="cp-cn" type="password" className="input" /></Lbl>
        </div>
      </Modal>

      {/* Delete account modal */}
      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Delete your account?"
        footer={<>
          <Btn onClick={() => setDelOpen(false)}>Keep account</Btn>
          <Btn variant="danger" onClick={() => { setDelOpen(false); setToast({ tone: 'error', title: 'Deletion requested', body: 'You will receive a confirmation email.' }) }}>
            <Trash2 size={14} /> Delete account
          </Btn>
        </>}>
        <p className="text-sm text-gray-700 dark:text-gray-300">This will permanently remove your profile, applications, and saved jobs. You can't undo this action.</p>
        <ul className="mt-3 text-sm space-y-1.5 text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">·</span> Your CV and uploaded documents will be deleted.</li>
          <li className="flex items-start gap-2"><span className="text-red-500 mt-0.5">·</span> Pending applications will be withdrawn.</li>
        </ul>
      </Modal>
    </div>
  )
}
