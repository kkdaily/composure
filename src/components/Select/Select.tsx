import { useId, type SelectHTMLAttributes } from 'react'
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
  /** Whether the entire select is disabled */
  disabled?: boolean
  /** Additional CSS class for external overrides */
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  label,
  size = 'md',
  disabled = false,
  className,
  ...rest
}: SelectProps) {
  const generatedId = useId()
  const selectId = rest.id ?? generatedId

  const selectClassNames = [styles.select, styles[size], className ?? '']
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
        <select
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
