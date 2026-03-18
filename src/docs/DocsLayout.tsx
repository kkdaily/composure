import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import styles from './DocsLayout.module.css'

export interface DocsLayoutProps {
  children: ReactNode
  className?: string
}

export function DocsLayout({ children, className }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className={styles.layout}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </div>
  )
}
