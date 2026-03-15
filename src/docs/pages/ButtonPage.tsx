import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import type { ButtonProps } from '../../components/Button/Button'
import { CodeSnippet } from '../CodeSnippet'
import styles from './ButtonPage.module.css'

const SendIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9M14 2l-4 12-3-7-7-3z" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 2v5h5M15 14v-5h-5" />
    <path d="M13.5 6A6 6 0 0 0 3.2 3.2L1 5M2.5 10a6 6 0 0 0 10.3 2.8L15 11" />
  </svg>
)

const variants: ButtonProps['variant'][] = ['primary', 'secondary', 'ghost', 'destructive']
const sizes: ButtonProps['size'][] = ['sm', 'md', 'lg']

type IconPlacement = 'none' | 'before' | 'after' | 'both'
const iconPlacements: IconPlacement[] = ['none', 'before', 'after', 'both']

function getDemoIcons(placement: IconPlacement) {
  const before = placement === 'before' || placement === 'both' ? <SendIcon /> : undefined
  const after = placement === 'after' || placement === 'both' ? <SparkleIcon /> : undefined
  return { before, after }
}

export function ButtonPage() {
  const [demoVariant, setDemoVariant] = useState<ButtonProps['variant']>('primary')
  const [demoSize, setDemoSize] = useState<ButtonProps['size']>('md')
  const [demoIcon, setDemoIcon] = useState<IconPlacement>('none')
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoDisabled, setDemoDisabled] = useState(false)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Button</h1>
      <p className={styles.subtitle}>
        A flexible button with variants, sizes, and icon slots for building
        actions in AI interfaces.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <Button
            variant={demoVariant}
            size={demoSize}
            loading={demoLoading}
            disabled={demoDisabled}
            before={getDemoIcons(demoIcon).before}
            after={getDemoIcons(demoIcon).after}
          >
            Send message
          </Button>
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
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Icon</span>
            <div className={styles.controlOptions}>
              {iconPlacements.map((p) => (
                <button
                  key={p}
                  className={`${styles.chip} ${demoIcon === p ? styles.chipActive : ''}`}
                  onClick={() => setDemoIcon(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Loading</span>
            <div className={styles.controlOptions}>
              <button
                className={`${styles.chip} ${demoLoading ? styles.chipActive : ''}`}
                onClick={() => setDemoLoading(!demoLoading)}
              >
                {demoLoading ? 'on' : 'off'}
              </button>
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Disabled</span>
            <div className={styles.controlOptions}>
              <button
                className={`${styles.chip} ${demoDisabled ? styles.chipActive : ''}`}
                onClick={() => setDemoDisabled(!demoDisabled)}
              >
                {demoDisabled ? 'on' : 'off'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Variants</h2>
        <p className={styles.sectionDescription}>
          Use <code>primary</code> for the main action in a view, <code>secondary</code> for
          supporting actions, <code>ghost</code> for low-emphasis actions like toolbar buttons,
          and <code>destructive</code> for irreversible actions like deleting a conversation.
        </p>
        <div className={styles.row}>
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
        <CodeSnippet>{`<Button variant="primary">Send</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Copy</Button>
<Button variant="destructive">Delete</Button>`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Sizes</h2>
        <p className={styles.sectionDescription}>
          Use <code>sm</code> for inline or compact UI like toolbars and
          message actions, <code>md</code> for standard form buttons,
          and <code>lg</code> for prominent calls to action.
        </p>
        <div className={styles.row}>
          {sizes.map((s) => (
            <Button key={s} size={s} variant="primary">
              {s}
            </Button>
          ))}
        </div>
        <CodeSnippet>{`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}</CodeSnippet>
      </section>

      {/* With icons */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Icons</h2>
        <p className={styles.sectionDescription}>
          Use <code>before</code> to place an icon ahead of the label — ideal for
          reinforcing the action (send, copy, regenerate). Use <code>after</code> for
          directional cues like arrows. Combine both for compound actions.
        </p>
        <div className={styles.row}>
          <Button variant="primary" before={<SendIcon />}>
            Send message
          </Button>
          <Button variant="ghost" before={<CopyIcon />}>
            Copy
          </Button>
          <Button variant="secondary" before={<RefreshIcon />}>
            Regenerate
          </Button>
          <Button variant="secondary" after={<ArrowIcon />}>
            Continue
          </Button>
          <Button variant="primary" before={<SparkleIcon />} after={<ArrowIcon />}>
            Generate
          </Button>
        </div>
        <CodeSnippet>{`<Button variant="primary" before={<SendIcon />}>
  Send message
</Button>

<Button variant="secondary" after={<ArrowIcon />}>
  Continue
</Button>

<Button before={<SparkleIcon />} after={<ArrowIcon />}>
  Generate
</Button>`}</CodeSnippet>
      </section>

      {/* Loading */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Loading</h2>
        <p className={styles.sectionDescription}>
          Set <code>loading</code> while waiting for an async operation like sending a
          message or generating a response. The button shows a spinner and disables
          interaction to prevent duplicate submissions.
        </p>
        <div className={styles.row}>
          <Button variant="primary" loading>
            Sending
          </Button>
          <Button variant="secondary" loading>
            Processing
          </Button>
        </div>
        <CodeSnippet>{`<Button variant="primary" loading>
  Sending
</Button>`}</CodeSnippet>
      </section>

      {/* Disabled */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Disabled</h2>
        <p className={styles.sectionDescription}>
          Use <code>disabled</code> when a precondition hasn't been met — for example,
          disabling the send button until the user has typed a message.
        </p>
        <div className={styles.row}>
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
        </div>
        <CodeSnippet>{`<Button variant="primary" disabled>
  Send
</Button>`}</CodeSnippet>
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
                <td><code>{`'secondary'`}</code></td>
                <td>Visual style of the button</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>{`'sm' | 'md' | 'lg'`}</code></td>
                <td><code>{`'md'`}</code></td>
                <td>Size of the button</td>
              </tr>
              <tr>
                <td><code>before</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Element rendered before the label</td>
              </tr>
              <tr>
                <td><code>after</code></td>
                <td><code>ReactNode</code></td>
                <td>—</td>
                <td>Element rendered after the label</td>
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
