import { useId, useRef, useEffect, type SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

/* ===========================
   Types
   =========================== */

export interface SelectOption {
  /** The value submitted when this option is selected */
  value: string
  /** Display text for the option */
  label: string
  /** Whether this option is unselectable */
  disabled?: boolean
}

/* ===========================
   Select
   =========================== */

export interface SelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'className' | 'size' | 'value' | 'onChange'
  > {
  /** Current selected value */
  value: string
  /** Called when the selection changes */
  onChange: (value: string) => void
  /** Available options */
  options: SelectOption[]
  /** Placeholder text shown when no value is selected */
  placeholder?: string
  /** Visible label rendered above the select */
  label?: string
  /** Size of the select */
  size?: 'sm' | 'md' | 'lg'
  /** Visual style — 'default' shows a border and background, 'ghost' is borderless and transparent */
  variant?: 'default' | 'ghost'
  /** Whether the entire select is disabled */
  disabled?: boolean
  /** Additional CSS class for external overrides */
  className?: string
}

const FONT_SIZE: Record<string, string> = {
  sm: 'var(--text-xs)',
  md: 'var(--text-sm)',
  lg: 'var(--text-base)',
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  size = 'md',
  variant = 'default',
  disabled = false,
  className,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = rest.id ?? generatedId
  const selectRef = useRef<HTMLSelectElement>(null)
  const rulerRef = useRef<HTMLSpanElement>(null)

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder ?? ''

  useEffect(() => {
    const select = selectRef.current
    const ruler = rulerRef.current
    if (!select || !ruler) return
    const computed = window.getComputedStyle(select)
    const extra =
      parseFloat(computed.paddingLeft) +
      parseFloat(computed.paddingRight) +
      parseFloat(computed.borderLeftWidth) +
      parseFloat(computed.borderRightWidth)
    select.style.width = `${ruler.offsetWidth + extra}px`
  }, [value, size, options])

  const selectClassNames = [
    styles.select,
    styles[size],
    variant === 'ghost' ? styles.ghost : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <span
          ref={rulerRef}
          className={styles.ruler}
          style={{ fontSize: FONT_SIZE[size] }}
          aria-hidden="true"
        >
          {selectedLabel}
        </span>
        <select
          ref={selectRef}
          id={selectId}
          className={selectClassNames}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </div>
    </div>
  )
}
