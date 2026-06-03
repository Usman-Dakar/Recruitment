import { useRef, useState, useEffect } from 'react'

export function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect() } },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView] as const
}
