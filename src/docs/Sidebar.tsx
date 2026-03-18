import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    onClose?.()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav
      className={cn(
        'w-60 min-w-60 h-[calc(100vh-56px)] fixed top-14 left-0 z-50 overflow-y-auto bg-background border-r border-border py-5 pb-10 flex flex-col gap-5',
        'max-md:w-full max-md:min-w-full max-md:border-r-0 max-md:opacity-0 max-md:invisible max-md:transition-[opacity,visibility] max-md:duration-[220ms] motion-reduce:transition-none',
        open && 'max-md:opacity-100 max-md:visible max-md:transition-none',
        className
      )}
    >
      {sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-0.5">
          <h3 className="px-5 py-2 text-xs font-semibold text-muted-foreground tracking-tight mb-0.5 max-md:px-6">
            {section.heading}
          </h3>
          <ul className="list-none flex flex-col">
            {section.items.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    cn(
                      'block w-full py-1.5 px-5 pl-[22px] border-l-2 border-transparent text-sm text-secondary-foreground no-underline cursor-pointer text-left transition-colors duration-[120ms] motion-reduce:transition-none hover:text-foreground',
                      'max-md:py-3 max-md:px-6 max-md:pl-[26px] max-md:text-base',
                      isActive && 'text-primary border-l-primary font-medium hover:text-primary'
                    )
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
