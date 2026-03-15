import type { ReactNode } from 'react'
import styles from './DocsLayout.module.css'

export interface DocsLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  className?: string
}

export function DocsLayout({ sidebar, children, className }: DocsLayoutProps) {
  return (
    <div className={`${styles.layout} ${className ?? ''}`}>
      {sidebar}
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
