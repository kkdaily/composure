import styles from './ThemePage.module.css'

const spacingScale = [
  { variable: '--space-1',  value: '4px',  px: 4 },
  { variable: '--space-2',  value: '8px',  px: 8 },
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
  { variable: '--radius-sm',   value: '4px',    px: 4 },
  { variable: '--radius-md',   value: '8px',    px: 8 },
  { variable: '--radius-lg',   value: '12px',   px: 12 },
  { variable: '--radius-full', value: '9999px', px: 9999 },
]

const MAX_PX = 64

export function SpacingPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Spacing</h1>
      <p className={styles.subtitle}>
        A base-4 spacing scale — every step is a multiple of 4px for consistent rhythm throughout the UI.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Spacing Scale</h2>
        <div className={styles.spaceList}>
          {spacingScale.map((s) => (
            <div key={s.variable} className={styles.spaceRow}>
              <div className={styles.spaceMeta}>
                <code className={styles.tokenVar}>{s.variable}</code>
                <span className={styles.tokenDesc}>{s.value}</span>
              </div>
              <div className={styles.spaceBarTrack}>
                <div
                  className={styles.spaceBar}
                  style={{ width: `${(s.px / MAX_PX) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Border Radius</h2>
        <div className={styles.radiusList}>
          {radii.map((r) => (
            <div key={r.variable} className={styles.radiusRow}>
              <div
                className={styles.radiusSample}
                style={{
                  borderRadius: r.px >= 9999 ? '9999px' : `var(${r.variable})`,
                }}
              />
              <div className={styles.spaceMeta}>
                <code className={styles.tokenVar}>{r.variable}</code>
                <span className={styles.tokenDesc}>{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Usage</h2>
        <pre className={styles.codeBlock}>
          <code>{`/* Padding and gap */
.card {
  padding: var(--space-6);
  gap: var(--space-4);
}

/* Border radius */
.button {
  border-radius: var(--radius-md);
}

.pill {
  border-radius: var(--radius-full);
}`}</code>
        </pre>
      </section>
    </div>
  )
}
