import { CodeSnippet } from '../../CodeSnippet'
import styles from './ThemePage.module.css'
import pageStyles from './SpacingPage.module.css'

const spacingScale = [
  { variable: '--space-1',  value: '4px',  px: 4  },
  { variable: '--space-2',  value: '8px',  px: 8  },
  { variable: '--space-3',  value: '12px', px: 12 },
  { variable: '--space-4',  value: '16px', px: 16 },
  { variable: '--space-5',  value: '20px', px: 20 },
  { variable: '--space-6',  value: '24px', px: 24 },
  { variable: '--space-7',  value: '32px', px: 32 },
  { variable: '--space-8',  value: '40px', px: 40 },
  { variable: '--space-9',  value: '48px', px: 48 },
  { variable: '--space-10', value: '64px', px: 64 },
]

const radii = [
  { variable: '--radius-sm',   value: '4px',    label: 'Small',   px: 4    },
  { variable: '--radius-md',   value: '8px',    label: 'Medium',  px: 8    },
  { variable: '--radius-lg',   value: '12px',   label: 'Large',   px: 12   },
  { variable: '--radius-full', value: '9999px', label: 'Full',    px: 9999 },
]

const speeds = [
  { variable: '--speed-fast',   value: '120ms', ms: 120, label: 'Fast',   desc: 'Micro-interactions, hover states' },
  { variable: '--speed-normal', value: '220ms', ms: 220, label: 'Normal', desc: 'Panel reveals, modal entrances' },
  { variable: '--speed-stream', value: '30ms',  ms: 30,  label: 'Stream', desc: 'Token-by-token text streaming' },
]

const MAX_PX = 64
const MAX_MS = 220

export function SpacingPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Spacing</h1>
      <p className={styles.subtitle}>
        A base-4 scale with consistent rhythm for spacing, border radii, and animation timing.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Spacing Scale</h2>
        <p className={styles.body}>
          Every step is a multiple of 4px. Use these tokens for padding, margin, and gap throughout the UI — never hardcode pixel values.
        </p>
        <div className={pageStyles.table}>
          <div className={pageStyles.tableHeader}>
            <span className={pageStyles.tableHeaderCell}>Token</span>
            <span className={pageStyles.tableHeaderCell}>Value</span>
            <span className={pageStyles.tableHeaderCell}>Size</span>
          </div>
          {spacingScale.map((s) => (
            <div key={s.variable} className={pageStyles.tableRow}>
              <code className={pageStyles.tokenVar}>{s.variable}</code>
              <span className={pageStyles.tokenValue}>{s.value}</span>
              <div className={pageStyles.spacerTrack}>
                <div
                  className={pageStyles.spacerBlock}
                  style={{ width: `${Math.max((s.px / MAX_PX) * 100, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Border Radius</h2>
        <p className={styles.body}>
          Four radius tokens cover every UI shape — from subtle card corners to fully circular badges and avatars.
        </p>
        <div className={pageStyles.radiusGrid}>
          {radii.map((r) => (
            <div key={r.variable} className={pageStyles.radiusCard}>
              <div
                className={pageStyles.radiusDemo}
                style={{
                  borderRadius: r.px >= 9999 ? '9999px' : `var(${r.variable})`,
                }}
              />
              <div className={pageStyles.radiusMeta}>
                <span className={pageStyles.radiusLabel}>{r.label}</span>
                <code className={pageStyles.tokenVar}>{r.variable}</code>
                <span className={pageStyles.radiusValue}>{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Animation Speed</h2>
        <p className={styles.body}>
          Three timing tokens give the UI a consistent sense of motion — fast for instant feedback, normal for transitions, and stream for real-time text.
        </p>
        <div className={pageStyles.speedTable}>
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
        <h2 className={styles.heading}>Usage</h2>
        <CodeSnippet language="css">{`/* Padding and gap */
.card {
  padding: var(--space-6);
  gap: var(--space-4);
}

/* Border radius */
.button {
  border-radius: var(--radius-md);
}

.avatar {
  border-radius: var(--radius-full);
}

/* Transitions */
.panel {
  transition: opacity var(--speed-normal) var(--ease-out);
}

.chip:hover {
  transition: background-color var(--speed-fast) var(--ease-out);
}`}</CodeSnippet>
      </section>
    </div>
  )
}
