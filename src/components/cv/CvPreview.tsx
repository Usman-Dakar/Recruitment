import { useRef } from 'react'
import { Printer, Download } from 'lucide-react'
import { useProfileStore } from '@/store/profileStore'

// html2pdf.js ships no TS types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any

const ACCENT = '#7c3aed'

function fmt(str: string) {
  if (!str) return ''
  const [y, m] = str.split('-')
  if (!y) return str
  if (!m) return y
  return new Date(+y, +m - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <h2 style={{
        margin: 0, fontSize: 13.5, fontWeight: 700,
        color: '#111827', fontFamily: '"Inter", system-ui, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1.5, background: ACCENT, opacity: 0.35 }} />
    </div>
  )
}

/* ── shared print/save styles injected into the popup ── */
const PRINT_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0; padding: 0;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 13px; }
  ul  { margin: 4px 0 0; padding-left: 16px; }
  li  { margin-bottom: 3px; }
  /* strip the on-screen shadow & radius */
  #cv-paper { box-shadow: none !important; border-radius: 0 !important; }
`

export default function CvPreview() {
  const paperRef = useRef<HTMLDivElement>(null)

  const p           = useProfileStore((s) => s.personalInfo)
  const statement   = useProfileStore((s) => s.personalStatement)
  const workExp     = useProfileStore((s) => s.workExperiences)
  const edus        = useProfileStore((s) => s.educations)
  const motherTongue = useProfileStore((s) => s.motherTongue)
  const langs       = useProfileStore((s) => s.otherLanguages)
  const skills      = useProfileStore((s) => s.digitalSkills)
  const license     = useProfileStore((s) => s.drivingLicenseCategories)
  const certs       = useProfileStore((s) => s.certifications)

  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name'
  const hasBody  = statement || workExp.length || edus.length || skills.length || certs.length || motherTongue || langs.length

  /* ── Print: open popup, inject only the paper HTML, call window.print() ── */
  const handlePrint = () => {
    const inner = paperRef.current?.innerHTML ?? ''
    const win = window.open('', '_blank', 'width=900,height=1100')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="utf-8"/>
  <title>${fullName} — CV</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>${PRINT_STYLES}</style>
</head><body>
  <div id="cv-paper" style="width:210mm;background:white;overflow:hidden;">${inner}</div>
</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 600)
  }

  /* ── Save PDF: html2pdf.js renders the paper element to a downloaded file ── */
  const handleSavePdf = async () => {
    const el = paperRef.current
    if (!el) return
    // dynamic import keeps the heavy library out of the initial bundle
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf()
      .set({
        margin: 0,
        filename: `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
        image:      { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF:      { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(el)
      .save()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/10 shrink-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Live Preview
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-white/10 text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            Print
          </button>
          <button
            type="button"
            onClick={handleSavePdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-lg hover:bg-brand-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Save PDF
          </button>
        </div>
      </div>

      {/* Scrollable paper area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
        <div
          ref={paperRef}
          style={{
            background: 'white',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 13,
            boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* ── Purple header ── */}
          <div style={{ background: ACCENT, padding: '28px 32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              {/* Left: Name + title */}
              <div>
                {p.profilePicUrl && (
                  <img
                    src={p.profilePicUrl}
                    alt=""
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', marginBottom: 10 }}
                  />
                )}
                <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                  {fullName}
                </h1>
                {p.headline && (
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '6px 0 0', fontStyle: 'italic' }}>
                    {p.headline}
                  </p>
                )}
              </div>

              {/* Right: Contact details */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3,
                fontFamily: '"Inter", system-ui, sans-serif', flexShrink: 0,
              }}>
                {p.email    && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{p.email}</span>}
                {p.phone    && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{p.phone}</span>}
                {(p.city || p.country) && (
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>
                    {[p.city, p.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {p.linkedin && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{p.linkedin.replace(/^https?:\/\//, '')}</span>}
                {p.github   && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{p.github.replace(/^https?:\/\//, '')}</span>}
                {p.websites[0] && <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>{p.websites[0].replace(/^https?:\/\//, '')}</span>}
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: '24px 32px 28px', background: 'white' }}>

            {!hasBody && (
              <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '32px 0', fontFamily: 'system-ui' }}>
                Fill in the form on the right to build your CV
              </p>
            )}

            {/* About Me */}
            {statement && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="About Me" />
                <p style={{ color: '#374151', fontSize: 12.5, lineHeight: 1.75, margin: 0 }}>{statement}</p>
              </div>
            )}

            {/* Work Experience */}
            {workExp.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="Work Experience" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {workExp.map((w) => {
                    const bullets = w.description
                      ? w.description.split('\n').map((l) => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
                      : []
                    return (
                      <div key={w.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                          <div style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{w.jobTitle}</span>
                            {w.company && (
                              <span style={{ fontWeight: 400, fontSize: 13, color: ACCENT }}>{' — '}{w.company}</span>
                            )}
                          </div>
                          <span style={{ color: '#9ca3af', fontSize: 11, fontFamily: '"Inter", system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                            {fmt(w.fromDate)}{(w.fromDate || w.toDate) ? ' – ' : ''}{w.current ? 'Present' : fmt(w.toDate)}
                          </span>
                        </div>
                        {w.location && (
                          <p style={{ color: '#6b7280', fontSize: 11, margin: '2px 0 0', fontFamily: '"Inter", system-ui, sans-serif' }}>{w.location}</p>
                        )}
                        {bullets.length > 0 && (
                          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#4b5563', fontSize: 12.5, lineHeight: 1.65 }}>
                            {bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        )}
                        {w.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {w.skills.map((s) => (
                              <span key={s} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', padding: '1px 8px', borderRadius: 3, fontSize: 10.5, fontFamily: '"Inter", system-ui, sans-serif' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {edus.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="Education" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {edus.map((e) => (
                    <div key={e.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
                        <div style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{e.qualification}</span>
                          {e.institution && (
                            <span style={{ fontWeight: 400, fontSize: 13, color: ACCENT }}>{' — '}{e.institution}</span>
                          )}
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: 11, fontFamily: '"Inter", system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                          {fmt(e.fromDate)}{(e.fromDate || e.toDate) ? ' – ' : ''}{e.current ? 'Present' : fmt(e.toDate)}
                        </span>
                      </div>
                      {e.location && (
                        <p style={{ color: '#6b7280', fontSize: 11, margin: '2px 0 0', fontFamily: '"Inter", system-ui, sans-serif' }}>{e.location}</p>
                      )}
                      {e.notes && (
                        <p style={{ color: '#4b5563', fontSize: 12, margin: '4px 0 0', lineHeight: 1.6 }}>{e.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="Skills" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {skills.map((s) => (
                    <span key={s} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', padding: '3px 10px', borderRadius: 4, fontSize: 11.5, fontFamily: '"Inter", system-ui, sans-serif' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {(motherTongue || langs.length > 0) && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="Languages" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {motherTongue && (
                    <span style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'system-ui', fontWeight: 600 }}>
                      {motherTongue} — Native
                    </span>
                  )}
                  {langs.map((l) => (
                    <span key={l.id} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'system-ui' }}>
                      {l.name} — {l.proficiency}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certs.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SectionHead title="Certifications" />
                {certs.map((c) => (
                  <div key={c.id} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111827', fontFamily: '"Inter", system-ui, sans-serif' }}>{c.name}</span>
                    {(c.issuer || c.year) && (
                      <span style={{ color: '#6b7280', fontSize: 12, fontFamily: '"Inter", system-ui, sans-serif' }}>
                        {' — '}{[c.issuer, c.year].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Driving License */}
            {license.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <SectionHead title="Driving License" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {license.map((cat) => (
                    <span key={cat} style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, color: ACCENT, padding: '3px 10px', borderRadius: 4, fontSize: 11, fontFamily: 'system-ui', fontWeight: 600 }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
