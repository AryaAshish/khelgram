import { useInView } from '@/hooks/useInView'
import type { ReactNode } from 'react'

export type RevealOnScrollProps = {
  children: ReactNode
  className?: string
  delayMs?: number
}

export function RevealOnScroll({ children, className = '', delayMs = 0 }: RevealOnScrollProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${inView ? 'reveal-on-scroll--visible' : ''} ${className}`.trim()}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
