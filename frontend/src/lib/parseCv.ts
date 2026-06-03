import type { PersonalInfo, WorkExperience, Education, LanguageEntry, Certification } from '@/types'

export interface ParsedCv {
  personalInfo: Partial<PersonalInfo> & { idCardNo?: string; dateOfBirth?: string; nationality?: string; gender?: 'M' | 'F' | 'X'; address?: string }
  personalStatement: string
  workExperiences: Omit<WorkExperience, 'id'>[]
  educations: Omit<Education, 'id'>[]
  digitalSkills: string[]
  motherTongue: string
  otherLanguages: Omit<LanguageEntry, 'id'>[]
  certifications: Omit<Certification, 'id'>[]
  drivingLicenseCategories: string[]
}

/* ════════════════════════════════════════
   PDF TEXT EXTRACTION
════════════════════════════════════════ */
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).href

  const buffer = await file.arrayBuffer()
  const doc    = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let p = 1; p <= doc.numPages; p++) {
    const page    = await doc.getPage(p)
    const content = await page.getTextContent()

    type Item = { str: string; x: number; y: number }
    const items: Item[] = []
    for (const raw of content.items) {
      if (!('str' in raw)) continue
      const r = raw as { str: string; transform: number[] }
      const s = r.str.trim()
      if (!s) continue
      items.push({ str: s, x: Math.round(r.transform[4]), y: Math.round(r.transform[5]) })
    }

    // Group items into lines with 3-px Y tolerance
    const lineMap = new Map<number, Item[]>()
    for (const item of items) {
      let key: number | undefined
      for (const [y] of lineMap) if (Math.abs(y - item.y) <= 3) { key = y; break }
      key = key ?? item.y
      if (!lineMap.has(key)) lineMap.set(key, [])
      lineMap.get(key)!.push(item)
    }

    const lines = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, row]) => row.sort((a, b) => a.x - b.x).map(r => r.str).join(' ').trim())
      .filter(Boolean)

    pages.push(lines.join('\n'))
  }

  return pages.join('\n')
}

/* ════════════════════════════════════════
   DATE UTILITIES
════════════════════════════════════════ */
const MONTH_ALT =
  'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|' +
  'jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?'

const D =
  `(?:(?:${MONTH_ALT})\\.?\\s*(?:19|20)\\d{2}` +
  `|\\d{1,2}[/\\-](?:19|20)\\d{2}` +
  `|(?:19|20)\\d{2}[/\\-]\\d{1,2}` +
  `|(?:19|20)\\d{2})`

const PRESENT  = 'present|current|now|ongoing|today|to\\s+date|till\\s+date'
const DATE_SEP = `\\s*(?:–|—|−|‐|‑|-|~|to|till|until|through)\\s*`

// Always construct a fresh regex to avoid shared lastIndex
function dateRangeRe() {
  return new RegExp(`(${D})${DATE_SEP}(${D}|${PRESENT})`, 'gi')
}
// Standalone year-only (e.g. "2020 – 2022" without months already handled above; this catches bare "2020")
function yearOnlyRe() {
  return new RegExp(`^((?:19|20)\\d{2})${DATE_SEP}((?:19|20)\\d{2}|${PRESENT})$`, 'i')
}

function firstDateRange(text: string) {
  const m = dateRangeRe().exec(text)
  if (m) return m
  return yearOnlyRe().exec(text)
}

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
}

function toIsoMonth(raw: string): string {
  const s = raw.trim()
  if (!s || new RegExp(`^(?:${PRESENT})$`, 'i').test(s)) return ''
  const mmYY = s.match(/^(\d{1,2})[/\-](\d{4})$/)
  if (mmYY) return `${mmYY[2]}-${mmYY[1].padStart(2, '0')}`
  const yyMM = s.match(/^(\d{4})[/\-](\d{1,2})$/)
  if (yyMM) return `${yyMM[1]}-${yyMM[2].padStart(2, '0')}`
  const yr   = s.match(/(?:19|20)\d{2}/)?.[0]
  if (!yr) return ''
  const mKey = s.toLowerCase().match(new RegExp(MONTH_ALT))?.[0]?.slice(0, 3)
  return mKey && MONTH_MAP[mKey] ? `${yr}-${MONTH_MAP[mKey]}` : yr
}

/* ════════════════════════════════════════
   BULLET / DECORATOR UTILITIES
════════════════════════════════════════ */
const BULLET_RE = /^[-•*▪›○→✓▶◆▸◦·▷◇»–—▪]\s+/

function isBullet(l: string) { return BULLET_RE.test(l.trim()) }
function stripBullet(l: string) { return l.trim().replace(BULLET_RE, '') }
function isDecoratorOnly(l: string) { return /^[─━═\-=~_*\s]{3,}$/.test(l) }

/* ════════════════════════════════════════
   SECTION DETECTION
════════════════════════════════════════ */
type Section =
  | 'head' | 'summary' | 'experience' | 'education'
  | 'skills' | 'languages' | 'certifications'
  | 'volunteer' | 'projects' | 'achievements' | 'references'

const SECTION_RE: [Section, RegExp][] = [
  ['summary',
    /^(?:(?:professional|personal|career|executive|brief)\s+)?(?:summary|profile|about(?:\s+me)?|objective|statement|introduction|overview|bio|highlights?|snapshot|pitch)\s*$/i],
  ['experience',
    /^(?:(?:work|professional|career|relevant|employment|industry|corporate|job|leadership|internship|commercial)\s+)?(?:experience|employment(?:\s+history)?|history|background|positions?(?:\s+held)?|appointments?|career\s+history|work\s+history|job\s+history|employment\s+record)\s*$/i],
  ['education',
    /^(?:education(?:al\s+(?:background|qualifications?|history|credentials))?|academic(?:\s+(?:background|history|credentials|qualifications?))?|qualifications?|training\s+and\s+education|schooling)\s*$/i],
  ['skills',
    /^(?:(?:technical|core|key|digital|professional|it|computer|software|hard|soft|transferable|functional|relevant|additional)\s+)?(?:skills?|competenc(?:y|ies)|expertise|proficienc(?:y|ies)|abilities|tools?|technologies|capabilities|areas?\s+of\s+expertise|skill\s+set|strengths?)\s*$/i],
  ['languages',
    /^(?:languages?(?:\s+(?:skills?|proficiency|competence|known))?|linguistic\s+(?:skills?|competence)|foreign\s+languages?)\s*$/i],
  ['certifications',
    /^(?:certifications?|certificates?|qualifications?|awards?|honors?|honours?|accreditations?|licenses?|memberships?|professional\s+development|continuing\s+education|training(?:\s+(?:and|&)\s+(?:development|certifications?))?|courses?(?:\s+(?:and|&)\s+\S+)?|key\s+achievements?|accomplishments?)\s*$/i],
  ['volunteer',
    /^(?:volunteer(?:ing|ee)?(?:\s+(?:work|experience|activities))?|voluntary\s+(?:work|experience|service)|community\s+(?:work|service|involvement)|social\s+(?:work|activities))\s*$/i],
  ['projects',
    /^(?:(?:key|notable|personal|side|selected|relevant|academic)\s+)?projects?\s*$/i],
  ['achievements',
    /^(?:achievements?|key\s+achievements?|accomplishments?|honors?|honours?|recognition|awards?\s+(?:and|&)\s+achievements?)\s*$/i],
  ['references',
    /^references?(?:\s+available(?:\s+on\s+request)?)?\s*$/i],
]

function normaliseHeader(line: string): string {
  return line.trim()
    .replace(/^\d+[.)]\s+/, '')
    .replace(/^[─━═\-=~*●▪▸►◆■□○◦•·\s]+|[─━═\-=~*●▪▸►◆■□○◦•·\s]+$/g, '')
    .trim()
}

function detectSection(line: string): Section | null {
  const h = normaliseHeader(line)
  if (!h || h.length > 70) return null
  for (const [key, re] of SECTION_RE) if (re.test(h)) return key
  return null
}

function splitSections(lines: string[]) {
  const map: Record<Section, string[]> = {
    head: [], summary: [], experience: [], education: [],
    skills: [], languages: [], certifications: [],
    volunteer: [], projects: [], achievements: [], references: [],
  }
  let cur: Section = 'head'
  let detected     = 0

  for (const line of lines) {
    if (isDecoratorOnly(line)) continue
    const s = detectSection(line)
    if (s) { cur = s; detected++; continue }
    map[cur].push(line)
  }

  if (detected === 0) map.experience = lines
  return map
}

/* ════════════════════════════════════════
   EUROPASS FIELD-LABEL PARSER
   Handles: "Employer:", "Occupation:", "Dates:", "Location:",
            "Institution:", "Field of study:", "Award:", etc.
════════════════════════════════════════ */
const EUROPASS_WORK_LABELS: Record<string, keyof { employer: string; occupation: string; dates: string; location: string; activities: string }> = {
  employer: 'employer', 'name and address of employer': 'employer',
  occupation: 'occupation', 'occupation or position held': 'occupation',
  dates: 'dates', 'dates from - to': 'dates',
  location: 'location', city: 'location',
  activities: 'activities', 'main activities and responsibilities': 'activities',
}
const EUROPASS_EDU_LABELS: Record<string, keyof { institution: string; award: string; dates: string; field: string; level: string; grade: string }> = {
  institution: 'institution', 'name and type of organisation': 'institution',
  award: 'award', qualification: 'award',
  dates: 'dates',
  field: 'field', 'field of study': 'field', subject: 'field',
  level: 'level',
  grade: 'grade', 'final grade': 'grade', gpa: 'grade',
}

function isEuropassSection(lines: string[]): boolean {
  return lines.some(l => {
    const lc = l.toLowerCase()
    return Object.keys(EUROPASS_WORK_LABELS).some(k => lc.startsWith(`${k}:`))
      || Object.keys(EUROPASS_EDU_LABELS).some(k => lc.startsWith(`${k}:`))
  })
}

function parseEuropassWork(lines: string[]): Omit<WorkExperience, 'id'>[] {
  const entries: Omit<WorkExperience, 'id'>[] = []
  let cur: Record<string, string> = {}
  const acts: string[] = []

  const flush = () => {
    if (cur.employer || cur.occupation) {
      const dm = cur.dates ? firstDateRange(cur.dates) : null
      entries.push({
        jobTitle:    cur.occupation ?? '',
        company:     cur.employer   ?? '',
        location:    cur.location   ?? '',
        fromDate:    dm ? toIsoMonth(dm[1]) : '',
        toDate:      dm ? toIsoMonth(dm[2]) : '',
        current:     dm ? new RegExp(`^(?:${PRESENT})$`, 'i').test(dm[2].trim()) : false,
        description: acts.map(a => `• ${a}`).join('\n'),
        skills:      [],
      })
    }
    cur = {}
    acts.length = 0
  }

  for (const line of lines) {
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/)
    if (m) {
      const label = m[1].toLowerCase().trim()
      const value = m[2].trim()
      const mapped = EUROPASS_WORK_LABELS[label]
      if (mapped === 'employer' && cur.employer) flush()
      if (mapped) {
        if (mapped === 'activities') acts.push(value)
        else (cur as Record<string, string>)[mapped] = value
        continue
      }
    }
    if (isBullet(line)) acts.push(stripBullet(line))
  }

  flush()
  return entries
}

function parseEuropassEdu(lines: string[]): Omit<Education, 'id'>[] {
  const entries: Omit<Education, 'id'>[] = []
  let cur: Record<string, string> = {}

  const flush = () => {
    if (cur.institution || cur.award) {
      const dm = cur.dates ? firstDateRange(cur.dates) : null
      entries.push({
        institution:   cur.institution ?? '',
        qualification: cur.award       ?? cur.field ?? '',
        location:      cur.location    ?? '',
        fromDate:      dm ? toIsoMonth(dm[1]) : '',
        toDate:        dm ? toIsoMonth(dm[2]) : '',
        current:       dm ? new RegExp(`^(?:${PRESENT})$`, 'i').test(dm[2].trim()) : false,
        notes:         [cur.grade, cur.level].filter(Boolean).join(', '),
      })
    }
    cur = {}
  }

  for (const line of lines) {
    const m = line.match(/^([^:]{2,40}):\s*(.+)$/)
    if (m) {
      const label = m[1].toLowerCase().trim()
      const value = m[2].trim()
      const mapped = EUROPASS_EDU_LABELS[label]
      if (mapped === 'institution' && cur.institution) flush()
      if (mapped) { (cur as Record<string, string>)[mapped] = value; continue }
    }
  }

  flush()
  return entries
}

/* ════════════════════════════════════════
   CONTACT + PERSONAL DETAILS EXTRACTION
════════════════════════════════════════ */
function extractLabelledPersonalFields(lines: string[]) {
  const fields: Record<string, string> = {}
  for (const line of lines) {
    const m = line.match(/^([A-Za-z\s/]{2,30}):\s*(.+)$/)
    if (m) fields[m[1].toLowerCase().trim()] = m[2].trim()
  }

  const dob = fields['date of birth'] ?? fields['dob'] ?? fields['born'] ?? fields['birth date'] ?? ''
  const nationality = fields['nationality'] ?? fields['citizenship'] ?? ''
  const gender =
    /^m(?:ale)?$/i.test(fields['gender'] ?? fields['sex'] ?? '') ? 'M' :
    /^f(?:emale)?$/i.test(fields['gender'] ?? fields['sex'] ?? '') ? 'F' : undefined
  const address = fields['address'] ?? fields['home address'] ?? fields['postal address'] ?? ''

  // Driving licence: "B", "A, B", "Category B", "Full UK driving licence, Category B"
  const licRaw  = fields['driving licence'] ?? fields['driving license'] ?? fields['driving'] ?? ''
  const licCats = licRaw.match(/\b([ABCDE][12]?E?)\b/g) ?? (licRaw && /full|yes|clean|valid/i.test(licRaw) ? ['B'] : [])

  return { dob, nationality, gender: gender as 'M' | 'F' | 'X' | undefined, address, licCats }
}

function extractDrivingLicenseFromText(text: string): string[] {
  // "Driving Licence: B" or "Driving License: A, B" in any section
  const m = text.match(/driving\s+licen[sc]e?\s*:?\s*([A-Za-z0-9,\s]+)/i)
  if (!m) return []
  const cats = m[1].match(/\b([ABCDE][12]?E?)\b/g) ?? []
  return cats.length ? cats : /full|yes|clean|valid/i.test(m[1]) ? ['B'] : []
}

function extractContact(text: string): Partial<PersonalInfo> {
  const email  = text.match(/[\w.+\-]+@[\w\-.]+\.[a-z]{2,}/i)?.[0] ?? ''
  const phone  = text.match(
    /(?:\+?\d{1,3}[\s.\-()]?)?\(?\d{2,4}\)?[\s.\-]?\d{3,4}[\s.\-]?\d{3,5}(?!\d)/,
  )?.[0]?.trim().replace(/\s+/g, ' ') ?? ''
  const liM    = text.match(/linkedin\.com\/in\/([\w\-]+)/i)
  const ghM    = text.match(/github\.com\/([\w\-]+)/i)
  const siteM  = text.match(/(?:https?:\/\/)?(?:www\.)([\w\-]+\.[a-z]{2,}[\w/\-.]*)/i)
  const COUNTRIES =
    'Malta|UK|United Kingdom|Ireland|Australia|USA|United States|Canada|' +
    'Germany|France|Italy|Spain|Netherlands|Belgium|Sweden|Norway|Denmark|' +
    'Switzerland|Austria|Poland|Portugal|New Zealand|Singapore|UAE|South Africa'
  const locM   = text.match(new RegExp(`([A-Z][a-zA-Z\\s]{1,20}),\\s*(${COUNTRIES})`, 'i'))

  return {
    email,
    phone,
    linkedin: liM  ? `https://linkedin.com/in/${liM[1]}` : '',
    github:   ghM  ? `https://github.com/${ghM[1]}` : '',
    websites: siteM ? [`https://www.${siteM[1]}`] : [],
    city:     locM?.[1]?.trim() ?? '',
    country:  locM?.[2]?.trim() ?? '',
  }
}

/* ════════════════════════════════════════
   NAME + HEADLINE EXTRACTION
════════════════════════════════════════ */
const SKIP_LINES = /^(?:curriculum\s*vitae|resume|cv|page\s+\d|references?\s+available)/i
const HONORIFICS = /^(?:dr|mr|mrs|ms|prof|sir|rev|eng|arch)\.?\s+/i
// LinkedIn duration suffix: "· 3 yrs 2 mos"
const LI_DURATION = /\s*·\s*\d+\s+(?:yr|mo)s?.*/i

function extractNameHeadline(headLines: string[], allLines: string[]) {
  const pool = (headLines.length >= 3 ? headLines : allLines).slice(0, 12)
  const candidates = pool.filter(l => {
    const c = l.trim().replace(LI_DURATION, '')
    return (
      c.length >= 2 && c.length <= 80 &&
      !SKIP_LINES.test(c) &&
      !/[@]/.test(c) &&
      !/^\+?[\d\s()\-.]{7,}$/.test(c) &&
      !/(?:linkedin|github|http|www\.)/i.test(c)
    )
  })

  const nameLine = candidates.find(l => {
    const words = l.trim().replace(HONORIFICS, '').split(/\s+/)
    return words.length >= 2 && words.length <= 5 && words.every(w => /^[A-ZÁÉÍÓÚÀÈÌÒÙÄÖÜ]/u.test(w))
  }) ?? candidates[0] ?? ''

  const cleanName = nameLine.replace(HONORIFICS, '').replace(LI_DURATION, '').trim()
  const isAllCaps = /^[A-Z\s\-']+$/.test(cleanName)
  const normalised = isAllCaps
    ? cleanName.replace(/\b\w+/g, w => w[0] + w.slice(1).toLowerCase())
    : cleanName

  const parts     = normalised.trim().split(/\s+/)
  const firstName = parts[0] ?? ''
  const lastName  = parts.slice(1).join(' ')

  const nameIdx = candidates.indexOf(nameLine)
  const headline = candidates.slice(nameIdx + 1).find(l => {
    const w = l.trim().split(/\s+/)
    return w.length >= 1 && w.length <= 8 && l.length <= 80 && !/\d{4}/.test(l)
  }) ?? ''

  return { firstName, lastName, headline }
}

/* ════════════════════════════════════════
   WORK EXPERIENCE — anchor-based parser
════════════════════════════════════════ */
function cleanWorkLine(l: string): string {
  return l.trim().replace(LI_DURATION, '').trim()
}

function parseExperience(lines: string[], isVolunteer = false): Omit<WorkExperience, 'id'>[] {
  // Detect Europass early
  if (isEuropassSection(lines)) return parseEuropassWork(lines)

  type Anchor = { idx: number; fromDate: string; toDate: string; current: boolean; rest: string }
  const anchors: Anchor[] = []

  for (let i = 0; i < lines.length; i++) {
    const l = cleanWorkLine(lines[i])
    const m = firstDateRange(l)
    if (!m) continue
    anchors.push({
      idx:      i,
      fromDate: toIsoMonth(m[1]),
      toDate:   toIsoMonth(m[2]),
      current:  new RegExp(`^(?:${PRESENT})$`, 'i').test(m[2].trim()),
      rest:     l.replace(m[0], '').replace(/^[\s\-|,–—]+|[\s\-|,–—]+$/g, '').trim(),
    })
  }

  if (anchors.length === 0) return []

  const results: Omit<WorkExperience, 'id'>[] = []

  for (let ai = 0; ai < anchors.length; ai++) {
    const a       = anchors[ai]
    const nextIdx = ai + 1 < anchors.length ? anchors[ai + 1].idx : lines.length

    let jobTitle = ''
    let company  = ''
    let location = ''

    // Parse inline: "Title | Company | Location" or "Title at Company"
    if (a.rest) {
      const atM = a.rest.match(/^(.+?)\s+at\s+(.+)$/i)
      if (atM) {
        jobTitle = atM[1].trim(); company = atM[2].trim()
      } else {
        const parts = a.rest.split(/\s*[|,–—@]\s*/)
        jobTitle = parts[0]?.trim() ?? ''
        company  = parts[1]?.trim() ?? ''
        location = parts[2]?.trim() ?? ''
      }
    }

    // Look back up to 4 lines for title/company
    if (!jobTitle) {
      const lookback = lines
        .slice(Math.max(0, a.idx - 4), a.idx)
        .map(cleanWorkLine)
        .filter(l => l && !isBullet(l) && !firstDateRange(l))

      // Detect "reverse" format: COMPANY then title (company often ALL CAPS or longer)
      if (lookback.length >= 2) {
        const last   = lookback[lookback.length - 1]
        const prev   = lookback[lookback.length - 2]
        const lastIsCompany = /^[A-Z0-9\s&.,'-]{4,}$/.test(last)
        if (lastIsCompany) {
          company  = last
          jobTitle = prev
        } else {
          jobTitle = prev
          company  = last
        }
      } else if (lookback.length === 1) {
        const atM = lookback[0].match(/^(.+?)\s+at\s+(.+)$/i)
        if (atM) { jobTitle = atM[1].trim(); company = atM[2].trim() }
        else     { jobTitle = lookback[0] }
      }
    }

    // Collect body lines
    const body    = lines.slice(a.idx + 1, nextIdx).map(cleanWorkLine).filter(Boolean)
    const bullets: string[] = []
    let bodyStart = 0

    if (!company) {
      for (let bi = 0; bi < Math.min(2, body.length); bi++) {
        if (isBullet(body[bi]) || firstDateRange(body[bi])) { bodyStart = bi; break }
        if (!company) { company = body[bi]; bodyStart = bi + 1 }
        else          { bodyStart = bi; break }
      }
    }

    for (const bl of body.slice(bodyStart)) {
      if (firstDateRange(bl)) continue
      bullets.push(stripBullet(bl))
    }

    const volunteerNote = isVolunteer ? '(Volunteer) ' : ''
    results.push({
      jobTitle:    `${volunteerNote}${jobTitle || '—'}`,
      company:     company  || '',
      location,
      fromDate:    a.fromDate,
      toDate:      a.toDate,
      current:     a.current,
      description: bullets.map(b => `• ${b}`).join('\n'),
      skills:      [],
    })
  }

  return results
}

/* ════════════════════════════════════════
   EDUCATION — anchor-based parser
════════════════════════════════════════ */
function parseEducation(lines: string[]): Omit<Education, 'id'>[] {
  if (isEuropassSection(lines)) return parseEuropassEdu(lines)

  type Anchor = { idx: number; fromDate: string; toDate: string; current: boolean; rest: string }
  const anchors: Anchor[] = []

  for (let i = 0; i < lines.length; i++) {
    const m = firstDateRange(lines[i])
    if (!m) continue
    anchors.push({
      idx:      i,
      fromDate: toIsoMonth(m[1]),
      toDate:   toIsoMonth(m[2]),
      current:  new RegExp(`^(?:${PRESENT})$`, 'i').test(m[2].trim()),
      rest:     lines[i].replace(m[0], '').replace(/^[\s\-|,–—]+|[\s\-|,–—]+$/g, '').trim(),
    })
  }

  if (anchors.length === 0) {
    return lines.filter(l => l.trim() && !isBullet(l)).map(l => ({
      qualification: l.trim(), institution: '', location: '',
      fromDate: '', toDate: '', current: false, notes: '',
    })).slice(0, 6)
  }

  const results: Omit<Education, 'id'>[] = []

  for (let ai = 0; ai < anchors.length; ai++) {
    const a       = anchors[ai]
    const nextIdx = ai + 1 < anchors.length ? anchors[ai + 1].idx : lines.length

    let qualification = ''
    let institution   = ''
    let location      = ''

    if (a.rest) {
      const parts   = a.rest.split(/\s*[|,–—@]\s*/)
      qualification = parts[0]?.trim() ?? ''
      institution   = parts[1]?.trim() ?? ''
      location      = parts[2]?.trim() ?? ''
    }

    if (!qualification) {
      const lookback = lines
        .slice(Math.max(0, a.idx - 3), a.idx)
        .map(l => l.trim())
        .filter(l => l && !isBullet(l) && !firstDateRange(l))

      if (lookback.length >= 2) {
        qualification = lookback[lookback.length - 2]
        institution   = lookback[lookback.length - 1]
      } else if (lookback.length === 1) {
        qualification = lookback[0]
      }
    }

    const body  = lines.slice(a.idx + 1, nextIdx).map(l => l.trim()).filter(Boolean)
    const notes: string[] = []
    let bodyStart = 0

    if (!institution) {
      for (let bi = 0; bi < Math.min(2, body.length); bi++) {
        if (isBullet(body[bi]) || firstDateRange(body[bi])) { bodyStart = bi; break }
        if (!institution) { institution = body[bi]; bodyStart = bi + 1 }
        else              { bodyStart = bi; break }
      }
    }

    for (const bl of body.slice(bodyStart)) {
      if (!firstDateRange(bl)) notes.push(stripBullet(bl))
    }

    results.push({ qualification, institution, location, fromDate: a.fromDate, toDate: a.toDate, current: a.current, notes: notes.join('. ') })
  }

  return results
}

/* ════════════════════════════════════════
   SKILLS
   Handles: plain list, comma/semicolon/pipe,
   category headers ("Programming: Python, JS"),
   proficiency suffixes stripped
════════════════════════════════════════ */
function parseSkills(lines: string[]): string[] {
  const skills: string[] = []

  const cleanSkill = (s: string) =>
    s.trim()
     .replace(/\s*[(:[\-–—]\s*(?:advanced|intermediate|beginner|basic|expert|proficient|fluent|★+|☆+|✓|\d+\s*(?:yrs?|years?|\/5|\/10)).*/i, '')
     .replace(/[()[\]]+/g, '')
     .trim()

  for (const line of lines) {
    const stripped = stripBullet(line)

    // "Category: skill1, skill2" — extract only the skills part
    const catM = stripped.match(/^[A-Za-z\s&\/]{2,30}:\s*(.+)$/)
    const content = catM ? catM[1] : stripped

    content
      .split(/[,;|•\/]/)
      .map(s => cleanSkill(s))
      .filter(s => s.length > 1 && s.length < 60 && !/^\d+$/.test(s))
      .forEach(s => skills.push(s))
  }

  return [...new Set(skills)].slice(0, 40)
}

/* ════════════════════════════════════════
   LANGUAGES
════════════════════════════════════════ */
const PROF_MAP: [RegExp, LanguageEntry['proficiency']][] = [
  [/native|mother\s+tongue|first\s+language|c2|bilingual/i,    'Native'],
  [/fluent|advanced|c1/i,                                      'Fluent'],
  [/proficient|upper.intermediate|b2/i,                        'Proficient'],
  [/intermediate|conversational|b1/i,                          'Conversational'],
  [/basic|elementary|beginner|a[12]|limited/i,                 'Basic'],
]

function parseProficiency(text: string): LanguageEntry['proficiency'] {
  for (const [re, level] of PROF_MAP) if (re.test(text)) return level
  return 'Conversational'
}

function parseLanguages(lines: string[]): { motherTongue: string; others: Omit<LanguageEntry, 'id'>[] } {
  let motherTongue = ''
  const others: Omit<LanguageEntry, 'id'>[] = []

  for (const line of lines) {
    const proficiency = parseProficiency(line)
    const name = line
      .replace(/[-–:,()[\]]\s*(?:native|mother\s+tongue|first\s+language|bilingual|fluent|advanced|proficient|upper.intermediate|intermediate|conversational|basic|elementary|beginner|c[12]|b[12]|a[12]|limited).*/gi, '')
      .replace(BULLET_RE, '')
      .trim()

    if (!name || name.length > 40) continue

    if (proficiency === 'Native' && !motherTongue) {
      motherTongue = name
    } else {
      others.push({ name, proficiency })
    }
  }

  return { motherTongue, others }
}

/* ════════════════════════════════════════
   CERTIFICATIONS
════════════════════════════════════════ */
function parseCertifications(lines: string[]): Omit<Certification, 'id'>[] {
  return lines.filter(l => l.trim().length > 2).map(line => {
    const s    = stripBullet(line)
    const yr   = s.match(/\b(20\d{2}|19\d{2})\b/)?.[0] ?? ''
    const issM = s.match(/(?:\s+(?:–|—|-|by|from|issued\s+by|via)\s+)(.+?)(?:\s*\d{4})?$/i)
    const name = s
      .replace(/\b(?:20|19)\d{2}\b/g, '')
      .replace(/(?:\s+(?:–|—|-|by|from|issued\s+by|via)\s+).+$/i, '')
      .replace(/[-–,|]\s*$/, '').trim()
    return { name, issuer: issM?.[1]?.trim() ?? '', year: yr }
  }).filter(c => c.name.length > 2)
}

/* ════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════ */
export function parseCvText(rawText: string): ParsedCv {
  const lines    = rawText.split(/\n+/).map(l => l.trim()).filter(Boolean)
  const sections = splitSections(lines)

  const contact  = extractContact(rawText)
  const personal = extractLabelledPersonalFields([...sections.head, ...lines.slice(0, 20)])
  const { firstName, lastName, headline } = extractNameHeadline(sections.head, lines)

  // Merge experience + volunteer + projects
  const workExperiences = [
    ...parseExperience(sections.experience),
    ...parseExperience(sections.volunteer, true),
    ...parseExperience(sections.projects),
  ]

  // Merge certifications + achievements
  const certLines = [...sections.certifications, ...sections.achievements]
  const certifications = parseCertifications(certLines)

  const { motherTongue, others: otherLanguages } = parseLanguages(sections.languages)

  // Driving licence: prefer labelled field, then scan full text
  const drivingLicenseCategories =
    personal.licCats.length > 0
      ? personal.licCats
      : extractDrivingLicenseFromText(rawText)

  return {
    personalInfo: {
      firstName,
      lastName,
      headline,
      ...contact,
      ...(personal.nationality ? { nationality: personal.nationality } : {}),
      ...(personal.dob        ? { dateOfBirth: personal.dob }          : {}),
      ...(personal.gender     ? { gender: personal.gender }            : {}),
      ...(personal.address    ? { address: personal.address }          : {}),
    },
    personalStatement:       sections.summary.join(' ').trim(),
    workExperiences,
    educations:              parseEducation(sections.education),
    digitalSkills:           parseSkills(sections.skills),
    motherTongue,
    otherLanguages,
    certifications,
    drivingLicenseCategories,
  }
}
