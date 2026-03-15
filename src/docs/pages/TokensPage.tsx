import styles from './TokensPage.module.css'

const colors = [
  { variable: '--color-bg-1', label: 'Background 1' },
  { variable: '--color-bg-2', label: 'Background 2' },
  { variable: '--color-bg-3', label: 'Background 3' },
  { variable: '--color-text-primary', label: 'Text Primary' },
  { variable: '--color-text-secondary', label: 'Text Secondary' },
  { variable: '--color-text-muted', label: 'Text Muted' },
  { variable: '--color-accent', label: 'Accent' },
  { variable: '--color-accent-hover', label: 'Accent Hover' },
  { variable: '--color-assistant-bubble', label: 'Assistant Bubble' },
  { variable: '--color-user-bubble', label: 'User Bubble' },
  { variable: '--color-destructive', label: 'Destructive' },
  { variable: '--color-border', label: 'Border' },
]

const spacing = [
  { variable: '--space-1', value: '4px' },
  { variable: '--space-2', value: '8px' },
  { variable: '--space-3', value: '12px' },
  { variable: '--space-4', value: '16px' },
  { variable: '--space-5', value: '20px' },
  { variable: '--space-6', value: '24px' },
  { variable: '--space-7', value: '32px' },
  { variable: '--space-8', value: '40px' },
  { variable: '--space-9', value: '48px' },
  { variable: '--space-10', value: '64px' },
]

const typography = [
  { variable: '--text-xs', value: '0.75rem', label: 'Extra Small' },
  { variable: '--text-sm', value: '0.875rem', label: 'Small' },
  { variable: '--text-base', value: '1rem', label: 'Base' },
  { variable: '--text-lg', value: '1.125rem', label: 'Large' },
  { variable: '--text-xl', value: '1.25rem', label: 'Extra Large' },
  { variable: '--text-2xl', value: '1.5rem', label: '2X Large' },
]

const radii = [
  { variable: '--radius-sm', value: '4px' },
  { variable: '--radius-md', value: '8px' },
  { variable: '--radius-lg', value: '12px' },
  { variable: '--radius-full', value: '9999px' },
]

const animation = [
  { variable: '--speed-fast', value: '120ms' },
  { variable: '--speed-normal', value: '220ms' },
  { variable: '--speed-stream', value: '30ms' },
]

export function TokensPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tokens</h1>
      <p className={styles.subtitle}>
        Design tokens are CSS custom properties that define every visual value
        used across components. They support light and dark mode automatically.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Colors</h2>
        <div className={styles.colorGrid}>
          {colors.map((c) => (
            <div key={c.variable} className={styles.colorItem}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: `var(${c.variable})` }}
              />
              <div className={styles.colorInfo}>
                <span className={styles.colorLabel}>{c.label}</span>
                <code className={styles.colorVar}>{c.variable}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Spacing</h2>
        <div className={styles.spacingList}>
          {spacing.map((s) => (
            <div key={s.variable} className={styles.spacingItem}>
              <code className={styles.spacingVar}>{s.variable}</code>
              <div
                className={styles.spacingBar}
                style={{ width: `var(${s.variable})` }}
              />
              <span className={styles.spacingValue}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Typography</h2>
        <div className={styles.typeList}>
          {typography.map((t) => (
            <div key={t.variable} className={styles.typeItem}>
              <span
                className={styles.typeSample}
                style={{ fontSize: `var(${t.variable})` }}
              >
                {t.label}
              </span>
              <code className={styles.typeVar}>{t.variable}</code>
              <span className={styles.typeValue}>{t.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Border Radius</h2>
        <div className={styles.radiusGrid}>
          {radii.map((r) => (
            <div key={r.variable} className={styles.radiusItem}>
              <div
                className={styles.radiusSample}
                style={{ borderRadius: `var(${r.variable})` }}
              />
              <code className={styles.radiusVar}>{r.variable}</code>
              <span className={styles.radiusValue}>{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Animation</h2>
        <div className={styles.animList}>
          {animation.map((a) => (
            <div key={a.variable} className={styles.animItem}>
              <code className={styles.animVar}>{a.variable}</code>
              <span className={styles.animValue}>{a.value}</span>
            </div>
          ))}
          <div className={styles.animItem}>
            <code className={styles.animVar}>--ease-out</code>
            <span className={styles.animValue}>cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>
        </div>
      </section>
    </div>
  )
}
