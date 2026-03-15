import { useMemo, type HTMLAttributes } from 'react'
import styles from './StreamingText.module.css'

/* ===========================
   StreamingText
   =========================== */

export interface StreamingTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'> {
  /** The text content to render with streaming effects */
  children: string
  /** Visual effect applied to newly revealed text */
  effect?: 'fade' | 'none'
  /** Additional CSS class for external overrides */
  className?: string
}

export function StreamingText({
  children,
  effect = 'fade',
  className,
  ...rest
}: StreamingTextProps) {
  // Split text into individual characters, each wrapped in a span with
  // a staggered animation delay for the fade effect
  const characters = useMemo(() => {
    if (effect === 'none') return null

    return children.split('').map((char, i) => (
      <span
        key={i}
        className={styles.char}
        style={{ animationDelay: `${i * 30}ms` }}
      >
        {char}
      </span>
    ))
  }, [children, effect])

  const classNames = [styles.streamingText, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames} {...rest}>
      {effect === 'fade' ? (
        <>
          {/* Screen reader gets the full text */}
          <span className={styles.srOnly}>{children}</span>
          {/* Visual characters with fade animation */}
          <span aria-hidden="true">{characters}</span>
        </>
      ) : (
        children
      )}
    </span>
  )
}
