import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Hammer, Home, Cpu, UtensilsCrossed, Sun,
  Trophy, Users, Target, Lightbulb, ArrowRight, ChevronDown,
} from 'lucide-react'

/* ── useInView ── */
function useInView(threshold = 0.1) {
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
const DIVISIONS = [
  {
    Icon: Building2,      name: 'AX Hotels',       tagline: 'Luxury hospitality',
    desc: "Five-star properties across Malta — from the iconic Verdala Hotel to the Odycy Hotel & Spa. Our hotels team delivers world-class guest experiences.",
    roles: '120+ open roles',
    lightColor: 'text-amber-700 bg-amber-50 border-amber-100',
    darkColor:  'dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    Icon: Hammer,         name: 'AX Construction',  tagline: "Building Malta's future",
    desc: "One of Malta's most trusted construction firms, delivering residential, commercial and infrastructure projects to the highest standards.",
    roles: '80+ open roles',
    lightColor: 'text-brand-700 bg-brand-50 border-brand-100',
    darkColor:  'dark:text-brand-400 dark:bg-brand-500/10 dark:border-brand-500/20',
    accent: 'from-brand-400 to-violet-600',
  },
  {
    Icon: Home,           name: 'AX Real Estate',   tagline: 'Premium properties',
    desc: "Sales, lettings and property management of Malta's most desirable addresses. A fast-growing team at the heart of the island's property market.",
    roles: '35+ open roles',
    lightColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    darkColor:  'dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    Icon: Cpu,            name: 'AX Tech',          tagline: 'Digital & innovation',
    desc: 'Building the software, infrastructure and digital products that power the entire AX Group. Engineers, designers and data people welcome.',
    roles: '40+ open roles',
    lightColor: 'text-cyan-700 bg-cyan-50 border-cyan-100',
    darkColor:  'dark:text-cyan-400 dark:bg-cyan-500/10 dark:border-cyan-500/20',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    Icon: UtensilsCrossed, name: 'AX Hospitality',  tagline: 'Food & beverage',
    desc: "Restaurants, catering and event venues operated to the same exacting standards as our hotels. Passionate people who love great food.",
    roles: '60+ open roles',
    lightColor: 'text-rose-700 bg-rose-50 border-rose-100',
    darkColor:  'dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20',
    accent: 'from-rose-400 to-pink-500',
  },
  {
    Icon: Sun,            name: 'AX Energy',        tagline: 'Renewable energy',
    desc: "Malta's renewable energy pioneer — solar farms, battery storage and sustainability consultancy. A growing division with serious ambition.",
    roles: '20+ open roles',
    lightColor: 'text-yellow-700 bg-yellow-50 border-yellow-100',
    darkColor:  'dark:text-yellow-400 dark:bg-yellow-500/10 dark:border-yellow-500/20',
    accent: 'from-yellow-400 to-amber-500',
  },
]

const VALUES = [
  { Icon: Trophy,     title: 'Excellence',   desc: "We hold ourselves to a high bar — in every hotel room, every brick laid, every line of code." },
  { Icon: Users,      title: 'People first', desc: "Our team is our greatest asset. We invest in careers, wellbeing and growth at every level."   },
  { Icon: Target,     title: 'Ambition',     desc: "We set bold targets and pursue them with focus. Growth isn't a coincidence — it's a habit."  },
  { Icon: Lightbulb,  title: 'Innovation',   desc: "From green energy to digital products, we look for smarter ways to do everything we do."      },
]

const MILESTONES = [
  { year: '1975', event: 'AX Group founded in Mosta by Alfred Pisani with a single construction project.' },
  { year: '1989', event: "Verdala Hotel opens — AX's first venture into luxury hospitality."              },
  { year: '2001', event: 'AX Real Estate established to manage the growing property portfolio.'           },
  { year: '2010', event: "AX Energy launches Malta's first large-scale solar farm."                       },
  { year: '2018', event: 'AX Tech division created to drive group-wide digital transformation.'           },
  { year: '2024', event: 'AX Group surpasses 2,000 employees across all divisions.'                      },
  { year: '2026', event: 'AX Jobs portal launched — one destination for every career opportunity.'        },
]

const STATS = [
  { val: '50+',    label: 'Years in business' },
  { val: '2,000+', label: 'Team members'      },
  { val: '6',      label: 'Business divisions' },
  { val: '542+',   label: 'Live vacancies'    },
]

/* ── Division Card ── */
function DivisionCard({ div, index, inView }: { div: typeof DIVISIONS[0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className={'transition-all duration-500 ' + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}
      style={{ transitionDelay: `${index * 70}ms` }}>
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="lift bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md overflow-hidden flex flex-col h-full cursor-pointer transition-all">
        <div className={`h-1 w-full bg-gradient-to-r ${div.accent}`} />
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${div.lightColor} ${div.darkColor}`}>
              <div.Icon size={18} />
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${div.lightColor} ${div.darkColor}`}>{div.roles}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{div.name}</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">{div.tagline}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{div.desc}</p>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link to="/jobs"
              className={`press inline-flex items-center gap-1 text-xs font-semibold transition-colors ${hovered ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-600'}`}>
              Browse roles <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

/* ── Value Card ── */
function ValueCard({ v, index, inView }: { v: typeof VALUES[0]; index: number; inView: boolean }) {
  return (
    <div className={'transition-all duration-500 ' + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-500/30 hover:shadow-sm transition-all lift">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
          <v.Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">{v.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function AboutUsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const [divisionsRef, divisionsInView] = useInView(0.05)
  const [valuesRef,    valuesInView]    = useInView(0.1)
  const [timelineRef,  timelineInView]  = useInView(0.05)
  const [statsRef,     statsInView]     = useInView(0.15)
  const [ctaRef,       ctaInView]       = useInView(0.2)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

      {/* ── Hero ── */}
      <section className="relative hero-grid overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)' }} />
        <div className="absolute top-[30%] right-[-80px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-18">
          <div className={'inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-full text-xs font-medium text-brand-700 dark:text-brand-300 mb-5 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
            <Building2 size={12} /> About AX Group
          </div>

          <h1 className={'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '80ms' }}>
            <span className="text-gray-900 dark:text-white block">Built in Malta.</span>
            <span className="gradient-text block">Grown over 50 years.</span>
          </h1>

          <p className={'text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mb-8 transition-all duration-700 '
            + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '160ms' }}>
            AX Group is one of Malta's most respected and diversified business groups — spanning hospitality, construction, real estate, technology, and renewable energy. We've been creating careers since 1975.
          </p>

          <div className={'flex flex-wrap gap-3 transition-all duration-700 ' + (mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}
            style={{ transitionDelay: '240ms' }}>
            <Link to="/jobs"
              className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
              View open roles <ArrowRight size={14} />
            </Link>
            <button type="button" onClick={() => scrollTo('section-divisions')}
              className="press inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors">
              Our divisions <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section ref={statsRef} className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-x divide-gray-100 dark:divide-gray-800">
            {STATS.map(({ val, label }, i) => (
              <div key={label} className={'pl-4 first:pl-0 transition-all duration-500 ' + (statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')}
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">{val}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-14 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: text */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">Who we are</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">A Maltese success story.</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>AX Group was founded in 1975 by Alfred Pisani with a vision to build a better Malta — one project at a time. What started as a construction firm has grown into one of the island's most diversified and respected business groups.</p>
              <p>Today, over 2,000 people across six divisions call AX Group their employer. From luxury hotel rooms to solar farms, from software platforms to residential developments — everything we do is built on the same foundation: quality people doing quality work.</p>
              <p>AX Jobs is our way of making it easier to find your place in that story.</p>
            </div>
          </div>

          {/* Right: timeline */}
          <div ref={timelineRef} className="relative border-l-2 border-brand-100 dark:border-brand-500/25 pl-6 space-y-5">
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year}
                className={'relative transition-all duration-500 ' + (timelineInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4')}
                style={{ transitionDelay: `${i * 60}ms` }}>
                {/* Dot on border */}
                <span className="absolute -left-[1.4375rem] top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-gray-950 border-2 border-brand-400 dark:border-brand-500" />
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">{year}</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divisions ── */}
      <section id="section-divisions" ref={divisionsRef} className="py-14 px-4 sm:px-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className={'mb-8 transition-all duration-700 ' + (divisionsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">What we do</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Our six divisions.</h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 max-w-lg">Every division runs its own career track — find the one that fits your skills and ambitions.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIVISIONS.map((div, i) => (
              <DivisionCard key={div.name} div={div} index={i} inView={divisionsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section ref={valuesRef} className="py-14 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className={'mb-8 text-center transition-all duration-700 ' + (valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5')}>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">What drives us</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Our values.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} v={v} index={i} inView={valuesInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="px-4 sm:px-6 py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className={
          'max-w-7xl mx-auto relative overflow-hidden rounded-3xl border border-brand-200 dark:border-brand-500/20 bg-gradient-to-br from-brand-50 via-white to-white dark:from-brand-500/10 dark:via-gray-900 dark:to-gray-900 p-8 sm:p-12 shadow-sm transition-all duration-700 '
          + (ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')}>
          <div className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)' }} />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Join the team</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                Be part of something<br />
                <span className="gradient-text">built to last.</span>
              </h3>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                542+ open roles across six divisions. One application — straight to the team that matters.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/jobs"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-brand-500/20">
                Browse all jobs <ArrowRight size={14} />
              </Link>
              <Link to="/information"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors">
                Career guides &amp; information
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
