import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-[#2d2d2d] bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#A8E80E] focus:ring-offset-2 focus:ring-offset-[#1c1c1d] disabled:cursor-not-allowed disabled:opacity-50',
            {
              'border-red-500 focus:ring-red-500': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input' 