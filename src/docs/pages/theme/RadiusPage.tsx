import { CodeSnippet } from '../../CodeSnippet'
import styles from './ThemePage.module.css'
import pageStyles from './SpacingPage.module.css'

const radii = [
  { variable: '--radius-sm',   value: '4px',    label: 'Small',   px: 4,    desc: 'Inline elements, tight UI chips' },
  { variable: '--radius-md',   value: '8px',    label: 'Medium',  px: 8,    desc: 'Buttons, inputs, cards' },
  { variable: '--radius-lg',   value: '12px',   label: 'Large',   px: 12,   desc: 'Panels, modals, popovers' },
  { variable: '--radius-full', value: '9999px', label: 'Full',    px: 9999, desc: 'Avatars, badges, pills' },
]

export function RadiusPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Border Radius</h1>
      <p className={styles.subtitle}>
        Four radius tokens cover every UI shape — from subtle card corners to fully circular badges and avatars.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Scale</h2>
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
        <h2 className={styles.heading}>Reference</h2>
        <div className={pageStyles.table}>
          <div className={pageStyles.tableHeader}>
            <span className={pageStyles.tableHeaderCell}>Token</span>
            <span className={pageStyles.tableHeaderCell}>Value</span>
            <span className={pageStyles.tableHeaderCell}>Use case</span>
          </div>
          {radii.map((r) => (
            <div key={r.variable} className={pageStyles.speedRow}>
              <code className={pageStyles.tokenVar}>{r.variable}</code>
              <span className={pageStyles.tokenValue}>{r.value}</span>
              <span className={pageStyles.speedDesc}>{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Usage</h2>
        <CodeSnippet language="css">{`/* Tight, inline elements */
.badge {
  border-radius: var(--radius-sm);
}

/* Interactive controls */
.button,
.input {
  border-radius: var(--radius-md);
}

/* Surfaces and overlays */
.card,
.popover {
  border-radius: var(--radius-lg);
}

/* Circular shapes */
.avatar,
.pill {
  border-radius: var(--radius-full);
}`}</CodeSnippet>
      </section>
    </div>
  )
}
