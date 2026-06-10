import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:bg-gray-100',
        className,
      )}
      {...props}
    />
  )
}
