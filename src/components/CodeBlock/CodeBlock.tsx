import { useState, useCallback, type ReactNode, type HTMLAttributes } from 'react'
import { Copy, Check } from 'lucide-react'
import { useHighlighter } from './useHighlighter'
import { useTheme } from '../../context/theme'
import { cn } from '@/lib/utils'

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
  return (
    <div
      className={cn(
        'group/code bg-muted border border-border rounded-md overflow-hidden',
        className
      )}
      {...rest}
    >
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
    <pre
      className={cn(
        'relative m-0 p-3 px-4 overflow-x-auto font-mono text-sm leading-relaxed text-foreground bg-transparent',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2 focus-visible:rounded-sm',
        className
      )}
      tabIndex={0}
      {...rest}
    >
      <button
        className={cn(
          'absolute top-2 right-2 flex items-center justify-center w-7 h-7 p-0 bg-card border border-border rounded-sm text-secondary-foreground text-sm cursor-pointer opacity-0 group-hover/code:opacity-100 transition-all duration-100 ease-out hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:opacity-100 motion-reduce:transition-none',
          copied && 'text-composure-success'
        )}
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check className="size-[1em]" /> : <Copy className="size-[1em]" />}
      </button>
      <code
        className={cn(
          'block whitespace-pre font-[inherit] text-[inherit] leading-[inherit] text-inherit',
          showLineNumbers && '[display:table] w-full'
        )}
        {...(language ? { 'data-language': language } : {})}
      >
        {showLineNumbers
          ? lines.map((_, i) => (
              <span key={i} className="code-line">
                <span className="code-line-number" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="code-line-content">
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
