import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SectionShellVariant = 'default' | 'warm' | 'festival' | 'impact-band'

export type SectionShellProps = HTMLAttributes<HTMLElement> & {
  variant?: SectionShellVariant
  id?: string
  children: ReactNode
  /** Extra top padding for fixed header clearance (hero sections). */
  heroOffset?: boolean
}

const variantClass: Record<SectionShellVariant, string> = {
  default: 'section-shell',
  warm: 'section-shell section-shell--warm',
  festival: 'section-shell section-shell--festival',
  'impact-band': 'section-shell section-shell--impact-band',
}

export function SectionShell({
  variant = 'default',
  id,
  children,
  heroOffset = false,
  className,
  ...props
}: SectionShellProps) {
  return (
    <section
      id={id}
      data-variant={variant}
      className={cn(variantClass[variant], heroOffset && 'section-shell--hero-offset', className)}
      {...props}
    >
      {children}
    </section>
  )
}
