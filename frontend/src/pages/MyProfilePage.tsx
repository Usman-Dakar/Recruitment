import { useState, useRef } from 'react'
import { Plus, Trash2, Pencil, X, MapPin, Mail, Phone, Globe, Edit3, ArrowLeft, Calendar, User as UserIcon, Download, Link, FileUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { inputClass, labelClass } from '@/lib/formStyles'
import { useProfileStore } from '@/store/profileStore'
import { useAuthStore } from '@/store/authStore'
import CvPreview from '@/components/cv/CvPreview'
import AvatarUpload from '@/components/profile/AvatarUpload'
import { extractPdfText, parseCvText } from '@/lib/parseCv'
import type { WorkExperience, Education, LanguageEntry } from '@/types'

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */

const PROFICIENCIES: LanguageEntry['proficiency'][] = ['Basic', 'Conversational', 'Proficient', 'Fluent', 'Native']
const DRIVING_CATS = ['AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE']

function Field({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs rounded-full">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className="text-brand-400/60 hover:text-red-400 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

/* ─────────────────────────────────────────────
   Profile View (default)
───────────────────────────────────────────── */

function ProfileView({ onEdit }: { onEdit: () => void }) {
  const p = useProfileStore((s) => s.personalInfo)
  const statement = useProfileStore((s) => s.personalStatement)
  const workExp = useProfileStore((s) => s.workExperiences)
  const educations = useProfileStore((s) => s.educations)
  const skills = useProfileStore((s) => s.digitalSkills)
  const motherTongue = useProfileStore((s) => s.motherTongue)
  const langs = useProfileStore((s) => s.otherLanguages)
  const certs = useProfileStore((s) => s.certifications)
  const license = useProfileStore((s) => s.drivingLicenseCategories)
  const user = useAuthStore((s) => s.user)

  const [tab, setTab] = useState<'about' | 'timeline'>('about')

  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || user?.displayName || 'Your Name'
  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || (user?.firstName?.[0] ?? 'U').toUpperCase()
  const hasProfile = !!(p.firstName || p.lastName || p.headline)

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
          <UserIcon className="w-8 h-8 text-brand-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Build your CV</h1>
        <p className="text-slate-400 text-sm mb-8">
          You haven't set up your profile yet. Fill in your details and generate a professional CV.
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-400 transition-colors"
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
          Get Started
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Profile header card ── */}
      <div className="glass rounded-2xl overflow-hidden mb-6">
        {/* Cover strip */}
        <div className="h-24 bg-gradient-to-r from-brand-600/60 via-brand-500/40 to-violet-600/30" />

        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-10 mb-4">
            {/* Avatar */}
            <AvatarUpload initials={initials} size="lg" rounded="2xl" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {p.cvUrl && (
                <a
                  href={p.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 glass rounded-lg border border-white/10 text-sm text-slate-300 hover:text-white hover:border-brand-500/30 transition-colors"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download CV
                </a>
              )}
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" aria-hidden="true" />
                Edit CV
              </button>
            </div>
          </div>

          {/* Name + headline */}
          <div className="mb-3">
            <h1 className="text-xl font-bold text-slate-100">{fullName}</h1>
            {p.headline && (
              <p className="text-sm text-brand-400 mt-0.5 font-medium">{p.headline}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              {(p.city || p.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {[p.city, p.country].filter(Boolean).join(', ')}
                </span>
              )}
              {p.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" aria-hidden="true" />
                  {p.email}
                </span>
              )}
              {p.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" aria-hidden="true" />
                  {p.phone}
                </span>
              )}
            </div>
          </div>

          {/* Statement */}
          {statement && (
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{statement}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-white/5 px-6">
          {(['about', 'timeline'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2',
                tab === t
                  ? 'text-brand-400 border-brand-500'
                  : 'text-slate-400 hover:text-slate-200 border-transparent',
              )}
            >
              {t === 'timeline' ? 'Timeline' : 'About'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">

        {/* Left sidebar */}
        <div className="space-y-5">
          {/* Work history */}
          {workExp.length > 0 && (
            <div className="glass rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Work</p>
              <div className="space-y-4">
                {workExp.map((w, i) => (
                  <div key={w.id}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 text-sm leading-snug">{w.company}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{w.jobTitle}</p>
                        {w.location && <p className="text-xs text-slate-500 mt-0.5">{w.location}</p>}
                      </div>
                      <span className={cn(
                        'shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                        i === 0 || w.current
                          ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                          : 'bg-surface-600/50 border-white/10 text-slate-500',
                      )}>
                        {w.current ? 'Current' : i === 0 ? 'Primary' : 'Secondary'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="glass rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Skills</p>
              <div className="space-y-1.5">
                {skills.map((s) => (
                  <p key={s} className="text-sm text-slate-300">{s}</p>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {(motherTongue || langs.length > 0) && (
            <div className="glass rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Languages</p>
              <div className="space-y-1.5">
                {motherTongue && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">{motherTongue}</span>
                    <span className="text-xs text-brand-400">Native</span>
                  </div>
                )}
                {langs.map((l) => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span className="text-slate-300">{l.name}</span>
                    <span className="text-xs text-slate-500">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Driving license */}
          {license.length > 0 && (
            <div className="glass rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Driving License</p>
              <div className="flex flex-wrap gap-1.5">
                {license.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs rounded-full font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main */}
        <div className="space-y-5">

          {tab === 'about' && (
            <>
              {/* Contact info */}
              <div className="glass rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact Information</p>
                <div className="space-y-3">
                  {p.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm text-brand-400">{p.phone}</p>
                      </div>
                    </div>
                  )}
                  {p.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">Address</p>
                        <p className="text-sm text-slate-300">{p.address}{p.city ? `, ${p.city}` : ''}{p.postalCode ? ` ${p.postalCode}` : ''}</p>
                      </div>
                    </div>
                  )}
                  {p.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">E-mail</p>
                        <a href={`mailto:${p.email}`} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">{p.email}</a>
                      </div>
                    </div>
                  )}
                  {p.linkedin && (
                    <div className="flex items-center gap-3">
                      <Link className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">LinkedIn</p>
                        <a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">{p.linkedin.replace(/^https?:\/\//, '')}</a>
                      </div>
                    </div>
                  )}
                  {p.github && (
                    <div className="flex items-center gap-3">
                      <Link className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">GitHub</p>
                        <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">{p.github.replace(/^https?:\/\//, '')}</a>
                      </div>
                    </div>
                  )}
                  {p.websites[0] && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-xs text-slate-500">Site</p>
                        <a href={p.websites[0].startsWith('http') ? p.websites[0] : `https://${p.websites[0]}`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">{p.websites[0].replace(/^https?:\/\//, '')}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic info */}
              {(p.dateOfBirth || p.gender || p.nationality || p.idCardNo) && (
                <div className="glass rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Basic Information</p>
                  <div className="space-y-3">
                    {p.dateOfBirth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-slate-500">Birthday</p>
                          <p className="text-sm text-slate-300">{new Date(p.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                    )}
                    {p.gender && (
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <div>
                          <p className="text-xs text-slate-500">Gender</p>
                          <p className="text-sm text-slate-300">{p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'}</p>
                        </div>
                      </div>
                    )}
                    {p.nationality && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Nationality</p>
                        <p className="text-sm text-slate-300 ml-7">{p.nationality}</p>
                      </div>
                    )}
                    {p.idCardNo && (
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">ID / Passport</p>
                        <p className="text-sm text-slate-300 ml-7">{p.idCardNo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certs.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Certifications</p>
                  <div className="space-y-2">
                    {certs.map((c) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{c.name}</span>
                        {(c.issuer || c.year) && (
                          <span className="text-xs text-slate-500">{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'timeline' && (
            <div className="space-y-5">
              {/* Work timeline */}
              {workExp.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Work Experience</p>
                  <div className="relative pl-5 space-y-6 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-white/10">
                    {workExp.map((w) => {
                      const bullets = w.description
                        ? w.description.split('\n').map((l) => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
                        : []
                      return (
                        <div key={w.id} className="relative before:absolute before:-left-[15px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-brand-500 before:ring-4 before:ring-surface-900">
                          <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <div>
                              <span className="font-semibold text-slate-200 text-sm">{w.jobTitle}</span>
                              {w.company && <span className="text-sm text-brand-400"> — {w.company}</span>}
                            </div>
                            <span className="text-xs text-slate-500 shrink-0">
                              {w.fromDate} – {w.current ? 'Present' : w.toDate}
                            </span>
                          </div>
                          {w.location && <p className="text-xs text-slate-500 mt-0.5">{w.location}</p>}
                          {bullets.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-slate-400 list-disc list-inside">
                              {bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          )}
                          {w.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {w.skills.map((s) => (
                                <span key={s} className="text-[10px] px-2 py-0.5 bg-surface-600/60 border border-white/5 text-slate-400 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Education timeline */}
              {educations.length > 0 && (
                <div className="glass rounded-xl p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Education</p>
                  <div className="relative pl-5 space-y-6 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-white/10">
                    {educations.map((e) => (
                      <div key={e.id} className="relative before:absolute before:-left-[15px] before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-violet-500 before:ring-4 before:ring-surface-900">
                        <div className="flex items-baseline justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-semibold text-slate-200 text-sm">{e.qualification}</span>
                            {e.institution && <span className="text-sm text-brand-400"> — {e.institution}</span>}
                          </div>
                          <span className="text-xs text-slate-500 shrink-0">
                            {e.fromDate} – {e.current ? 'Present' : e.toDate}
                          </span>
                        </div>
                        {e.location && <p className="text-xs text-slate-500 mt-0.5">{e.location}</p>}
                        {e.notes && <p className="text-xs text-slate-400 mt-1">{e.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!workExp.length && !educations.length && (
                <div className="glass rounded-xl p-10 text-center">
                  <p className="text-sm text-slate-500">No timeline entries yet.</p>
                  <button type="button" onClick={onEdit} className="mt-3 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Add work experience or education →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CV Builder — About Me tab
───────────────────────────────────────────── */

function AboutTab() {
  const user = useAuthStore((s) => s.user)
  const p = useProfileStore((s) => s.personalInfo)
  const ps = useProfileStore((s) => s.personalStatement)
  const updatePersonalInfo = useProfileStore((s) => s.updatePersonalInfo)
  const updatePersonalStatement = useProfileStore((s) => s.updatePersonalStatement)

  const initials = `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase() || (user?.firstName?.[0] ?? 'U').toUpperCase()
  const set = (field: string, value: string) => updatePersonalInfo({ [field]: value } as never)

  return (
    <div className="space-y-4 p-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" id="ab-fn">
          <input
            id="ab-fn"
            className={p.firstName ? `${inputClass} opacity-60 cursor-not-allowed` : inputClass}
            value={p.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            readOnly={!!p.firstName}
            title={p.firstName ? 'First name cannot be changed once set' : undefined}
          />
        </Field>
        <Field label="Last Name" id="ab-ln">
          <input id="ab-ln" className={inputClass} value={p.lastName} onChange={(e) => set('lastName', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job Title / Headline" id="ab-hl">
          <input id="ab-hl" className={inputClass} placeholder="e.g. Senior Developer" value={p.headline} onChange={(e) => set('headline', e.target.value)} />
        </Field>
        <Field label="Email">
          <div className={inputClass + ' opacity-50 cursor-not-allowed text-slate-400'}>{user?.email || p.email || '—'}</div>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Phone" id="ab-ph">
          <input id="ab-ph" type="tel" className={inputClass} placeholder="+1 (555) 123-4567" value={p.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="City" id="ab-cy">
          <input id="ab-cy" className={inputClass} placeholder="e.g. San Francisco" value={p.city} onChange={(e) => set('city', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="LinkedIn" id="ab-li">
          <input id="ab-li" className={inputClass} placeholder="linkedin.com/in/username" value={p.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
        </Field>
        <Field label="GitHub" id="ab-gh">
          <input id="ab-gh" className={inputClass} placeholder="github.com/username" value={p.github} onChange={(e) => set('github', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Website" id="ab-ws">
          <input id="ab-ws" type="url" className={inputClass} placeholder="yourwebsite.com"
            value={p.websites[0] ?? ''} onChange={(e) => updatePersonalInfo({ websites: [e.target.value] })} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Profile Picture</span>
          <AvatarUpload initials={initials} size="md" rounded="full" />
        </div>
      </div>
      <Field label="About Me" id="ab-ps">
        <textarea id="ab-ps" rows={5} maxLength={1000} placeholder="Write a brief summary about yourself…"
          className={inputClass + ' resize-none'} value={ps} onChange={(e) => updatePersonalStatement(e.target.value)} />
        <p className="text-right text-xs text-slate-600 mt-1">{ps.length}/1000</p>
      </Field>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CV Builder — Work Experience tab
───────────────────────────────────────────── */

const emptyWork = (): Omit<WorkExperience, 'id'> => ({
  jobTitle: '', company: '', location: '', fromDate: '', toDate: '',
  current: false, description: '', skills: [],
})

function WorkForm({ initial, onSave, onCancel }: {
  initial: Omit<WorkExperience, 'id'>
  onSave: (d: Omit<WorkExperience, 'id'>) => void
  onCancel: () => void
}) {
  const [d, setD] = useState(initial)
  const [skillInput, setSkillInput] = useState('')
  const f = (k: keyof typeof d, v: unknown) => setD((p) => ({ ...p, [k]: v }))

  const addSkill = () => {
    const t = skillInput.trim()
    if (t && !d.skills.includes(t)) { f('skills', [...d.skills, t]); setSkillInput('') }
  }

  return (
    <div className="space-y-3 pt-2 pb-1">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Job Title" id="wf-jt"><input id="wf-jt" className={inputClass} value={d.jobTitle} onChange={(e) => f('jobTitle', e.target.value)} /></Field>
        <Field label="Company" id="wf-co"><input id="wf-co" className={inputClass} value={d.company} onChange={(e) => f('company', e.target.value)} /></Field>
      </div>
      <Field label="Location" id="wf-lo"><input id="wf-lo" className={inputClass} placeholder="e.g. San Francisco, CA" value={d.location} onChange={(e) => f('location', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From" id="wf-fr"><input id="wf-fr" type="month" className={inputClass} value={d.fromDate} onChange={(e) => f('fromDate', e.target.value)} /></Field>
        <Field label="To" id="wf-to"><input id="wf-to" type="month" className={inputClass} value={d.toDate} disabled={d.current} onChange={(e) => f('toDate', e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
        <input type="checkbox" className="w-4 h-4 rounded bg-surface-700 border-white/20 text-brand-500 focus:ring-brand-500" checked={d.current} onChange={(e) => f('current', e.target.checked)} />
        Currently working here
      </label>
      <Field label="Description (one bullet per line)" id="wf-de">
        <textarea id="wf-de" rows={4} className={inputClass + ' resize-none'} placeholder="• Led a team of engineers&#10;• Reduced bundle size by 40%"
          value={d.description} onChange={(e) => f('description', e.target.value)} />
      </Field>
      <Field label="Skills / Technologies">
        {d.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {d.skills.map((s) => <Tag key={s} label={s} onRemove={() => f('skills', d.skills.filter((x) => x !== s))} />)}
          </div>
        )}
        <div className="flex gap-2">
          <input className={inputClass + ' flex-1'} placeholder="e.g. React" value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
          <button type="button" onClick={addSkill} className="px-3 py-2 bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-lg text-xs hover:bg-brand-500/30 transition-colors">Add</button>
        </div>
      </Field>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={() => onSave(d)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function WorkTab() {
  const workExperiences = useProfileStore((s) => s.workExperiences)
  const addWorkExperience = useProfileStore((s) => s.addWorkExperience)
  const updateWorkExperience = useProfileStore((s) => s.updateWorkExperience)
  const removeWorkExperience = useProfileStore((s) => s.removeWorkExperience)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)

  return (
    <div className="p-5 space-y-3">
      {workExperiences.length === 0 && !addingNew && <p className="text-sm text-slate-500 italic">No work experience added yet.</p>}
      {workExperiences.map((w) =>
        editingId === w.id ? (
          <div key={w.id} className="glass rounded-xl p-4">
            <WorkForm initial={{ jobTitle: w.jobTitle, company: w.company, location: w.location, fromDate: w.fromDate, toDate: w.toDate, current: w.current, description: w.description, skills: w.skills }}
              onSave={(d) => { updateWorkExperience(w.id, d); setEditingId(null) }} onCancel={() => setEditingId(null)} />
          </div>
        ) : (
          <div key={w.id} className="glass rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-200 text-sm">{w.jobTitle}</p>
              <p className="text-xs text-brand-400">{w.company}</p>
              {w.location && <p className="text-xs text-slate-500">{w.location}</p>}
              <p className="text-xs text-slate-500 mt-0.5">{w.fromDate} – {w.current ? 'Present' : w.toDate}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => setEditingId(w.id)} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => removeWorkExperience(w.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )
      )}
      {addingNew ? (
        <div className="glass rounded-xl p-4">
          <WorkForm initial={emptyWork()} onSave={(d) => { addWorkExperience(d); setAddingNew(false) }} onCancel={() => setAddingNew(false)} />
        </div>
      ) : (
        <button type="button" onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium glass rounded-lg border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Work Experience
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   CV Builder — Education tab
───────────────────────────────────────────── */

const emptyEdu = (): Omit<Education, 'id'> => ({
  qualification: '', institution: '', location: '', fromDate: '', toDate: '', current: false, notes: '',
})

function EduForm({ initial, onSave, onCancel }: {
  initial: Omit<Education, 'id'>
  onSave: (d: Omit<Education, 'id'>) => void
  onCancel: () => void
}) {
  const [d, setD] = useState(initial)
  const f = (k: keyof typeof d, v: unknown) => setD((p) => ({ ...p, [k]: v }))
  return (
    <div className="space-y-3 pt-2 pb-1">
      <Field label="Degree / Qualification" id="ef-dg"><input id="ef-dg" className={inputClass} placeholder="e.g. B.Sc. Computer Science" value={d.qualification} onChange={(e) => f('qualification', e.target.value)} /></Field>
      <Field label="Institution" id="ef-in"><input id="ef-in" className={inputClass} value={d.institution} onChange={(e) => f('institution', e.target.value)} /></Field>
      <Field label="Location" id="ef-lo"><input id="ef-lo" className={inputClass} placeholder="e.g. Berkeley, CA" value={d.location} onChange={(e) => f('location', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From" id="ef-fr"><input id="ef-fr" type="month" className={inputClass} value={d.fromDate} onChange={(e) => f('fromDate', e.target.value)} /></Field>
        <Field label="To" id="ef-to"><input id="ef-to" type="month" className={inputClass} value={d.toDate} disabled={d.current} onChange={(e) => f('toDate', e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
        <input type="checkbox" className="w-4 h-4 rounded bg-surface-700 border-white/20 text-brand-500 focus:ring-brand-500" checked={d.current} onChange={(e) => f('current', e.target.checked)} />
        Currently studying here
      </label>
      <Field label="Notes / Achievements" id="ef-no">
        <textarea id="ef-no" rows={2} className={inputClass + ' resize-none'} placeholder="e.g. Dean's List 2017–2019" value={d.notes} onChange={(e) => f('notes', e.target.value)} />
      </Field>
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={() => onSave(d)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function EducationTab() {
  const educations = useProfileStore((s) => s.educations)
  const addEducation = useProfileStore((s) => s.addEducation)
  const updateEducation = useProfileStore((s) => s.updateEducation)
  const removeEducation = useProfileStore((s) => s.removeEducation)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)

  return (
    <div className="p-5 space-y-3">
      {educations.length === 0 && !addingNew && <p className="text-sm text-slate-500 italic">No education history added yet.</p>}
      {educations.map((e) =>
        editingId === e.id ? (
          <div key={e.id} className="glass rounded-xl p-4">
            <EduForm initial={{ qualification: e.qualification, institution: e.institution, location: e.location, fromDate: e.fromDate, toDate: e.toDate, current: e.current, notes: e.notes }}
              onSave={(d) => { updateEducation(e.id, d); setEditingId(null) }} onCancel={() => setEditingId(null)} />
          </div>
        ) : (
          <div key={e.id} className="glass rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-200 text-sm">{e.qualification}</p>
              <p className="text-xs text-brand-400">{e.institution}</p>
              {e.location && <p className="text-xs text-slate-500">{e.location}</p>}
              <p className="text-xs text-slate-500 mt-0.5">{e.fromDate} – {e.current ? 'Present' : e.toDate}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button type="button" onClick={() => setEditingId(e.id)} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => removeEducation(e.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )
      )}
      {addingNew ? (
        <div className="glass rounded-xl p-4">
          <EduForm initial={emptyEdu()} onSave={(d) => { addEducation(d); setAddingNew(false) }} onCancel={() => setAddingNew(false)} />
        </div>
      ) : (
        <button type="button" onClick={() => setAddingNew(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium glass rounded-lg border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   CV Builder — Skills tab
───────────────────────────────────────────── */

function SkillsTab() {
  const digitalSkills = useProfileStore((s) => s.digitalSkills)
  const updateDigitalSkills = useProfileStore((s) => s.updateDigitalSkills)
  const motherTongue = useProfileStore((s) => s.motherTongue)
  const updateMotherTongue = useProfileStore((s) => s.updateMotherTongue)
  const otherLanguages = useProfileStore((s) => s.otherLanguages)
  const addLanguage = useProfileStore((s) => s.addLanguage)
  const removeLanguage = useProfileStore((s) => s.removeLanguage)
  const drivingLicense = useProfileStore((s) => s.drivingLicenseCategories)
  const updateDrivingLicense = useProfileStore((s) => s.updateDrivingLicense)
  const certifications = useProfileStore((s) => s.certifications)
  const addCertification = useProfileStore((s) => s.addCertification)
  const removeCertification = useProfileStore((s) => s.removeCertification)

  const [skillInput, setSkillInput] = useState('')
  const [langName, setLangName] = useState('')
  const [langProf, setLangProf] = useState<LanguageEntry['proficiency']>('Conversational')
  const [certName, setCertName] = useState('')
  const [certIssuer, setCertIssuer] = useState('')
  const [certYear, setCertYear] = useState('')

  const addSkill = () => {
    const t = skillInput.trim()
    if (t && !digitalSkills.includes(t)) { updateDigitalSkills([...digitalSkills, t]); setSkillInput('') }
  }
  const addLang = () => {
    if (langName.trim()) { addLanguage({ name: langName.trim(), proficiency: langProf }); setLangName('') }
  }
  const addCert = () => {
    if (certName.trim()) { addCertification({ name: certName.trim(), issuer: certIssuer.trim(), year: certYear.trim() }); setCertName(''); setCertIssuer(''); setCertYear('') }
  }
  const toggleDriving = (cat: string) =>
    updateDrivingLicense(drivingLicense.includes(cat) ? drivingLicense.filter((c) => c !== cat) : [...drivingLicense, cat])

  return (
    <div className="p-5 space-y-6">
      <div>
        <p className={labelClass + ' mb-2'}>Digital Skills</p>
        {digitalSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {digitalSkills.map((s) => <Tag key={s} label={s} onRemove={() => updateDigitalSkills(digitalSkills.filter((x) => x !== s))} />)}
          </div>
        )}
        <div className="flex gap-2">
          <input className={inputClass + ' flex-1'} placeholder="e.g. React, Excel, Figma" value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
          <button type="button" onClick={addSkill} className="px-3 py-2 bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-lg text-xs hover:bg-brand-500/30 transition-colors">Add</button>
        </div>
      </div>

      <div>
        <p className={labelClass + ' mb-2'}>Languages</p>
        <Field label="Mother Tongue" id="sk-mt">
          <input id="sk-mt" className={inputClass} placeholder="e.g. Maltese" value={motherTongue} onChange={(e) => updateMotherTongue(e.target.value)} />
        </Field>
        {otherLanguages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-2">
            {otherLanguages.map((l) => <Tag key={l.id} label={`${l.name} — ${l.proficiency}`} onRemove={() => removeLanguage(l.id)} />)}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <input className={inputClass + ' flex-1'} placeholder="Language" value={langName}
            onChange={(e) => setLangName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLang())} />
          <select className={inputClass + ' w-auto'} value={langProf} onChange={(e) => setLangProf(e.target.value as LanguageEntry['proficiency'])}>
            {PROFICIENCIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button type="button" onClick={addLang} className="px-3 py-2 bg-brand-500/20 border border-brand-500/30 text-brand-400 rounded-lg text-xs hover:bg-brand-500/30 transition-colors">Add</button>
        </div>
      </div>

      <div>
        <p className={labelClass + ' mb-2'}>Certifications</p>
        {certifications.length > 0 && (
          <div className="space-y-1.5 mb-2">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm text-slate-200">{c.name}</span>
                  {(c.issuer || c.year) && <span className="text-xs text-slate-500 ml-2">{[c.issuer, c.year].filter(Boolean).join(', ')}</span>}
                </div>
                <button type="button" onClick={() => removeCertification(c.id)} className="text-slate-500 hover:text-red-400 transition-colors ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <input className={inputClass} placeholder="Cert. name" value={certName} onChange={(e) => setCertName(e.target.value)} />
          <input className={inputClass} placeholder="Issuer" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} />
          <input className={inputClass} placeholder="Year" value={certYear} onChange={(e) => setCertYear(e.target.value)} />
        </div>
        <button type="button" onClick={addCert} className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs font-medium glass rounded-lg border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>

      <div>
        <p className={labelClass + ' mb-2'}>Driving License</p>
        <div className="flex flex-wrap gap-1.5">
          {DRIVING_CATS.map((cat) => (
            <label key={cat} className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors select-none',
              drivingLicense.includes(cat) ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'glass border-white/10 text-slate-400 hover:border-brand-500/20'
            )}>
              <input type="checkbox" className="sr-only" checked={drivingLicense.includes(cat)} onChange={() => toggleDriving(cat)} />
              {cat}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   CV Builder view (split layout)
───────────────────────────────────────────── */

type TabId = 'about' | 'work' | 'education' | 'skills'
const TABS: { id: TabId; label: string }[] = [
  { id: 'about',     label: 'About Me'        },
  { id: 'work',      label: 'Work Experience' },
  { id: 'education', label: 'Education'       },
  { id: 'skills',    label: 'Skills'          },
]

function CvBuilderView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('about')
  const [parsing, setParsing] = useState(false)
  const [parseMsg, setParseMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    updatePersonalInfo, updatePersonalStatement,
    addWorkExperience, addEducation,
    updateDigitalSkills, addLanguage, addCertification,
    updateMotherTongue, updateDrivingLicense,
  } = useProfileStore()

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setParsing(true)
    setParseMsg('')
    try {
      const text   = await extractPdfText(file)
      const parsed = parseCvText(text)

      // Fill personal info (skip firstName/lastName if already locked)
      const { firstName, lastName, ...restInfo } = parsed.personalInfo
      const store = useProfileStore.getState()
      updatePersonalInfo({
        ...(restInfo as Parameters<typeof updatePersonalInfo>[0]),
        ...(store.personalInfo.firstName ? {} : { firstName }),
        ...(store.personalInfo.lastName  ? {} : { lastName  }),
      })

      if (parsed.personalStatement)             updatePersonalStatement(parsed.personalStatement)
      parsed.workExperiences.forEach(w         => addWorkExperience(w))
      parsed.educations.forEach(e              => addEducation(e))
      if (parsed.digitalSkills.length)          updateDigitalSkills(parsed.digitalSkills)
      if (parsed.motherTongue)                  updateMotherTongue(parsed.motherTongue)
      parsed.otherLanguages.forEach(l          => addLanguage(l))
      parsed.certifications.forEach(c          => addCertification(c))
      if (parsed.drivingLicenseCategories.length) updateDrivingLicense(parsed.drivingLicenseCategories)

      setParseMsg('CV imported successfully!')
    } catch {
      setParseMsg('Could not read the PDF. Please try another file.')
    } finally {
      setParsing(false)
      setTimeout(() => setParseMsg(''), 4000)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex h-full min-h-0">
        {/* Left: live preview */}
        <div className="hidden lg:flex flex-col w-[55%] border-r border-white/10 min-w-0">
          <CvPreview />
        </div>

        {/* Right: editor */}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <div className="flex items-center gap-1 px-4 border-b border-white/10 shrink-0 h-12">
            <button type="button" onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mr-3">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Profile
            </button>
            <div className="w-px h-4 bg-white/10 mr-2" />
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                  activeTab === t.id
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                )}>
                {t.label}
              </button>
            ))}
            {/* Import PDF */}
            <div className="ml-auto flex items-center gap-2">
              {parseMsg && (
                <span className={cn(
                  'text-xs font-medium',
                  parseMsg.includes('success') ? 'text-emerald-400' : 'text-red-400',
                )}>
                  {parseMsg}
                </span>
              )}
              <button
                type="button"
                disabled={parsing}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-white/10 text-slate-300 rounded-lg hover:bg-white/5 disabled:opacity-50 transition-colors"
                title="Import fields from a PDF CV"
              >
                {parsing
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  : <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
                }
                {parsing ? 'Reading…' : 'Import PDF'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleImport}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'about'     && <AboutTab />}
            {activeTab === 'work'      && <WorkTab />}
            {activeTab === 'education' && <EducationTab />}
            {activeTab === 'skills'    && <SkillsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Page — toggles between profile view and builder
───────────────────────────────────────────── */

export default function MyProfilePage() {
  const [mode, setMode] = useState<'profile' | 'builder'>('profile')

  if (mode === 'builder') {
    return <CvBuilderView onBack={() => setMode('profile')} />
  }

  return <ProfileView onEdit={() => setMode('builder')} />
}
