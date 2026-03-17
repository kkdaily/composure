import { CodeSnippet } from '../../CodeSnippet'
import styles from './ThemePage.module.css'
import pageStyles from './SpacingPage.module.css'

const speeds = [
  { variable: '--speed-fast',   value: '120ms', ms: 120, desc: 'Micro-interactions, hover states' },
  { variable: '--speed-normal', value: '220ms', ms: 220, desc: 'Panel reveals, modal entrances' },
  { variable: '--speed-stream', value: '30ms',  ms: 30,  desc: 'Token-by-token text streaming' },
]

const MAX_MS = 220

export function AnimationPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Animation</h1>
      <p className={styles.subtitle}>
        Three timing tokens give the UI a consistent sense of motion — fast for instant feedback, normal for transitions, and stream for real-time text.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Speed</h2>
        <div className={pageStyles.table}>
          <div className={pageStyles.tableHeader}>
            <span className={pageStyles.tableHeaderCell}>Token</span>
            <span className={pageStyles.tableHeaderCell}>Value</span>
            <span className={pageStyles.tableHeaderCell}>Use case</span>
          </div>
          {speeds.map((s) => (
            <div key={s.variable} className={pageStyles.speedRow}>
              <code className={pageStyles.tokenVar}>{s.variable}</code>
              <span className={pageStyles.tokenValue}>{s.value}</span>
              <span className={pageStyles.speedDesc}>{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Easing</h2>
        <div className={pageStyles.easingCard}>
          <div className={pageStyles.easingMeta}>
            <code className={pageStyles.tokenVar}>--ease-out</code>
            <span className={pageStyles.easingValue}>cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
          <p className={pageStyles.easingDesc}>
            Snappy deceleration that feels physical and intentional. Starts fast and settles smoothly — the right choice for nearly all UI motion.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Usage</h2>
        <CodeSnippet language="css">{`/* Hover feedback */
.button {
  transition: background-color var(--speed-fast) var(--ease-out);
}

/* Panel entrance */
.panel {
  transition: opacity var(--speed-normal) var(--ease-out),
              transform var(--speed-normal) var(--ease-out);
}

/* Streaming text tick */
.streamCursor {
  animation: blink var(--speed-stream) step-end infinite;
}`}</CodeSnippet>
      </section>
    </div>
  )
}
