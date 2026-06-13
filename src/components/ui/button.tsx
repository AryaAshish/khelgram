import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'festival' | 'ghost'
}

export function Button({ className, type = 'button', variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' && 'bg-green-500 text-white hover:bg-green-600',
        variant === 'outline' && 'border border-green-500 text-green-600 hover:bg-green-50',
        variant === 'festival' &&
          'border-0 bg-[var(--color-saffron)] text-white shadow-md hover:bg-[#c2410c]',
        variant === 'ghost' &&
          'border-0 bg-transparent text-[var(--color-earth)] hover:bg-green-50',
        className,
      )}
      {...props}
    />
  )
}
