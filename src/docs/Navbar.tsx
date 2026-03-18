import { useState, useRef, useEffect, type JSX } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme, ACCENT_COLORS, type Theme, type AccentColor } from '../context/theme'
import styles from './Navbar.module.css'

function LogoMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.logoMark}
      aria-hidden="true"
    >
      <rect x="15" y="32" width="70" height="9" fill="currentColor" />
      <rect x="25" y="46" width="50" height="9" fill="currentColor" />
      <rect x="35" y="60" width="30" height="9" fill="currentColor" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark']

const THEME_LABELS: Record<Theme, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

const THEME_ICONS: Record<Theme, () => JSX.Element> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
}

/** Static hex per accent so swatches don't rely on CSS vars */
const ACCENT_HEX: Record<AccentColor, string> = {
  indigo: '#6366f1',
  violet: '#7c3aed',
  blue: '#2563eb',
  teal: '#0d9488',
  green: '#16a34a',
  orange: '#ea580c',
  red: '#dc2626',
  crimson: '#e11d48',
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="14" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function AccentPicker() {
  const { accentColor, setAccentColor } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className={styles.accentPickerContainer} ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={styles.iconButton}
        aria-label="Change accent color"
        title="Change accent color"
        aria-expanded={open}
      >
        <PaletteIcon />
      </button>
      {open && (
        <div className={styles.accentPopover} role="listbox" aria-label="Accent colors">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              role="option"
              aria-selected={color === accentColor}
              aria-label={color}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
              className={[
                styles.accentSwatch,
                color === accentColor ? styles.accentSwatchActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ backgroundColor: ACCENT_HEX[color] }}
              onClick={() => {
                setAccentColor(color)
                setOpen(false)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

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
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        <LogoMark />
        <span className={styles.brandName}>Composure</span>
      </NavLink>
      <div className={styles.actions}>
        <AccentPicker />
        <button
          onClick={cycleTheme}
          className={styles.iconButton}
          aria-label={THEME_LABELS[theme]}
          title={THEME_LABELS[theme]}
        >
          <ThemeIcon />
        </button>
        <a
          href="https://github.com/kkdaily/composure"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.iconButton}
          aria-label="View on GitHub"
        >
          <GitHubIcon />
        </a>
        <button
          onClick={onMenuToggle}
          className={`${styles.iconButton} ${styles.hamburger}`}
          aria-label="Toggle navigation menu"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  )
}
