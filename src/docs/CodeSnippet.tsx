import { useState, useCallback } from 'react'
import { IconButton } from '../components/IconButton/IconButton'
import styles from './CodeSnippet.module.css'

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

export interface CodeSnippetProps {
  children: string
  className?: string
}

export function CodeSnippet({ children, className }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [children])

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      <pre className={styles.pre}>
        <code className={styles.code}>{children}</code>
      </pre>
      <div className={styles.copyButton}>
        <IconButton
          variant="ghost"
          size="sm"
          label={copied ? 'Copied' : 'Copy to clipboard'}
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
      </div>
    </div>
  )
}
