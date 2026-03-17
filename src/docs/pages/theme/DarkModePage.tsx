import { useTheme, type Theme } from '../../../context/theme'
import styles from './ThemePage.module.css'

const MODES: { value: Theme; label: string; description: string }[] = [
  {
    value: 'system',
    label: 'System',
    description: 'Follows the OS preference via prefers-color-scheme. Updates automatically when the system changes.',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Always uses the light palette regardless of OS setting.',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always uses the dark palette regardless of OS setting.',
  },
]

export function DarkModePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dark Mode</h1>
      <p className={styles.subtitle}>
        Three appearance modes — system, light, and dark — driven by a{' '}
        <code className={styles.code}>data-theme</code> attribute and CSS custom properties.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Current appearance</h2>
        <div className={styles.modeCards}>
          {MODES.map((mode) => (
            <button
              key={mode.value}
              className={`${styles.modeCard} ${theme === mode.value ? styles.modeCardActive : ''}`}
              onClick={() => setTheme(mode.value)}
              aria-pressed={theme === mode.value}
            >
              <span className={styles.modeLabel}>{mode.label}</span>
              <span className={styles.modeDesc}>{mode.description}</span>
            </button>
          ))}
        </div>
        <p className={styles.caption}>
          Currently resolving to <strong>{resolvedTheme}</strong> mode.
          {theme === 'system' && ' Change your OS appearance to see this update automatically.'}
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>How it works</h2>
        <p className={styles.body}>
          <code className={styles.code}>ThemeProvider</code> writes a{' '}
          <code className={styles.code}>data-theme</code> attribute directly onto{' '}
          <code className={styles.code}>&lt;html&gt;</code>. CSS selectors in{' '}
          <code className={styles.code}>tokens.css</code> respond to this attribute to swap color
          values — no JavaScript needed once the attribute is set.
        </p>
        <pre className={styles.codeBlock}>
          <code>{`/* System preference (no attribute override) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']):not([data-theme='dark']) {
    --color-bg-1: #0a0a0a;
    --color-text-primary: #f0f0f0;
    /* ... */
  }
}

/* Explicit override */
:root[data-theme='dark'] {
  --color-bg-1: #0a0a0a;
  --color-text-primary: #f0f0f0;
  /* ... */
}`}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Controlling appearance</h2>
        <pre className={styles.codeBlock}>
          <code>{`import { useTheme } from './context/theme'

function AppearanceToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}`}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Persistence</h2>
        <p className={styles.body}>
          The selected mode is saved to <code className={styles.code}>localStorage</code> under the
          key <code className={styles.code}>composure-theme</code> and restored on the next page
          load. The system mode listener is cleaned up automatically when the component unmounts or
          the mode changes away from system.
        </p>
      </section>
    </div>
  )
}
