import * as React from 'react'
import { cn } from '../../lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indicatorClassName?: string
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    const clamped = Math.min(Math.max(value || 0, 0), 100)

    return (
      <div
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-800', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full flex-1 xp-gradient transition-all duration-500 ease-out',
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - clamped}%)` }}
        />
      </div>
    )
  },
)
Progress.displayName = 'Progress'
