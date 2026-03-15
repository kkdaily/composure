import type { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

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
  const classNames = [
    styles.iconButton,
    styles[variant],
    styles[size],
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      aria-label={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={type}
      {...rest}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.icon} aria-hidden="true">
          {children}
        </span>
      )}
    </button>
  )
}
