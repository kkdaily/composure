import { CodeSnippet } from '../../CodeSnippet'
import styles from './ThemePage.module.css'

export function ThemeOverviewPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Theme</h1>
      <p className={styles.subtitle}>
        A CSS-variable-driven theme system with light, dark, and accent color support.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Overview</h2>
        <p className={styles.body}>
          Composure's theme system is built entirely on CSS custom properties. All
          color, spacing, typography, and motion tokens are defined as variables that
          respond to two HTML attributes — <code className={styles.code}>data-theme</code> and{' '}
          <code className={styles.code}>data-accent</code> — set on the root{' '}
          <code className={styles.code}>&lt;html&gt;</code> element by{' '}
          <code className={styles.code}>ThemeProvider</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>ThemeProvider</h2>
        <p className={styles.body}>
          Wrap your application with <code className={styles.code}>ThemeProvider</code> once at
          the root. It accepts an optional <code className={styles.code}>accentColor</code> prop
          to set the default accent palette.
        </p>
        <CodeSnippet language="tsx">{`import { ThemeProvider } from './context/theme'

<ThemeProvider accentColor="indigo">
  <App />
</ThemeProvider>`}</CodeSnippet>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>useTheme hook</h2>
        <p className={styles.body}>
          Any component inside the provider can read and update the theme via{' '}
          <code className={styles.code}>useTheme()</code>.
        </p>
        <CodeSnippet language="tsx">{`import { useTheme } from './context/theme'

function MyComponent() {
  const {
    theme,          // 'light' | 'dark' | 'system'
    resolvedTheme,  // 'light' | 'dark'
    setTheme,
    accentColor,    // 'indigo' | 'violet' | 'blue' | ...
    setAccentColor,
  } = useTheme()
}`}</CodeSnippet>
      </section>

    </div>
  )
}
