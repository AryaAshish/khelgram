import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean
}

export function Card({ className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white',
        elevated
          ? 'card-elevated border-[var(--color-border)] shadow-[var(--shadow-sm)]'
          : 'border-gray-200 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
