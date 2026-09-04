import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer'

    const variants = {
      default: 'bg-purple-600 text-white hover:bg-purple-500 glow-purple shadow-sm active:scale-[0.98]',
      destructive: 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm active:scale-[0.98]',
      outline:
        'border border-zinc-700/80 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 active:scale-[0.98]',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:scale-[0.98]',
      ghost: 'hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100',
      link: 'text-purple-400 underline-offset-4 hover:underline p-0 h-auto',
      glow: 'bg-purple-600 hover:bg-purple-500 text-white glow-purple hover:brightness-110 active:scale-[0.98]',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-lg px-6 text-base',
      icon: 'h-9 w-9 p-0',
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
