import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'amber'
  children?: React.ReactNode
  className?: string
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-violet-500/20 text-violet-300 border border-violet-500/30',
    secondary: 'border-transparent bg-zinc-800 text-zinc-300 border border-zinc-700',
    outline: 'border-zinc-700 text-zinc-300',
    success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
    warning: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
    destructive: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
    amber: 'border-amber-500/40 bg-amber-500/20 text-amber-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
