import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Element rendered before the label (e.g. an icon) */
  before?: ReactNode
  /** Element rendered after the label (e.g. an icon) */
  after?: ReactNode
  /** Shows a spinner and disables interaction */
  loading?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Button contents */
  children: ReactNode
}

const variantClasses = {
  primary:
    'bg-primary text-primary-foreground border-primary hover:not-disabled:bg-primary/90 hover:not-disabled:border-primary/90',
  secondary:
    'bg-muted text-foreground border-border hover:not-disabled:bg-border',
  ghost:
    'bg-transparent text-muted-foreground hover:not-disabled:bg-muted hover:not-disabled:text-foreground',
  destructive:
    'bg-destructive text-destructive-foreground border-destructive hover:not-disabled:opacity-90',
} as const

const sizeClasses = {
  sm: 'h-7 text-xs px-3 gap-1',
  md: 'h-9 text-sm px-4 gap-2',
  lg: 'h-11 text-base px-5 gap-2',
} as const

export function Button({
  variant = 'secondary',
  size = 'md',
  before,
  after,
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 border border-transparent rounded-md font-sans font-medium leading-none cursor-pointer select-none whitespace-nowrap transition-colors duration-[120ms] ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'motion-reduce:transition-none',
        variantClasses[variant],
        sizeClasses[size],
        loading && 'relative',
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={type}
      {...rest}
    >
      {loading && (
        <span
          className="inline-block size-[1em] border-2 border-current border-r-transparent rounded-full animate-spin motion-reduce:animate-none shrink-0"
          aria-hidden="true"
        />
      )}
      {!loading && before && (
        <span className="inline-flex items-center shrink-0 [&>svg]:size-[1em]" aria-hidden="true">
          {before}
        </span>
      )}
      <span className="inline-flex items-center">{children}</span>
      {after && (
        <span className="inline-flex items-center shrink-0 [&>svg]:size-[1em]" aria-hidden="true">
          {after}
        </span>
      )}
    </button>
  )
}
