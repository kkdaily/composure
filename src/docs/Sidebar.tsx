import styles from './Sidebar.module.css'

export type PageId =
  | 'overview'
  | 'tokens'
  | 'button'
  | 'chat-bubble'
  | 'message-list'
  | 'composer'
  | 'streaming-text'
  | 'code-block'
  | 'copy-button'
  | 'avatar'
  | 'icon-button'
  | 'tooltip'
  | 'loading-dots'

interface SidebarItem {
  id: PageId
  label: string
}

const sections: { heading: string; items: SidebarItem[] }[] = [
  {
    heading: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'tokens', label: 'Tokens' },
    ],
  },
  {
    heading: 'Components',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'chat-bubble', label: 'ChatBubble' },
      { id: 'message-list', label: 'MessageList' },
      { id: 'composer', label: 'Composer' },
      { id: 'streaming-text', label: 'StreamingText' },
      { id: 'code-block', label: 'CodeBlock' },
      { id: 'copy-button', label: 'CopyButton' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'icon-button', label: 'IconButton' },
      { id: 'tooltip', label: 'Tooltip' },
      { id: 'loading-dots', label: 'LoadingDots' },
    ],
  },
]

export interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
  className?: string
}

export function Sidebar({ activePage, onNavigate, className }: SidebarProps) {
  return (
    <nav className={`${styles.sidebar} ${className ?? ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Composure</span>
        <span className={styles.tagline}>UI for AI</span>
      </div>
      {sections.map((section) => (
        <div key={section.heading} className={styles.section}>
          <h3 className={styles.sectionHeading}>{section.heading}</h3>
          <ul className={styles.list}>
            {section.items.map((item) => (
              <li key={item.id}>
                <button
                  className={`${styles.item} ${activePage === item.id ? styles.active : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
