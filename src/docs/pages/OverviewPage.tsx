import styles from './OverviewPage.module.css'

export function OverviewPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Composure</h1>
      <p className={styles.subtitle}>
        A React component library for AI-powered interfaces.
      </p>
      <p className={styles.description}>
        Composure provides a set of purpose-built components for building chat
        interfaces, streaming text displays, code blocks, and other patterns
        common in AI applications. Every component is styled with CSS Modules
        and driven by a consistent design token system that supports light and
        dark mode out of the box.
      </p>
      <section className={styles.section}>
        <h2 className={styles.heading}>Quick Start</h2>
        <pre className={styles.codeBlock}>
          <code>{`import '@composure/tokens/tokens.css'
import { ChatBubble, Composer } from '@composure/components'`}</code>
        </pre>
      </section>
      <section className={styles.section}>
        <h2 className={styles.heading}>Principles</h2>
        <ul className={styles.list}>
          <li>Token-driven — no hardcoded colors, spacing, or animation values</li>
          <li>Composable — small focused components that combine cleanly</li>
          <li>Accessible — semantic HTML and keyboard support throughout</li>
          <li>Themeable — light and dark mode via CSS custom properties</li>
        </ul>
      </section>
    </div>
  )
}
