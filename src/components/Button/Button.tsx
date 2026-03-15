import type { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

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
  const classNames = [
    styles.button,
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={type}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && before && (
        <span className={styles.slotBefore} aria-hidden="true">{before}</span>
      )}
      <span className={styles.label}>{children}</span>
      {after && <span className={styles.slotAfter} aria-hidden="true">{after}</span>}
    </button>
  )
}
