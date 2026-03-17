import { useTheme, ACCENT_COLORS, type AccentColor } from '../../../context/theme'
import { CodeSnippet } from '../../CodeSnippet'
import styles from './ThemePage.module.css'

const ACCENT_HEX: Record<AccentColor, { light: string; dark: string; label: string }> = {
  indigo:  { light: '#5f61ee', dark: '#818cf8',  label: 'Indigo' },
  violet:  { light: '#7c3aed', dark: '#a78bfa',  label: 'Violet' },
  blue:    { light: '#2563eb', dark: '#60a5fa',  label: 'Blue' },
  teal:    { light: '#0d9488', dark: '#2dd4bf',  label: 'Teal' },
  green:   { light: '#16a34a', dark: '#4ade80',  label: 'Green' },
  orange:  { light: '#ea580c', dark: '#fb923c',  label: 'Orange' },
  red:     { light: '#dc2626', dark: '#f87171',  label: 'Red' },
  crimson: { light: '#e11d48', dark: '#fb7185',  label: 'Crimson' },
}

const semanticTokens = [
  { variable: '--color-bg-1',            label: 'Background 1',      description: 'Page background' },
  { variable: '--color-bg-2',            label: 'Background 2',      description: 'Sidebar, cards' },
  { variable: '--color-bg-3',            label: 'Background 3',      description: 'Hover states, inputs' },
  { variable: '--color-text-primary',    label: 'Text Primary',      description: 'Headings, body' },
  { variable: '--color-text-secondary',  label: 'Text Secondary',    description: 'Supporting text' },
  { variable: '--color-text-muted',      label: 'Text Muted',        description: 'Labels, captions' },
  { variable: '--color-accent',          label: 'Accent',            description: 'Links, active states, buttons' },
  { variable: '--color-accent-hover',    label: 'Accent Hover',      description: 'Hover state for accent' },
  { variable: '--color-border',          label: 'Border',            description: 'Dividers, outlines' },
  { variable: '--color-user-bubble',     label: 'User Bubble',       description: 'Chat user message background' },
  { variable: '--color-assistant-bubble',label: 'Assistant Bubble',  description: 'Chat assistant message background' },
  { variable: '--color-destructive',     label: 'Destructive',       description: 'Errors, delete actions' },
]

export function ColorPage() {
  const { accentColor, setAccentColor, resolvedTheme } = useTheme()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Color</h1>
      <p className={styles.subtitle}>
        Curated accent palettes and semantic color tokens that adapt across light and dark modes.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Accent Color</h2>
        <p className={styles.body}>
          Choose an accent color to apply across interactive elements — links, buttons, active
          sidebar items, and chat bubbles. Each palette provides hand-tuned values for both light
          and dark mode.
        </p>
        <div className={styles.accentGrid}>
          {ACCENT_COLORS.map((color) => {
            const hex = resolvedTheme === 'dark' ? ACCENT_HEX[color].dark : ACCENT_HEX[color].light
            const isActive = accentColor === color
            return (
              <button
                key={color}
                className={`${styles.accentCard} ${isActive ? styles.accentCardActive : ''}`}
                onClick={() => setAccentColor(color)}
                aria-pressed={isActive}
              >
                <span
                  className={styles.accentCardSwatch}
                  style={{ backgroundColor: hex }}
                />
                <span className={styles.accentCardLabel}>{ACCENT_HEX[color].label}</span>
                <span className={styles.accentCardHex}>{hex}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Semantic Tokens</h2>
        <p className={styles.body}>
          All components consume semantic tokens — never raw color values. This ensures every
          component responds correctly when the theme or accent color changes.
        </p>
        <div className={styles.tokenTable}>
          {semanticTokens.map((token) => (
            <div key={token.variable} className={styles.tokenRow}>
              <span
                className={styles.tokenSwatch}
                style={{ backgroundColor: `var(${token.variable})` }}
              />
              <div className={styles.tokenInfo}>
                <code className={styles.tokenVar}>{token.variable}</code>
                <span className={styles.tokenLabel}>{token.label}</span>
              </div>
              <span className={styles.tokenDesc}>{token.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Usage</h2>
        <CodeSnippet language="css">{`/* In any component CSS module */
.button {
  background-color: var(--color-accent);
  color: var(--color-text-on-accent);
}

.button:hover {
  background-color: var(--color-accent-hover);
}`}</CodeSnippet>
      </section>
    </div>
  )
}
