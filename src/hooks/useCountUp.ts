import { useEffect, useRef, useState } from 'react'
import { parseNumericValue } from '@/lib/parseStatValue'

export function useCountUp(value: string, durationMs = 1200) {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = parseNumericValue(value)
  const [display, setDisplay] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!parsed) {
      return
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    const element = ref.current
    if (!element || hasAnimated.current || typeof IntersectionObserver === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || hasAnimated.current) {
          return
        }

        hasAnimated.current = true
        const start = performance.now()
        const { prefix, number, suffix } = parsed

        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1)
          const current = Math.round(number * progress)
          setDisplay(`${prefix}${current.toLocaleString('en-IN')}${suffix}`)
          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [durationMs, parsed, value])

  return { ref, display: parsed ? display : value }
}
