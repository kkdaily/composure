import { type ReactNode, type HTMLAttributes } from 'react'
import { useHighlighter } from './useHighlighter'
import { useTheme } from '../../context/theme'
import styles from './CodeBlock.module.css'

/* ===========================
   CodeBlock (root)
   =========================== */

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** CodeBlockHeader and/or CodeBlockContent */
  children: ReactNode
}

export function CodeBlock({ className, children, ...rest }: CodeBlockProps) {
  const classNames = [styles.codeBlock, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  )
}

/* ===========================
   CodeBlockHeader
   =========================== */

export interface CodeBlockHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Header content — filenames, copy buttons, language labels, etc. */
  children: ReactNode
}

export function CodeBlockHeader({ className, children, ...rest }: CodeBlockHeaderProps) {
  const classNames = [styles.header, className ?? '']
    .filter(Boolean)
    .join(' ')

  return <div className={classNames} {...rest}>{children}</div>
}

/* ===========================
   CodeBlockContent
   =========================== */

export interface CodeBlockContentProps
  extends Omit<HTMLAttributes<HTMLPreElement>, 'className' | 'children'> {
  /** Language identifier — sets a data attribute for future syntax highlighting integration */
  language?: string
  /** Show line numbers in the gutter */
  showLineNumbers?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Code string to display */
  children: string
}

export function CodeBlockContent({
  language,
  showLineNumbers = false,
  className,
  children,
  ...rest
}: CodeBlockContentProps) {
  const { resolvedTheme } = useTheme()
  const { tokens, ready } = useHighlighter(children, language, resolvedTheme)

  const lines = children.split('\n')

  // Remove trailing empty line that often appears in template literals
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  const preClassNames = [
    styles.pre,
    showLineNumbers ? styles.withLineNumbers : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  // Render highlighted tokens when ready, plain text as fallback
  const renderLine = (lineIndex: number) => {
    if (ready && tokens[lineIndex]) {
      return tokens[lineIndex].map((token, j) => (
        <span key={j} style={token.color ? { color: token.color } : undefined}>
          {token.content}
        </span>
      ))
    }
    return lines[lineIndex] || '\n'
  }

  return (
    <pre className={preClassNames} tabIndex={0} {...rest}>
      <code
        className={styles.code}
        {...(language ? { 'data-language': language } : {})}
      >
        {showLineNumbers
          ? lines.map((_, i) => (
              <span key={i} className={styles.line}>
                <span className={styles.lineNumber} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.lineContent}>
                  {renderLine(i)}
                </span>
              </span>
            ))
          : ready && tokens.length > 0
            ? tokens.map((line, i) => (
                <span key={i}>
                  {line.map((token, j) => (
                    <span
                      key={j}
                      style={token.color ? { color: token.color } : undefined}
                    >
                      {token.content}
                    </span>
                  ))}
                  {i < tokens.length - 1 ? '\n' : ''}
                </span>
              ))
            : children}
      </code>
    </pre>
  )
}
