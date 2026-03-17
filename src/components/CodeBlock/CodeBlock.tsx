import { useState, useCallback, type ReactNode, type HTMLAttributes } from 'react'
import { useHighlighter } from './useHighlighter'
import { useTheme } from '../../context/theme'
import styles from './CodeBlock.module.css'

/* ===========================
   Icons
   =========================== */

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
)

const CheckIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5l3.5 3.5 6.5-7" />
  </svg>
)

/* ===========================
   CodeBlock (root)
   =========================== */

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** CodeBlockContent */
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
   CodeBlockContent
   =========================== */

export interface CodeBlockContentProps
  extends Omit<HTMLAttributes<HTMLPreElement>, 'className' | 'children'> {
  /** Language identifier — enables syntax highlighting */
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
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [children])

  const lines = children.split('\n')

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
      <button
        className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
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
