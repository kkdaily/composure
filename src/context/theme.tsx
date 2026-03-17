import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
export type AccentColor =
  | 'indigo'
  | 'violet'
  | 'blue'
  | 'teal'
  | 'green'
  | 'orange'
  | 'red'
  | 'crimson'

export const ACCENT_COLORS: AccentColor[] = [
  'indigo',
  'violet',
  'blue',
  'teal',
  'green',
  'orange',
  'red',
  'crimson',
]

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'composure-theme'
const ACCENT_STORAGE_KEY = 'composure-accent'
const DEFAULT_ACCENT: AccentColor = 'indigo'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {}
  return 'system'
}

function readStoredAccent(fallback: AccentColor): AccentColor {
  try {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY)
    if (stored && ACCENT_COLORS.includes(stored as AccentColor)) {
      return stored as AccentColor
    }
  } catch {}
  return fallback
}

function applyAccent(color: AccentColor) {
  document.documentElement.setAttribute('data-accent', color)
}

interface ThemeProviderProps {
  children: ReactNode
  accentColor?: AccentColor
}

export function ThemeProvider({
  children,
  accentColor: accentColorProp = DEFAULT_ACCENT,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const stored = readStoredTheme()
    if (stored === 'light' || stored === 'dark') return stored
    return getSystemTheme()
  })

  const [accentColor, setAccentColorState] = useState<AccentColor>(() =>
    readStoredAccent(accentColorProp),
  )

  useEffect(() => {
    applyTheme(theme)
    if (theme === 'system') {
      setResolvedTheme(getSystemTheme())
    } else {
      setResolvedTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  useEffect(() => {
    applyAccent(accentColor)
  }, [accentColor])

  function setTheme(next: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    setThemeState(next)
  }

  function setAccentColor(next: AccentColor) {
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next)
    } catch {}
    setAccentColorState(next)
  }

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, accentColor, setAccentColor }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
