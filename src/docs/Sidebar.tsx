import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import styles from './Sidebar.module.css'

export type PageId =
  | 'overview'
  | 'chat-message'
  | 'code-block'
  | 'composer'
  | 'file-preview'
  | 'markdown-renderer'
  | 'scroll-area'

interface SidebarItem {
  id: PageId
  label: string
  path: string
}

const sections: { heading: string; items: SidebarItem[] }[] = [
  {
    heading: 'Overview',
    items: [
      { id: 'overview', label: 'Getting Started', path: '/' },
    ],
  },
  {
    heading: 'Components',
    items: [
      { id: 'chat-message', label: 'ChatMessage', path: '/components/chat-message' },
      { id: 'code-block', label: 'CodeBlock', path: '/components/code-block' },
      { id: 'composer', label: 'Composer', path: '/components/composer' },
      { id: 'file-preview', label: 'FilePreview', path: '/components/file-preview' },
      { id: 'markdown-renderer', label: 'MarkdownRenderer', path: '/components/markdown-renderer' },
      { id: 'scroll-area', label: 'ScrollArea', path: '/components/scroll-area' },
    ],
  },
]

export interface SidebarProps {
  open?: boolean
  onClose?: () => void
  className?: string
}

export function Sidebar({ open, onClose, className }: SidebarProps) {
  const location = useLocation()

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    onClose?.()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav
      className={[
        styles.sidebar,
        open ? styles.sidebarOpen : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {sections.map((section) => (
        <div key={section.heading} className={styles.section}>
          <h3 className={styles.sectionHeading}>{section.heading}</h3>
          <ul className={styles.list}>
            {section.items.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `${styles.item} ${isActive ? styles.active : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
