import { NavLink } from 'react-router-dom'
import { Github, Sun, Moon, Monitor, Menu } from 'lucide-react'
import { useTheme, type Theme } from '../context/theme'
import { cn } from '@/lib/utils'

function LogoMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="size-7 shrink-0"
      aria-hidden="true"
    >
      <rect x="15" y="32" width="70" height="9" fill="currentColor" />
      <rect x="25" y="46" width="50" height="9" fill="currentColor" />
      <rect x="35" y="60" width="30" height="9" fill="currentColor" />
    </svg>
  )
}

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark']

const THEME_LABELS: Record<Theme, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
}

const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const navIconBtn = 'flex items-center justify-center size-9 rounded-md text-secondary-foreground no-underline bg-transparent border-none cursor-pointer p-0 transition-colors duration-[120ms] motion-reduce:transition-none hover:text-foreground hover:bg-muted [&_svg]:size-5'

export interface NavbarProps {
  onMenuToggle?: () => void
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  function cycleTheme() {
    const idx = THEME_CYCLE.indexOf(theme)
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
    setTheme(next)
  }

  const ThemeIcon = THEME_ICONS[theme]

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-14 flex items-center justify-between px-6 bg-background border-b border-border">
      <NavLink to="/" className="flex items-center gap-3 no-underline text-foreground hover:opacity-80">
        <LogoMark />
      </NavLink>
      <div className="flex items-center gap-3">
        <button
          onClick={cycleTheme}
          className={navIconBtn}
          aria-label={THEME_LABELS[theme]}
          title={THEME_LABELS[theme]}
        >
          <ThemeIcon />
        </button>
        <a
          href="https://github.com/kkdaily/composure"
          target="_blank"
          rel="noopener noreferrer"
          className={navIconBtn}
          aria-label="View on GitHub"
        >
          <Github />
        </a>
        <button
          onClick={onMenuToggle}
          className={cn(navIconBtn, 'hidden max-md:flex')}
          aria-label="Toggle navigation menu"
        >
          <Menu />
        </button>
      </div>
    </header>
  )
}
