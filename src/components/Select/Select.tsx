import { useId, useRef, useEffect, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

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

const sizeClasses = {
  sm: 'h-7 text-xs pl-3 pr-8',
  md: 'h-9 text-sm pl-4 pr-10',
  lg: 'h-11 text-base pl-5 pr-12',
} as const

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

  return (
    <div className="inline-flex flex-col gap-1">
      {label && (
        <label
          className="text-sm font-medium text-foreground"
          htmlFor={selectId}
        >
          {label}
        </label>
      )}
      <div className="relative inline-flex">
        <span
          ref={rulerRef}
          className="absolute -top-[9999px] -left-[9999px] invisible whitespace-nowrap pointer-events-none font-sans font-normal"
          style={{ fontSize: FONT_SIZE[size] }}
          aria-hidden="true"
        >
          {selectedLabel}
        </span>
        <select
          ref={selectRef}
          id={selectId}
          className={cn(
            'appearance-none w-full bg-background text-foreground border border-border rounded-md font-sans font-normal leading-none cursor-pointer transition-colors duration-[120ms] ease-out',
            'hover:not-disabled:border-muted-foreground',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'motion-reduce:transition-none',
            sizeClasses[size],
            variant === 'ghost' &&
              'bg-transparent border-transparent text-muted-foreground hover:not-disabled:border-transparent hover:not-disabled:bg-muted hover:not-disabled:text-foreground',
            className
          )}
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
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-muted-foreground text-sm"
          aria-hidden="true"
        >
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
