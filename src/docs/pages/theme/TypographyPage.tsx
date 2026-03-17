import styles from './ThemePage.module.css'

const fontSizes = [
  { variable: '--text-xs',   value: '0.75rem',  px: '12px',  label: 'Extra Small' },
  { variable: '--text-sm',   value: '0.875rem', px: '14px',  label: 'Small' },
  { variable: '--text-base', value: '1rem',     px: '16px',  label: 'Base' },
  { variable: '--text-lg',   value: '1.125rem', px: '18px',  label: 'Large' },
  { variable: '--text-xl',   value: '1.25rem',  px: '20px',  label: 'Extra Large' },
  { variable: '--text-2xl',  value: '1.5rem',   px: '24px',  label: '2X Large' },
]

const fontWeights = [
  { variable: '--weight-normal',   value: '400', label: 'Normal' },
  { variable: '--weight-medium',   value: '500', label: 'Medium' },
  { variable: '--weight-semibold', value: '600', label: 'Semibold' },
  { variable: '--weight-bold',     value: '700', label: 'Bold' },
]

const lineHeights = [
  { variable: '--leading-tight',   value: '1.25', label: 'Tight' },
  { variable: '--leading-normal',  value: '1.5',  label: 'Normal' },
  { variable: '--leading-relaxed', value: '1.75', label: 'Relaxed' },
]

const fontFamilies = [
  {
    variable: '--font-sans',
    value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...",
    label: 'Sans',
    sample: 'The quick brown fox jumps over the lazy dog.',
    mono: false,
  },
  {
    variable: '--font-mono',
    value: "'SF Mono', 'Fira Code', 'Roboto Mono', monospace",
    label: 'Mono',
    sample: 'const theme = useTheme()',
    mono: true,
  },
]

export function TypographyPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Typography</h1>
      <p className={styles.subtitle}>
        A type scale built on rem units with a consistent set of size, weight, and leading tokens.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>Font Families</h2>
        <div className={styles.familyList}>
          {fontFamilies.map((f) => (
            <div key={f.variable} className={styles.familyItem}>
              <p
                className={styles.familySample}
                style={{ fontFamily: `var(${f.variable})` }}
              >
                {f.sample}
              </p>
              <div className={styles.familyMeta}>
                <code className={styles.tokenVar}>{f.variable}</code>
                <span className={styles.tokenDesc}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Font Size</h2>
        <div className={styles.typeScale}>
          {fontSizes.map((size) => (
            <div key={size.variable} className={styles.typeRow}>
              <span
                className={styles.typeSample}
                style={{ fontSize: `var(${size.variable})` }}
              >
                {size.label}
              </span>
              <div className={styles.typeMeta}>
                <code className={styles.tokenVar}>{size.variable}</code>
                <span className={styles.tokenDesc}>{size.value} — {size.px}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Font Weight</h2>
        <div className={styles.weightList}>
          {fontWeights.map((w) => (
            <div key={w.variable} className={styles.weightRow}>
              <span
                className={styles.weightSample}
                style={{ fontWeight: `var(${w.variable})` }}
              >
                {w.label}
              </span>
              <div className={styles.typeMeta}>
                <code className={styles.tokenVar}>{w.variable}</code>
                <span className={styles.tokenDesc}>{w.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Line Height</h2>
        <div className={styles.leadingList}>
          {lineHeights.map((l) => (
            <div key={l.variable} className={styles.leadingRow}>
              <p
                className={styles.leadingSample}
                style={{ lineHeight: `var(${l.variable})` }}
              >
                {l.label} — The quick brown fox jumps over the lazy dog.
                The quick brown fox jumps over the lazy dog.
              </p>
              <div className={styles.typeMeta}>
                <code className={styles.tokenVar}>{l.variable}</code>
                <span className={styles.tokenDesc}>{l.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
