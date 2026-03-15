import { useState } from 'react'
import { IconButton } from '../../components/IconButton/IconButton'
import type { IconButtonProps } from '../../components/IconButton/IconButton'
import { CodeSnippet } from '../CodeSnippet'
import styles from './IconButtonPage.module.css'

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
)

const TrashIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5" />
    <path d="M3 4l1 10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-10" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 2v5h5M15 14v-5h-5" />
    <path d="M13.5 6A6 6 0 0 0 3.2 3.2L1 5M2.5 10a6 6 0 0 0 10.3 2.8L15 11" />
  </svg>
)

const ThumbsUpIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 9V2.5a1.5 1.5 0 0 1 3 0V7h3.5a2 2 0 0 1 2 2v0a2 2 0 0 1-.5 1.3l-2.8 3.4a2 2 0 0 1-1.5.8H5" />
    <path d="M2 9h2v5.5H2z" />
  </svg>
)

const variants: IconButtonProps['variant'][] = ['primary', 'secondary', 'ghost', 'destructive']
const sizes: IconButtonProps['size'][] = ['sm', 'md', 'lg']

export function IconButtonPage() {
  const [demoVariant, setDemoVariant] = useState<IconButtonProps['variant']>('ghost')
  const [demoSize, setDemoSize] = useState<IconButtonProps['size']>('md')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>IconButton</h1>
      <p className={styles.subtitle}>
        A square button that renders a single icon with an accessible label.
        Ideal for toolbars, inline actions like copy and regenerate, and
        feedback controls in AI chat interfaces.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <IconButton variant={demoVariant} size={demoSize} label="Copy">
            <CopyIcon />
          </IconButton>
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Variant</span>
            <div className={styles.controlOptions}>
              {variants.map((v) => (
                <button
                  key={v}
                  className={`${styles.chip} ${demoVariant === v ? styles.chipActive : ''}`}
                  onClick={() => setDemoVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Size</span>
            <div className={styles.controlOptions}>
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`${styles.chip} ${demoSize === s ? styles.chipActive : ''}`}
                  onClick={() => setDemoSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Variants</h2>
        <p className={styles.sectionDescription}>
          Use <code>ghost</code> (the default) for unobtrusive inline actions
          like copy or thumbs up. Use <code>secondary</code> when the button needs
          more visual weight, <code>primary</code> for a highlighted action,
          and <code>destructive</code> for deletions.
        </p>
        <div className={styles.row}>
          {variants.map((v) => (
            <IconButton key={v} variant={v} label={`${v} icon button`}>
              <CopyIcon />
            </IconButton>
          ))}
        </div>
        <CodeSnippet>{`<IconButton variant="primary" label="Copy">
  <CopyIcon />
</IconButton>
<IconButton variant="secondary" label="Copy">
  <CopyIcon />
</IconButton>
<IconButton variant="ghost" label="Copy">
  <CopyIcon />
</IconButton>
<IconButton variant="destructive" label="Delete">
  <TrashIcon />
</IconButton>`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Sizes</h2>
        <p className={styles.sectionDescription}>
          Use <code>sm</code> for tight spaces like inline message
          actions, <code>md</code> for standard toolbars,
          and <code>lg</code> for prominent standalone controls.
        </p>
        <div className={styles.row}>
          {sizes.map((s) => (
            <IconButton key={s} size={s} variant="secondary" label={`${s} icon button`}>
              <CopyIcon />
            </IconButton>
          ))}
        </div>
        <CodeSnippet>{`<IconButton size="sm" label="Copy"><CopyIcon /></IconButton>
<IconButton size="md" label="Copy"><CopyIcon /></IconButton>
<IconButton size="lg" label="Copy"><CopyIcon /></IconButton>`}</CodeSnippet>
      </section>

      {/* Common AI actions */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Common AI Actions</h2>
        <p className={styles.sectionDescription}>
          IconButton is designed for the recurring actions in AI chat
          interfaces — copying responses, regenerating completions, providing
          feedback, and deleting messages.
        </p>
        <div className={styles.row}>
          <IconButton label="Copy response">
            <CopyIcon />
          </IconButton>
          <IconButton label="Regenerate response">
            <RefreshIcon />
          </IconButton>
          <IconButton label="Like response">
            <ThumbsUpIcon />
          </IconButton>
          <IconButton variant="destructive" label="Delete message">
            <TrashIcon />
          </IconButton>
        </div>
        <CodeSnippet>{`<IconButton label="Copy response" onClick={onCopy}>
  <CopyIcon />
</IconButton>
<IconButton label="Regenerate" onClick={onRegenerate}>
  <RefreshIcon />
</IconButton>
<IconButton label="Like response" onClick={onLike}>
  <ThumbsUpIcon />
</IconButton>
<IconButton variant="destructive" label="Delete" onClick={onDelete}>
  <TrashIcon />
</IconButton>`}</CodeSnippet>
      </section>

      {/* Loading */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Loading</h2>
        <p className={styles.sectionDescription}>
          Set <code>loading</code> while an action is in progress — for example,
          after clicking copy while the content is being written to the clipboard.
          The icon is replaced with a spinner and interaction is disabled.
        </p>
        <div className={styles.row}>
          <IconButton label="Loading" loading>
            <CopyIcon />
          </IconButton>
          <IconButton variant="primary" label="Loading primary" loading>
            <CopyIcon />
          </IconButton>
        </div>
        <CodeSnippet>{`<IconButton label="Copying" loading>
  <CopyIcon />
</IconButton>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>variant</code></td>
                <td><code>{`'primary' | 'secondary' | 'ghost' | 'destructive'`}</code></td>
                <td><code>{`'ghost'`}</code></td>
                <td>Visual style of the button</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>{`'sm' | 'md' | 'lg'`}</code></td>
                <td><code>{`'md'`}</code></td>
                <td>Size of the button</td>
              </tr>
              <tr>
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Required accessible label (aria-label)</td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Shows a spinner and disables interaction</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Disables the button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
