import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

export type PageId =
  | 'overview'
  | 'tokens'
  | 'avatar'
  | 'button'
  | 'chat-message'
  | 'code-block'
  | 'composer'
  | 'icon-button'
  | 'select'
  | 'streaming-text'

interface SidebarItem {
  id: PageId
  label: string
  path: string
}

const sections: { heading: string; items: SidebarItem[] }[] = [
  {
    heading: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview', path: '/' },
      { id: 'tokens', label: 'Tokens', path: '/tokens' },
    ],
  },
  {
    heading: 'Components',
    items: [
      { id: 'avatar', label: 'Avatar', path: '/components/avatar' },
      { id: 'button', label: 'Button', path: '/components/button' },
      { id: 'chat-message', label: 'ChatMessage', path: '/components/chat-message' },
      { id: 'code-block', label: 'CodeBlock', path: '/components/code-block' },
      { id: 'composer', label: 'Composer', path: '/components/composer' },
      { id: 'icon-button', label: 'IconButton', path: '/components/icon-button' },
      { id: 'select', label: 'Select', path: '/components/select' },
      { id: 'streaming-text', label: 'StreamingText', path: '/components/streaming-text' },
    ],
  },
]

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${className ?? ''}`}>
      <div className={styles.logo}>
        <NavLink to="/" className={styles.logoLink}>
          <span className={styles.logoText}>Composure</span>
          <span className={styles.tagline}>UI for AI</span>
        </NavLink>
      </div>
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
