import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export interface DocsLayoutProps {
  children: ReactNode
  className?: string
}

export function DocsLayout({ children, className }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={cn('min-h-screen overflow-x-hidden', className)}>
      <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className="flex min-h-[calc(100vh-56px)] pt-14">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className={cn(
            'hidden max-md:block fixed inset-0 z-40 bg-black/40 opacity-0 pointer-events-none transition-opacity motion-reduce:transition-none',
            sidebarOpen && 'opacity-100 pointer-events-auto'
          )}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <main className="flex-1 ml-60 min-w-0 min-h-[calc(100vh-56px)] max-md:ml-0">
          <div className="max-w-3xl mx-auto px-10 py-10 max-md:px-4 max-md:py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
