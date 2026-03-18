import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label (rendered as aria-label) */
  label: string
  /** Shows a spinner and disables interaction */
  loading?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** The icon element */
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
  sm: 'size-7 text-sm',
  md: 'size-9 text-base',
  lg: 'size-11 text-lg',
} as const

export function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center border border-transparent rounded-md cursor-pointer select-none transition-colors duration-[120ms] ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'motion-reduce:transition-none',
        variantClasses[variant],
        sizeClasses[size],
        loading && 'relative',
        className
      )}
      aria-label={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={type}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block size-[1em] border-2 border-current border-r-transparent rounded-full animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : (
        <span className="inline-flex items-center justify-center [&>svg]:size-[1em]" aria-hidden="true">
          {children}
        </span>
      )}
    </button>
  )
}
