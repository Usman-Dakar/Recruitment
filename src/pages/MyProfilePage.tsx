import { useState, useRef, useEffect, useCallback } from 'react'
import {
  User, Sparkles, Briefcase, GraduationCap, Wrench, Languages,
  Award, Plus, Trash2, Pencil, X, Camera, ChevronRight, ChevronLeft,
  Loader2, FileUp, Check, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import CvPreview from '@/components/cv/CvPreview'
import { extractPdfText, parseCvText } from '@/lib/parseCv'
import type { WorkExperience, Education, LanguageEntry } from '@/types'

/* ─── helpers ─── */
const PROFICIENCIES: LanguageEntry['proficiency'][] = ['Basic', 'Conversational', 'Proficient', 'Fluent', 'Native']
const DRIVING_CATS = ['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE']

function useCompletion() {
  const p = useProfileStore((s) => s.personalInfo)
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

/* ─── Section wrapper ─── */
function Section({
  id, label, icon: Icon, children, registerRef, action,
}: {
  id: string; label: string; icon: React.ElementType
  children: React.ReactNode
  registerRef?: (id: string, el: HTMLElement | null) => void
  action?: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { registerRef?.(id, ref.current) }, [])
  return (
    <section id={`sec-${id}`} ref={ref} className="scroll-mt-20">
      <header className="flex items-center justify-between gap-2 mb-2 px-1">
        <h2 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <Icon size={12} /> {label}
        </h2>
        {action}
      </header>
      <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/8 rounded-xl p-4 sm:p-5">
        {children}
      </div>
    </section>
  )
}

/* ─── Field ─── */
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      {children}
    </div>
  )
}

/* ─── Input / Textarea ─── */
const inputCls = 'w-full px-2.5 py-2 text-sm rounded-md border border-transparent bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 hover:border-slate-300 dark:hover:border-white/15 focus:border-brand-500 dark:focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors'

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, 'resize-none leading-relaxed')} {...props} />
}

/* ─── Tag chip ─── */
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs rounded-full">
      {label}
      <button type="button" onClick={onRemove} className="opacity-60 hover:opacity-100 hover:text-red-500 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

/* ═══════════════════════════════════════════
   TOP BAR
═══════════════════════════════════════════ */
function TopBar({ completion, previewOpen, onTogglePreview, fileInputRef, parsing, parseMsg, onImport }:{
  completion: number
  previewOpen: boolean
  onTogglePreview: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  parsing: boolean
  parseMsg: string
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  useThemeStore()
  return (
    <div className="sticky top-16 z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-slate-200 dark:border-white/8 px-4 h-12 flex items-center gap-3">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 shrink-0">My Profile</span>

      {/* Completion bar */}
      <div className="flex-1 max-w-xs flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700"
            style={{ width: `${completion}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{completion}%</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {parseMsg && (
          <span className={cn('text-xs font-medium', parseMsg.includes('success') ? 'text-emerald-500' : 'text-red-400')}>
            {parseMsg}
          </span>
        )}
        <button
          type="button" disabled={parsing}
          onClick={() => fileInputRef.current?.click()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          {parsing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
          {parsing ? 'Reading…' : 'Import PDF'}
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf" className="sr-only" onChange={onImport} />

        <button
          type="button" onClick={onTogglePreview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{previewOpen ? 'Hide' : 'Preview'}</span>
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SECTION RAIL (left icon strip)
═══════════════════════════════════════════ */
const SECTIONS = [
  { id: 'personal',  label: 'Personal',    icon: User },
  { id: 'summary',   label: 'Summary',     icon: Sparkles },
  { id: 'work',      label: 'Experience',  icon: Briefcase },
  { id: 'education', label: 'Education',   icon: GraduationCap },
  { id: 'skills',    label: 'Skills',      icon: Wrench },
  { id: 'languages', label: 'Languages',   icon: Languages },
  { id: 'certs',     label: 'Certificates',icon: Award },
]

function SectionRail({ activeId, onJump }: { activeId: string; onJump: (id: string) => void }) {
  return (
    <aside className="hidden lg:flex flex-col gap-1 py-4 px-1 sticky top-28 self-start">
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id} type="button" onClick={() => onJump(id)}
          title={label}
          className={cn(
            'group w-10 h-10 rounded-xl flex items-center justify-center transition-all relative',
            activeId === id
              ? 'bg-brand-500/15 text-brand-500 dark:text-brand-400'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-slate-200',
          )}
        >
          <Icon size={16} />
          {activeId === id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-brand-500" />
          )}
        </button>
      ))}
    </aside>
  )
}

/* ═══════════════════════════════════════════
   HERO card
═══════════════════════════════════════════ */
function Hero({ completion }: { completion: number }) {
  const p = useProfileStore((s) => s.personalInfo)
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo)
  const user = useAuthStore((s) => s.user)
  const fileRef = useRef<HTMLInputElement>(null)
  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'U'

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => updatePersonalInfo({ profilePicUrl: r.result as string })
    r.readAsDataURL(f)
    e.target.value = ''
  }

  return (
    <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-white/8 rounded-xl overflow-hidden">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-brand-600 via-brand-500 to-violet-500 relative">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
      </div>

      <div className="px-5 pb-5">
        <div className="flex flex-wrap items-end gap-4 -mt-10 mb-4">
          {/* Avatar */}
          <button
            type="button" onClick={() => fileRef.current?.click()}
            className="group relative w-20 h-20 rounded-2xl border-4 border-white dark:border-surface-800 bg-brand-500/20 overflow-hidden shadow-md flex items-center justify-center shrink-0"
          >
            {p.profilePicUrl
              ? <img src={p.profilePicUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              : <span className="text-2xl font-bold text-brand-600 dark:text-brand-300">{initials}</span>}
            <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-0.5">
              <Camera size={16} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Change</span>
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onFile} />
          </button>

          {/* Inline name/headline */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1">
              <input
                className="text-2xl font-bold text-slate-900 dark:text-slate-50 bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-white/15 focus:border-brand-500 focus:outline-none px-1 max-w-[180px] transition-colors"
                value={p.firstName} placeholder="First name"
                onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              />
              <input
                className="text-2xl font-bold text-slate-900 dark:text-slate-50 bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-white/15 focus:border-brand-500 focus:outline-none px-1 max-w-[180px] transition-colors"
                value={p.lastName} placeholder="Last name"
                onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              />
            </div>
            <input
              className="mt-1 w-full text-sm font-medium bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-white/15 focus:border-brand-500 focus:outline-none px-1 text-brand-600 dark:text-brand-400 placeholder:text-slate-400 transition-colors"
              value={p.headline} placeholder="Your job title or headline"
              onChange={(e) => updatePersonalInfo({ headline: e.target.value })}
            />
          </div>
        </div>

        {/* Completion */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            {completion}% complete
          </span>
          {completion === 100 && <Check size={14} className="text-emerald-500 shrink-0" />}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   PERSONAL SECTION
═══════════════════════════════════════════ */
function PersonalSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const p = useProfileStore((s) => s.personalInfo)
  const u = useProfileStore((s) => s.updatePersonalInfo)
  const set = (k: string, v: string) => u({ [k]: v } as never)
  return (
    <Section id="personal" label="Personal" icon={User} registerRef={registerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <F label="Email">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-slate-50 dark:bg-white/5 text-sm text-slate-500 dark:text-slate-400">
            {p.email || 'Not set'}
          </div>
        </F>
        <F label="Phone"><Input value={p.phone} placeholder="+356 7777 1234" onChange={(e) => set('phone', e.target.value)} /></F>
        <F label="City"><Input value={p.city} placeholder="Valletta" onChange={(e) => set('city', e.target.value)} /></F>
        <F label="Country"><Input value={p.country} placeholder="Malta" onChange={(e) => set('country', e.target.value)} /></F>
        <F label="LinkedIn"><Input value={p.linkedin} placeholder="linkedin.com/in/…" onChange={(e) => set('linkedin', e.target.value)} /></F>
        <F label="GitHub"><Input value={p.github} placeholder="github.com/…" onChange={(e) => set('github', e.target.value)} /></F>
        <F label="Date of Birth"><Input type="date" value={p.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} /></F>
        <F label="Nationality"><Input value={p.nationality} placeholder="Maltese" onChange={(e) => set('nationality', e.target.value)} /></F>
        <div className="sm:col-span-2">
          <F label="Website"><Input value={p.websites[0] ?? ''} placeholder="yoursite.com" onChange={(e) => u({ websites: [e.target.value] })} /></F>
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   SUMMARY SECTION
═══════════════════════════════════════════ */
function SummarySection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const summary = useProfileStore((s) => s.personalStatement)
  const setSummary = useProfileStore((s) => s.updatePersonalStatement)
  const [aiLoading, setAiLoading] = useState(false)
  const [streaming, setStreaming] = useState('')

  const simulate = () => {
    setAiLoading(true); setStreaming('')
    const p = useProfileStore.getState()
    const name = [p.personalInfo.firstName, p.personalInfo.lastName].filter(Boolean).join(' ')
    const role = p.personalInfo.headline
    const skills = p.digitalSkills.slice(0, 5).join(', ')
    const sample = `${name ? name + ' is' : 'A'} ${role || 'dedicated professional'} with a passion for delivering high-quality results. ${skills ? `Skilled in ${skills}, they` : 'They'} bring hands-on experience and a collaborative mindset to every challenge.`
    let i = 0
    const tick = () => {
      i = Math.min(sample.length, i + 3)
      setStreaming(sample.slice(0, i))
      if (i < sample.length) setTimeout(tick, 18)
      else { setSummary(sample); setStreaming(''); setAiLoading(false) }
    }
    tick()
  }

  const max = 600
  return (
    <Section
      id="summary" label="Summary" icon={Sparkles} registerRef={registerRef}
      action={
        <span className="px-1.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 text-[9px] font-bold uppercase tracking-wider">AI</span>
      }
    >
      <div className="space-y-3">
        {aiLoading && streaming ? (
          <div className={cn(inputCls, 'min-h-[80px] whitespace-pre-wrap')}>
            {streaming}<span className="border-r-2 border-brand-500 animate-pulse ml-0.5">&nbsp;</span>
          </div>
        ) : aiLoading ? (
          <div className="space-y-2 p-2">
            {[11, 10, 9].map((w) => <div key={w} className="h-3 rounded shimmer" style={{ width: `${w * 10}%` }} />)}
          </div>
        ) : (
          <Textarea value={summary} rows={3} maxLength={max} placeholder="A few sentences about who you are and what you bring." onChange={(e) => setSummary(e.target.value)} />
        )}
        <div className="flex items-center justify-between">
          <button
            type="button" onClick={simulate} disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/20 disabled:opacity-50 transition-colors"
          >
            <Sparkles size={12} />
            {aiLoading ? 'Generating…' : 'Generate with AI'}
          </button>
          <span className="text-[11px] text-slate-400">{summary.length}/{max}</span>
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   EXPERIENCE SECTION
═══════════════════════════════════════════ */
const emptyWork = (): Omit<WorkExperience, 'id'> => ({ jobTitle: '', company: '', location: '', fromDate: '', toDate: '', current: false, description: '', skills: [] })

function WorkForm({ initial, onSave, onCancel }: { initial: Omit<WorkExperience, 'id'>; onSave: (d: Omit<WorkExperience, 'id'>) => void; onCancel: () => void }) {
  const [d, setD] = useState(initial)
  const [skillInput, setSkillInput] = useState('')
  const f = (k: keyof typeof d, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  const addSkill = () => { const t = skillInput.trim(); if (t && !d.skills.includes(t)) { f('skills', [...d.skills, t]); setSkillInput('') } }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <F label="Job Title"><Input value={d.jobTitle} onChange={(e) => f('jobTitle', e.target.value)} /></F>
        <F label="Company"><Input value={d.company} onChange={(e) => f('company', e.target.value)} /></F>
      </div>
      <F label="Location"><Input value={d.location} placeholder="City, Country" onChange={(e) => f('location', e.target.value)} /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="From"><Input type="month" value={d.fromDate} onChange={(e) => f('fromDate', e.target.value)} /></F>
        <F label="To"><Input type="month" value={d.toDate} disabled={d.current} onChange={(e) => f('toDate', e.target.value)} /></F>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
        <input type="checkbox" checked={d.current} onChange={(e) => f('current', e.target.checked)} className="rounded text-brand-500" />
        Currently working here
      </label>
      <F label="Description (one bullet per line)">
        <Textarea rows={3} value={d.description} placeholder="• Led a team of engineers&#10;• Reduced load time by 40%" onChange={(e) => f('description', e.target.value)} />
      </F>
      <F label="Skills used">
        {d.skills.length > 0 && <div className="flex flex-wrap gap-1.5 mb-2">{d.skills.map((s) => <Tag key={s} label={s} onRemove={() => f('skills', d.skills.filter((x) => x !== s))} />)}</div>}
        <div className="flex gap-2">
          <Input value={skillInput} placeholder="e.g. React" onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
          <button type="button" onClick={addSkill} className="px-3 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs hover:bg-brand-500/20 transition-colors">Add</button>
        </div>
      </F>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={() => onSave(d)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function ExperienceSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const items = useProfileStore((s) => s.workExperiences)
  const add = useProfileStore((s) => s.addWorkExperience)
  const update = useProfileStore((s) => s.updateWorkExperience)
  const remove = useProfileStore((s) => s.removeWorkExperience)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  return (
    <Section id="work" label="Experience" icon={Briefcase} registerRef={registerRef}>
      <div className="space-y-3">
        {items.length === 0 && !adding && <p className="text-sm text-slate-400 italic">No experience added yet.</p>}
        {items.map((w) => editId === w.id ? (
          <div key={w.id} className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
            <WorkForm
              initial={{ jobTitle: w.jobTitle, company: w.company, location: w.location, fromDate: w.fromDate, toDate: w.toDate, current: w.current, description: w.description, skills: w.skills }}
              onSave={(d) => { update(w.id, d); setEditId(null) }} onCancel={() => setEditId(null)}
            />
          </div>
        ) : (
          <div key={w.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{w.jobTitle}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400">{w.company}</p>
              {w.location && <p className="text-xs text-slate-400">{w.location}</p>}
              <p className="text-xs text-slate-400 mt-0.5">{w.fromDate} – {w.current ? 'Present' : w.toDate}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => setEditId(w.id)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"><Pencil size={14} /></button>
              <button type="button" onClick={() => remove(w.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {adding ? (
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
            <WorkForm initial={emptyWork()} onSave={(d) => { add(d); setAdding(false) }} onCancel={() => setAdding(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-dashed border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-400 rounded-lg hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            <Plus size={14} /> Add Experience
          </button>
        )}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   EDUCATION SECTION
═══════════════════════════════════════════ */
const emptyEdu = (): Omit<Education, 'id'> => ({ qualification: '', institution: '', location: '', fromDate: '', toDate: '', current: false, notes: '' })

function EduForm({ initial, onSave, onCancel }: { initial: Omit<Education, 'id'>; onSave: (d: Omit<Education, 'id'>) => void; onCancel: () => void }) {
  const [d, setD] = useState(initial)
  const f = (k: keyof typeof d, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  return (
    <div className="space-y-3">
      <F label="Degree / Qualification"><Input value={d.qualification} placeholder="B.Sc. Computer Science" onChange={(e) => f('qualification', e.target.value)} /></F>
      <F label="Institution"><Input value={d.institution} onChange={(e) => f('institution', e.target.value)} /></F>
      <F label="Location"><Input value={d.location} placeholder="City, Country" onChange={(e) => f('location', e.target.value)} /></F>
      <div className="grid grid-cols-2 gap-3">
        <F label="From"><Input type="month" value={d.fromDate} onChange={(e) => f('fromDate', e.target.value)} /></F>
        <F label="To"><Input type="month" value={d.toDate} disabled={d.current} onChange={(e) => f('toDate', e.target.value)} /></F>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
        <input type="checkbox" checked={d.current} onChange={(e) => f('current', e.target.checked)} className="rounded text-brand-500" />
        Currently studying here
      </label>
      <F label="Notes / Achievements"><Textarea rows={2} value={d.notes} placeholder="Dean's List, GPA, thesis…" onChange={(e) => f('notes', e.target.value)} /></F>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={() => onSave(d)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function EducationSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const items = useProfileStore((s) => s.educations)
  const add = useProfileStore((s) => s.addEducation)
  const update = useProfileStore((s) => s.updateEducation)
  const remove = useProfileStore((s) => s.removeEducation)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  return (
    <Section id="education" label="Education" icon={GraduationCap} registerRef={registerRef}>
      <div className="space-y-3">
        {items.length === 0 && !adding && <p className="text-sm text-slate-400 italic">No education added yet.</p>}
        {items.map((e) => editId === e.id ? (
          <div key={e.id} className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
            <EduForm
              initial={{ qualification: e.qualification, institution: e.institution, location: e.location, fromDate: e.fromDate, toDate: e.toDate, current: e.current, notes: e.notes }}
              onSave={(d) => { update(e.id, d); setEditId(null) }} onCancel={() => setEditId(null)}
            />
          </div>
        ) : (
          <div key={e.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors">
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{e.qualification}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400">{e.institution}</p>
              {e.location && <p className="text-xs text-slate-400">{e.location}</p>}
              <p className="text-xs text-slate-400 mt-0.5">{e.fromDate} – {e.current ? 'Present' : e.toDate}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => setEditId(e.id)} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"><Pencil size={14} /></button>
              <button type="button" onClick={() => remove(e.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {adding ? (
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
            <EduForm initial={emptyEdu()} onSave={(d) => { add(d); setAdding(false) }} onCancel={() => setAdding(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-dashed border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-400 rounded-lg hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            <Plus size={14} /> Add Education
          </button>
        )}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   SKILLS SECTION
═══════════════════════════════════════════ */
function SkillsSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const skills = useProfileStore((s) => s.digitalSkills)
  const update = useProfileStore((s) => s.updateDigitalSkills)
  const [input, setInput] = useState('')
  const add = () => { const t = input.trim(); if (t && !skills.includes(t)) { update([...skills, t]); setInput('') } }
  return (
    <Section id="skills" label="Skills" icon={Wrench} registerRef={registerRef}>
      <div className="space-y-3">
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => <Tag key={s} label={s} onRemove={() => update(skills.filter((x) => x !== s))} />)}
          </div>
        )}
        <div className="flex gap-2">
          <Input value={input} placeholder="e.g. React, Figma, Excel" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} />
          <button type="button" onClick={add} className="px-3 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs hover:bg-brand-500/20 transition-colors">Add</button>
        </div>

        {/* Driving license */}
        <div className="pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">Driving License</p>
          <div className="flex flex-wrap gap-1.5">
            {DRIVING_CATS.map((cat) => {
              const active = useProfileStore.getState().drivingLicenseCategories.includes(cat)
              return (
                <label key={cat} className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border transition-colors select-none',
                  active ? 'bg-brand-500/15 border-brand-500/30 text-brand-600 dark:text-brand-400' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-brand-300',
                )}>
                  <input type="checkbox" className="sr-only" checked={active}
                    onChange={() => {
                      const dl = useProfileStore.getState().drivingLicenseCategories
                      useProfileStore.getState().updateDrivingLicense(active ? dl.filter((c) => c !== cat) : [...dl, cat])
                    }}
                  />
                  {cat}
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   LANGUAGES SECTION
═══════════════════════════════════════════ */
function LanguagesSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const motherTongue = useProfileStore((s) => s.motherTongue)
  const updateMother = useProfileStore((s) => s.updateMotherTongue)
  const langs = useProfileStore((s) => s.otherLanguages)
  const addLang = useProfileStore((s) => s.addLanguage)
  const removeLang = useProfileStore((s) => s.removeLanguage)
  const [name, setName] = useState('')
  const [prof, setProf] = useState<LanguageEntry['proficiency']>('Conversational')
  const add = () => { if (name.trim()) { addLang({ name: name.trim(), proficiency: prof }); setName('') } }
  return (
    <Section id="languages" label="Languages" icon={Languages} registerRef={registerRef}>
      <div className="space-y-3">
        <F label="Mother Tongue"><Input value={motherTongue} placeholder="e.g. Maltese" onChange={(e) => updateMother(e.target.value)} /></F>
        {langs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {langs.map((l) => <Tag key={l.id} label={`${l.name} — ${l.proficiency}`} onRemove={() => removeLang(l.id)} />)}
          </div>
        )}
        <div className="flex gap-2">
          <Input value={name} placeholder="Language" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())} />
          <select className={cn(inputCls, 'w-auto')} value={prof} onChange={(e) => setProf(e.target.value as LanguageEntry['proficiency'])}>
            {PROFICIENCIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="button" onClick={add} className="px-3 py-2 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-lg text-xs hover:bg-brand-500/20 transition-colors">Add</button>
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   CERTIFICATES SECTION
═══════════════════════════════════════════ */
function CertificatesSection({ registerRef }: { registerRef: (id: string, el: HTMLElement | null) => void }) {
  const certs = useProfileStore((s) => s.certifications)
  const add = useProfileStore((s) => s.addCertification)
  const remove = useProfileStore((s) => s.removeCertification)
  const [name, setName] = useState('')
  const [issuer, setIssuer] = useState('')
  const [year, setYear] = useState('')
  const save = () => { if (name.trim()) { add({ name: name.trim(), issuer: issuer.trim(), year: year.trim() }); setName(''); setIssuer(''); setYear('') } }
  return (
    <Section id="certs" label="Certificates" icon={Award} registerRef={registerRef}>
      <div className="space-y-3">
        {certs.length > 0 && (
          <div className="space-y-2">
            {certs.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{c.name}</span>
                  {(c.issuer || c.year) && <span className="text-xs text-slate-400 ml-2">{[c.issuer, c.year].filter(Boolean).join(', ')}</span>}
                </div>
                <button type="button" onClick={() => remove(c.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Certificate name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
          <Input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <button type="button" onClick={save} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-dashed border-slate-300 dark:border-white/15 text-slate-500 dark:text-slate-400 rounded-lg hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          <Plus size={14} /> Add Certificate
        </button>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════ */
export default function MyProfilePage() {
  const [previewOpen, setPreviewOpen] = useState(true)
  const [activeId, setActiveId] = useState('personal')
  const [parsing, setParsing] = useState(false)
  const [parseMsg, setParseMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})
  const completion = useCompletion()

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current[id] = el
  }, [])

  /* Scroll-spy */
  useEffect(() => {
    const onScroll = () => {
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id]
        if (el && el.getBoundingClientRect().top < 160) current = s.id
      }
      setActiveId(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jumpTo = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = ''; if (!file) return
    setParsing(true); setParseMsg('')
    try {
      const text = await extractPdfText(file)
      const parsed = parseCvText(text)
      const store = useProfileStore.getState()
      const { firstName, lastName } = parsed.personalInfo
      store.updatePersonalInfo({
        ...(parsed.personalInfo as Parameters<typeof store.updatePersonalInfo>[0]),
        ...(store.personalInfo.firstName ? {} : { firstName }),
        ...(store.personalInfo.lastName  ? {} : { lastName }),
      })
      if (parsed.personalStatement) store.updatePersonalStatement(parsed.personalStatement)
      parsed.workExperiences.forEach((w) => store.addWorkExperience(w))
      parsed.educations.forEach((ed) => store.addEducation(ed))
      if (parsed.digitalSkills.length) store.updateDigitalSkills(parsed.digitalSkills)
      if (parsed.motherTongue) store.updateMotherTongue(parsed.motherTongue)
      parsed.otherLanguages.forEach((l) => store.addLanguage(l))
      parsed.certifications.forEach((c) => store.addCertification(c))
      setParseMsg('Imported successfully!')
    } catch {
      setParseMsg('Could not read PDF.')
    } finally {
      setParsing(false)
      setTimeout(() => setParseMsg(''), 4000)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-950" data-theme-transition>
      <TopBar
        completion={completion}
        previewOpen={previewOpen}
        onTogglePreview={() => setPreviewOpen((v) => !v)}
        fileInputRef={fileInputRef}
        parsing={parsing}
        parseMsg={parseMsg}
        onImport={handleImport}
      />

      <div className={cn(
        'max-w-[1600px] mx-auto grid transition-all duration-300',
        previewOpen
          ? 'lg:grid-cols-[48px_minmax(0,1fr)_minmax(0,520px)]'
          : 'lg:grid-cols-[48px_minmax(0,1fr)]',
      )}>
        {/* Rail */}
        <SectionRail activeId={activeId} onJump={jumpTo} />

        {/* Editor */}
        <main className="px-4 sm:px-6 py-6 space-y-5 min-w-0">
          <Hero completion={completion} />
          <PersonalSection registerRef={registerRef} />
          <SummarySection registerRef={registerRef} />
          <ExperienceSection registerRef={registerRef} />
          <EducationSection registerRef={registerRef} />
          <SkillsSection registerRef={registerRef} />
          <LanguagesSection registerRef={registerRef} />
          <CertificatesSection registerRef={registerRef} />
        </main>

        {/* CV Preview */}
        {previewOpen && (
          <aside className="hidden lg:flex flex-col border-l border-slate-200 dark:border-white/8 sticky top-28 self-start h-[calc(100vh-7rem)]">
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-white/8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Live Preview</span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 text-[9px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Auto
                </span>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CvPreview />
            </div>
          </aside>
        )}

        {/* Collapsed preview tab */}
        {!previewOpen && (
          <button
            type="button" onClick={() => setPreviewOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-1 py-3 px-1.5 rounded-l-xl border border-r-0 border-slate-200 dark:border-white/10 bg-white dark:bg-surface-800 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 shadow-lg transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Preview</span>
          </button>
        )}
      </div>
    </div>
  )
}
