import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

export type PageId =
  | 'overview'
  | 'tokens'
  | 'theme-overview'
  | 'theme-color'
  | 'theme-dark-mode'
  | 'theme-typography'
  | 'theme-spacing'
  | 'theme-radius'
  | 'avatar'
  | 'button'
  | 'chat-message'
  | 'code-block'
  | 'composer'
  | 'icon-button'
  | 'scroll-area'
  | 'select'

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
      { id: 'tokens', label: 'Tokens', path: '/tokens' },
    ],
  },
  {
    heading: 'Theme',
    items: [
      { id: 'theme-overview',   label: 'Overview',    path: '/theme' },
      { id: 'theme-color',      label: 'Color',        path: '/theme/color' },
      { id: 'theme-dark-mode',  label: 'Dark Mode',    path: '/theme/dark-mode' },
      { id: 'theme-typography', label: 'Typography',   path: '/theme/typography' },
      { id: 'theme-spacing',    label: 'Spacing',      path: '/theme/spacing' },
      { id: 'theme-radius',     label: 'Radius',       path: '/theme/radius' },
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
      { id: 'scroll-area', label: 'ScrollArea', path: '/components/scroll-area' },
      { id: 'select', label: 'Select', path: '/components/select' },
    ],
  },
]

export interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${className ?? ''}`}>
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
