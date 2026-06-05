import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, MessageSquare, Target, Globe, BookOpen, Lightbulb,
  Search, Zap, Trophy, ArrowRight, Clock, ChevronUp,
  Info, TrendingUp, Building2, Hammer, Home, UtensilsCrossed,
  Stethoscope, Sun, Cpu, Plus,
} from 'lucide-react'

/* ── useInView ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

/* ── Data ── */
const GUIDES = [
  {
    Icon: FileText,       tag: 'CV & Cover Letter', title: 'How to Write a Winning CV',
    desc: 'Structure, length, keywords — everything you need to pass ATS filters and impress hiring managers at a glance.',
    readTime: '5 min read',
    lightColor: 'text-brand-600 bg-brand-50 border-brand-100',
    darkColor:  'dark:text-brand-400 dark:bg-brand-500/10 dark:border-brand-500/20',
    accent: 'bg-brand-500',
  },
  {
    Icon: MessageSquare,  tag: 'Interviews', title: 'Ace Your Job Interview',
    desc: 'Preparation strategies, common questions answered, and how to follow up after your interview to stand out.',
    readTime: '7 min read',
    lightColor: 'text-violet-600 bg-violet-50 border-violet-100',
    darkColor:  'dark:text-violet-400 dark:bg-violet-500/10 dark:border-violet-500/20',
    accent: 'bg-violet-500',
  },
  {
    Icon: Target,         tag: 'Salary', title: 'Negotiating Your Salary',
    desc: 'Know your worth. Tips on researching market rates, timing your ask, and handling counter-offers with confidence.',
    readTime: '4 min read',
    lightColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    darkColor:  'dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    accent: 'bg-emerald-500',
  },
  {
    Icon: Globe,          tag: 'Work in Malta', title: 'Work Permits & Residency',
    desc: 'EU and non-EU citizens — everything about Single Permits, Key Employee Initiatives, and the registration process.',
    readTime: '6 min read',
    lightColor: 'text-cyan-700 bg-cyan-50 border-cyan-100',
    darkColor:  'dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20',
    accent: 'bg-cyan-500',
  },
  {
    Icon: BookOpen,       tag: 'Career Growth', title: 'Planning Your Career Path',
    desc: 'How to identify your strengths, map out progression milestones, and find mentors who accelerate your growth.',
    readTime: '5 min read',
    lightColor: 'text-amber-700 bg-amber-50 border-amber-100',
    darkColor:  'dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
    accent: 'bg-amber-500',
  },
  {
    Icon: Lightbulb,      tag: 'Job Types', title: 'Full-Time vs Part-Time vs Seasonal',
    desc: 'Understand employment type differences, contract terms, leave entitlements, and what to look out for.',
    readTime: '3 min read',
    lightColor: 'text-rose-600 bg-rose-50 border-rose-100',
    darkColor:  'dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20',
    accent: 'bg-rose-500',
  },
]

const SALARY_GUIDE = [
  { category: 'Information Tech',   Icon: Cpu,             range: '€26k – €55k', median: '€42k', barPct: 85, demand: 'high'    },
  { category: 'Construction',       Icon: Hammer,          range: '€28k – €62k', median: '€48k', barPct: 95, demand: 'high'    },
  { category: 'Business & Finance', Icon: TrendingUp,      range: '€32k – €52k', median: '€40k', barPct: 80, demand: 'medium'  },
  { category: 'Hotels',             Icon: Building2,       range: '€22k – €46k', median: '€34k', barPct: 71, demand: 'high'    },
  { category: 'Real Estate',        Icon: Home,            range: '€26k – €44k', median: '€35k', barPct: 68, demand: 'medium'  },
  { category: 'Hospitality',        Icon: UtensilsCrossed, range: '€22k – €34k', median: '€28k', barPct: 52, demand: 'high'    },
  { category: 'Healthcare',         Icon: Stethoscope,     range: '€28k – €40k', median: '€34k', barPct: 62, demand: 'medium'  },
  { category: 'Renewable Energy',   Icon: Sun,             range: '€30k – €42k', median: '€36k', barPct: 65, demand: 'growing' },
]

const DEMAND_BADGE = {
  high:    { label: 'High demand',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' },
  medium:  { label: 'Steady',       cls: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400' },
  growing: { label: 'Growing fast', cls: 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-300' },
} as const

const FAQS = [
  { q: 'How do I apply for a job on AX Jobs?',                    a: 'Browse the listings, click "Apply" on any role, and submit your details. If you have a profile, your CV and information are pre-filled — it takes under a minute.' },
  { q: 'Do I need to create an account to apply?',                a: 'No account is required for guest applications, but registering lets you track applications, save jobs, and get matched to new roles automatically.' },
  { q: 'How long does the recruitment process take?',             a: 'On average 7–9 days from application to offer. AX Group aims to respond to every application within 5 working days, and successful candidates are typically interviewed within two weeks.' },
  { q: 'Can I apply for more than one role at the same time?',    a: 'Yes — you can apply to as many open roles as you like. We recommend tailoring your CV to each position for the best chance of success.' },
  { q: 'Do I need a work permit to work in Malta?',               a: 'EU/EEA citizens have the right to work in Malta without a permit. Non-EU nationals typically need a Single Permit or fall under the Key Employee Initiative. See our Work Permits guide for full details.' },
  { q: 'Are part-time and seasonal roles available?',             a: 'Yes. Use the employment type filter when browsing to surface Part-Time or Seasonal listings. Seasonal roles peak in spring and summer, particularly across hospitality and hotels.' },
  { q: 'How will I know if my application was received?',         a: 'You will receive a confirmation email immediately. You can also check the status of your applications at any time in your profile dashboard.' },
  { q: 'Can I withdraw or edit my application after submitting?', a: 'You can withdraw an application from your profile dashboard at any time before a final decision is made. Editing is not possible after submission — contact us and we can assist.' },
]

const PROCESS_STEPS = [
  { num: '01', Icon: Search,   title: 'Find your role',       desc: 'Use filters to narrow by category, location, and employment type.' },
  { num: '02', Icon: FileText, title: 'Prepare your profile', desc: 'Upload your CV or build one in minutes with our CV Builder.'        },
  { num: '03', Icon: Zap,      title: 'One-click apply',      desc: 'Your details pre-fill automatically — no cover letter required.'    },
  { num: '04', Icon: Trophy,   title: 'Get hired',            desc: 'Hear back within 5 working days and interview within 2 weeks.'      },
]

const TABS = [
  { id: 'guides',  label: 'Career Guides',  Icon: BookOpen    },
  { id: 'process', label: 'How to Apply',   Icon: Zap         },
  { id: 'salary',  label: 'Salary Guide',   Icon: TrendingUp  },
  { id: 'faq',     label: 'FAQ',            Icon: Info        },
]

/* ── Guide card ── */
function GuideCard({ guide, index, inView }: { guide: typeof GUIDES[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className={'transition-all duration-500 ' + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
      style={{ transitionDelay: `${index * 70}ms` }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="lift bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md overflow-hidden flex flex-col h-full cursor-pointer transition-all">
        <div className={'h-1 w-full ' + guide.accent} />
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${guide.lightColor} ${guide.darkColor}`}>
              <guide.Icon size={19} />
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${guide.lightColor} ${guide.darkColor}`}>{guide.tag}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{guide.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{guide.desc}</p>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
              <Clock size={11} /> {guide.readTime}
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${hovered ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-600'}`}>
              Read guide <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}

/* ── Salary row ── */
function SalaryRow({ item, index, inView }: { item: typeof SALARY_GUIDE[0]; index: number; inView: boolean }) {
  const badge = DEMAND_BADGE[item.demand as keyof typeof DEMAND_BADGE]
  return (
    <div className={'flex items-center gap-4 py-3.5 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-all duration-500 ' +
      (inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')}
      style={{ transitionDelay: `${index * 55}ms` }}>
      <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
        <item.Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{item.category}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>{badge.label}</span>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tabular-nums">{item.range}</span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-1000"
            style={{ width: inView ? `${item.barPct}%` : '0%', transitionDelay: `${index * 55 + 300}ms` }} />
        </div>
      </div>
    </div>
  )
}

/* ── FAQ item ── */
function FaqItem({ item, open, onToggle }: { item: typeof FAQS[0]; open: boolean; onToggle: () => void }) {
  return (
    <div className={`border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden lift transition-all ${open ? 'shadow-sm' : ''}`}>
      <button type="button" onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
          open
            ? 'bg-brand-50 dark:bg-brand-500/10'
            : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60'
        }`}>
        <span className={`text-sm font-semibold leading-snug transition-colors ${open ? 'text-brand-700 dark:text-brand-300' : 'text-gray-900 dark:text-gray-100'}`}>
          {item.q}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          open ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
        }`}>
          {open ? <ChevronUp size={14} /> : <Plus size={14} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-3">{item.a}</p>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function InformationPage() {
  const [openFaq, setOpenFaq]     = useState<number>(0)
  const [activeTab, setActiveTab] = useState('guides')
  const [mounted, setMounted]     = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const [guidesRef,  guidesInView]  = useInView(0.06)
  const [processRef, processInView] = useInView(0.1)
  const [salaryRef,  salaryInView]  = useInView(0.06)
  const [faqRef,     faqInView]     = useInView(0.06)
  const [ctaRef,     ctaInView]     = useInView(0.2)

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById('section-' + id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
    setActiveTab(id)
  }, [])

  // Scroll-spy
  useEffect(() => {
    const onScroll = () => {
      for (const t of [...TABS].reverse()) {
        const el = document.getElementById('section-' + t.id)
        if (el && el.getBoundingClientRect().top < 120) { setActiveTab(t.id); return }
      }
      setActiveTab('guides')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

      {/* ── Hero ── */}
      <section className="relative hero-grid overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.09) 0%, transparent 65%)' }} />
        <div className="absolute top-[20%] right-[-120px] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className={'inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-5 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
            <Info size={12} /> Career Information &amp; Resources
          </div>

          <h1 className={'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '80ms' }}>
            <span className="text-gray-900 dark:text-white block">Everything you need</span>
            <span className="gradient-text block">to land your next role.</span>
          </h1>

          <p className={'text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mb-8 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '160ms' }}>
            Guides, salary data, application tips, and answers to the questions we hear most — all in one place.
          </p>

          {/* Quick-nav tabs */}
          <div className={'flex flex-wrap gap-2 transition-all duration-700 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
            style={{ transitionDelay: '240ms' }}>
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} type="button" onClick={() => scrollTo(id)}
                className={`press inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  activeTab === id
                    ? 'bg-brand-500 border-brand-500 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10'
                }`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-gray-100 dark:divide-gray-800">
            {[
              { val: '6',    unit: 'guides',     label: 'Career topics covered' },
              { val: '8',    unit: 'categories', label: 'Salary benchmarks'     },
              { val: '~9',   unit: 'days',       label: 'Avg. time to offer'    },
              { val: '100%', unit: '',           label: 'Free for job seekers'  },
            ].map((s, i) => (
              <div key={i} className="pl-4 first:pl-0">
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
                  {s.val}<span className="text-brand-500 text-lg ml-0.5">{s.unit}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career Guides ── */}
      <section id="section-guides" ref={guidesRef} className="pt-16 pb-12 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className={'mb-8 transition-all duration-700 ' + (guidesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Resources</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Career guides</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-lg">Expert-written guides to help you present yourself, negotiate confidently, and grow your career.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDES.map((guide, i) => (
              <GuideCard key={guide.title} guide={guide} index={i} inView={guidesInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Process ── */}
      <section id="section-process" ref={processRef} className="py-14 px-4 sm:px-6 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className={'mb-10 transition-all duration-700 ' + (processInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Step by step</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">How to apply</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">From search to signed offer — here's exactly what to expect.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 relative">
            {/* Connector line desktop */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-200 dark:via-brand-500/30 to-transparent" aria-hidden="true" />

            {PROCESS_STEPS.map(({ num, Icon, title, desc }, i) => (
              <div key={num}
                className={'relative flex flex-col items-center text-center px-6 transition-all duration-700 '
                  + (processInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 border-2 border-brand-100 dark:border-brand-500/30 shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400 relative z-10">
                    <Icon size={26} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm z-20">
                    {i + 1}
                  </span>
                </div>
                <div className="text-[9px] font-bold text-brand-500 dark:text-brand-400 tracking-widest uppercase mb-1">{num}</div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px]">{desc}</p>
              </div>
            ))}
          </div>

          {/* CV Builder CTA */}
          <div className={'mt-10 flex flex-col sm:flex-row items-center gap-4 p-5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl transition-all duration-700 '
            + (processInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
            style={{ transitionDelay: '450ms' }}>
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 shadow-sm">
              <FileText size={22} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Don't have a CV ready?</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Use our CV Builder to create a professional CV in minutes — free for all applicants.</div>
            </div>
            <Link to="/profile"
              className="press inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20 whitespace-nowrap shrink-0">
              Open CV Builder <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Salary Guide ── */}
      <section id="section-salary" ref={salaryRef} className="py-14 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* Left: table */}
            <div>
              <div className={'mb-6 transition-all duration-700 ' + (salaryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Market rates</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Salary guide</h2>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Annual gross salary ranges across AX Group divisions — Malta market, 2026.</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Category</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Annual range (gross)</span>
                </div>
                {SALARY_GUIDE.map((item, i) => (
                  <SalaryRow key={item.category} item={item} index={i} inView={salaryInView} />
                ))}
              </div>
            </div>

            {/* Right: tips card */}
            <div className={'transition-all duration-700 ' + (salaryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}
              style={{ transitionDelay: '200ms' }}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden sticky top-24">
                <div className="h-1 bg-gradient-to-r from-brand-400 to-cyan-400" />
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                      <Target size={17} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Salary negotiation tips</div>
                      <div className="text-xs text-gray-400 dark:text-gray-600">3 rules that work</div>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { tip: 'Research before you talk', sub: 'Know the market range for your role and level before any conversation.'          },
                      { tip: 'Let them go first',        sub: 'Where possible, ask about the budgeted range before naming a number.'           },
                      { tip: 'Anchor high, not low',     sub: 'Your first number sets the ceiling — start above your target, not at it.'       },
                    ].map((t, i) => (
                      <li key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                          <span className="text-[9px] font-bold">{i + 1}</span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t.tip}</div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{t.sub}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button type="button" onClick={() => scrollTo('guides')}
                      className="press inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                      Read the salary negotiation guide <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="section-faq" ref={faqRef} className="py-14 px-4 sm:px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className={'mb-8 text-center transition-all duration-700 ' + (faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Common questions</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Frequently asked</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Can't find your answer?{' '}
              <Link to="/contact" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Contact us</Link>{' '}
              and we'll get back to you within one business day.
            </p>
          </div>
          <div className={'space-y-2 transition-all duration-700 ' + (faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}
            style={{ transitionDelay: '100ms' }}>
            {FAQS.map((item, i) => (
              <FaqItem key={i} item={item} open={openFaq === i}
                onToggle={() => setOpenFaq((prev) => (prev === i ? -1 : i))} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="px-4 sm:px-6 py-16 bg-gray-50 dark:bg-gray-950">
        <div className={
          'max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-brand-200 dark:border-brand-500/20 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-500/10 dark:via-gray-900 dark:to-gray-900 p-8 sm:p-12 shadow-sm transition-all duration-700 '
          + (ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)' }} />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Ready when you are</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Put your knowledge to work.<br />
                <span className="gradient-text">Browse open roles today.</span>
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                542+ vacancies across AX Group — hospitality, tech, construction, and more. One-click apply, no middlemen.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/jobs"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
                Browse all jobs <ArrowRight size={14} />
              </Link>
              <Link to="/profile"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors">
                Create candidate profile
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
