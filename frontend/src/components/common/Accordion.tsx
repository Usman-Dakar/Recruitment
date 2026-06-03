import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
}

export default function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(() => {
    if (defaultOpenId) return defaultOpenId
    if (items.length === 1) return items[0].id
    const hash = window.location.hash.slice(1)
    return items.find((i) => i.id === hash)?.id ?? null
  })

  const headingRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const match = items.find((i) => i.id === hash)
    if (match) {
      setOpenId(match.id)
      requestAnimationFrame(() => {
        headingRefs.current[match.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }, [items])

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="space-y-3" role="list">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            id={item.id}
            ref={(el) => { headingRefs.current[item.id] = el }}
            className="glass rounded-xl overflow-hidden"
            role="listitem"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset rounded-xl"
            >
              <span
                className={cn(
                  'font-semibold transition-colors',
                  isOpen
                    ? 'text-brand-400'
                    : 'text-slate-200 group-hover:text-white',
                )}
              >
                {item.title}
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0',
                  isOpen && 'rotate-180 text-brand-400',
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm text-slate-400 leading-relaxed border-t border-white/5 animate-fade-in-up">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
