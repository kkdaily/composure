import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
  type FormHTMLAttributes,
  type TextareaHTMLAttributes,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/utils'

/* ===========================
   Context
   =========================== */

interface ComposerContextValue {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  onSubmit: () => void
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

function useComposerContext() {
  const ctx = useContext(ComposerContext)
  if (!ctx) {
    throw new Error(
      'Composer sub-components must be rendered inside <Composer>'
    )
  }
  return ctx
}

/* ===========================
   Composer (root)
   =========================== */

export interface ComposerProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'className' | 'onSubmit' | 'onChange'> {
  /** Current value of the input (controlled) */
  value: string
  /** Called when the input value changes */
  onChange: (value: string) => void
  /** Called when the user submits (Enter or send button) */
  onSubmit?: (value: string) => void
  /** Disables the entire composer */
  disabled?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Composer sub-components */
  children: ReactNode
}

export function Composer({
  value,
  onChange,
  onSubmit,
  disabled = false,
  className,
  children,
  ...rest
}: ComposerProps) {
  const handleSubmit = useCallback(() => {
    if (disabled || !value.trim()) return
    onSubmit?.(value)
  }, [disabled, value, onSubmit])

  const handleFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      handleSubmit()
    },
    [handleSubmit]
  )

  return (
    <ComposerContext.Provider
      value={{ value, onChange, disabled, onSubmit: handleSubmit }}
    >
      <form
        className={cn(
          'flex flex-wrap items-end gap-2 p-3 bg-card border border-border rounded-lg transition-colors duration-100 ease-out focus-within:border-primary motion-reduce:transition-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onSubmit={handleFormSubmit}
        aria-label="Message composer"
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </form>
    </ComposerContext.Provider>
  )
}

/* ===========================
   ComposerInput
   =========================== */

export interface ComposerInputProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'className' | 'value' | 'onChange' | 'disabled'
  > {
  /** Placeholder text */
  placeholder?: string
  /** Maximum number of rows before scrolling */
  maxRows?: number
  /** Minimum number of visible rows */
  minRows?: number
  /** Additional CSS class for external overrides */
  className?: string
}

export function ComposerInput({
  placeholder = 'Send a message\u2026',
  maxRows = 8,
  minRows = 1,
  className,
  ...rest
}: ComposerInputProps) {
  const { value, onChange, disabled, onSubmit } = useComposerContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to measure scrollHeight accurately
    textarea.style.height = 'auto'

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 22
    const maxHeight = lineHeight * maxRows
    const minHeight = lineHeight * minRows

    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [value, maxRows, minRows])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    },
    [onSubmit]
  )

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        'flex-1 min-w-0 border-none bg-transparent resize-none outline-none font-sans text-sm text-foreground leading-relaxed py-2 m-0 placeholder:text-muted-foreground focus-visible:outline-none',
        disabled && 'cursor-not-allowed',
        className
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={minRows}
      aria-label={placeholder}
      {...rest}
    />
  )
}

/* ===========================
   ComposerFooter
   =========================== */

export interface ComposerFooterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Whether to show a border between the footer and the input area */
  bordered?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Footer content — typically ComposerFooterStart and/or ComposerFooterEnd */
  children: ReactNode
}

export function ComposerFooter({ bordered = true, className, children, ...rest }: ComposerFooterProps) {
  return (
    <div
      className={cn(
        'basis-full flex items-center gap-2 pt-2',
        bordered ? 'border-t border-border' : '',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ===========================
   ComposerFooterStart
   =========================== */

export interface ComposerFooterStartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Left-aligned footer items */
  children: ReactNode
}

export function ComposerFooterStart({
  className,
  children,
  ...rest
}: ComposerFooterStartProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...rest}>
      {children}
    </div>
  )
}

/* ===========================
   ComposerFooterEnd
   =========================== */

export interface ComposerFooterEndProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Right-aligned footer items */
  children: ReactNode
}

/* ===========================
   ComposerHeader
   =========================== */

export interface ComposerHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Whether to show a border between the header and the input area */
  bordered?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Header content — typically ComposerHeaderStart and/or ComposerHeaderEnd */
  children: ReactNode
}

export function ComposerHeader({ bordered = false, className, children, ...rest }: ComposerHeaderProps) {
  return (
    <div
      className={cn(
        'basis-full flex items-center gap-2 pb-2 -order-1',
        bordered && 'border-b border-border',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ===========================
   ComposerHeaderStart
   =========================== */

export interface ComposerHeaderStartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Left-aligned header items */
  children: ReactNode
}

export function ComposerHeaderStart({
  className,
  children,
  ...rest
}: ComposerHeaderStartProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)} {...rest}>
      {children}
    </div>
  )
}

/* ===========================
   ComposerHeaderEnd
   =========================== */

export interface ComposerHeaderEndProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Right-aligned header items */
  children: ReactNode
}

export function ComposerHeaderEnd({
  className,
  children,
  ...rest
}: ComposerHeaderEndProps) {
  return (
    <div className={cn('flex items-center gap-2 ml-auto', className)} {...rest}>
      {children}
    </div>
  )
}

export function ComposerFooterEnd({
  className,
  children,
  ...rest
}: ComposerFooterEndProps) {
  return (
    <div className={cn('flex items-center gap-2 ml-auto', className)} {...rest}>
      {children}
    </div>
  )
}
