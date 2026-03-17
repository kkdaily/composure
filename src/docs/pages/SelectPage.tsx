import { useState } from 'react'
import { Select } from '../../components/Select/Select'
import { CodeSnippet } from '../CodeSnippet'
import styles from './SelectPage.module.css'

/* ===========================
   Types
   =========================== */

type DemoSize = 'sm' | 'md' | 'lg'
type DemoToggle = 'on' | 'off'

/* ===========================
   Shared options
   =========================== */

const modelOptions = [
  { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
  { value: 'claude-haiku-4', label: 'Claude Haiku 4' },
]

const modelOptionsWithDisabled = [
  { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
  { value: 'claude-haiku-4', label: 'Claude Haiku 4' },
  { value: 'gpt-5.4', label: 'GPT-5.4', disabled: true },
  { value: 'o3', label: 'o3', disabled: true },
]

/* ===========================
   Page
   =========================== */

export function SelectPage() {
  const [demoSize, setDemoSize] = useState<DemoSize>('md')
  const [demoDisabled, setDemoDisabled] = useState<DemoToggle>('off')
  const [demoValue, setDemoValue] = useState('')

  // Section state
  const [basicValue, setBasicValue] = useState('claude-opus-4-6')
  const [smValue, setSmValue] = useState('claude-opus-4-6')
  const [mdValue, setMdValue] = useState('claude-opus-4-6')
  const [lgValue, setLgValue] = useState('claude-opus-4-6')
  const [labelValue, setLabelValue] = useState('claude-opus-4-6')
  const [placeholderValue, setPlaceholderValue] = useState('')
  const [disabledOptValue, setDisabledOptValue] = useState('claude-opus-4-6')
  const [disabledValue, setDisabledValue] = useState('claude-opus-4-6')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Select</h1>
      <p className={styles.subtitle}>
        A styled native select for picking from a list of options — model
        pickers, output formats, temperature presets, and similar controls in AI
        interfaces.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <Select
            value={demoValue}
            onChange={setDemoValue}
            options={modelOptions}
            placeholder="Choose a model…"
            size={demoSize}
            disabled={demoDisabled === 'on'}
            aria-label="Model"
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Size</span>
            <div className={styles.controlOptions}>
              {(['sm', 'md', 'lg'] as DemoSize[]).map((s) => (
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
            <span className={styles.controlLabel}>Disabled</span>
            <div className={styles.controlOptions}>
              {(['off', 'on'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${demoDisabled === t ? styles.chipActive : ''}`}
                  onClick={() => setDemoDisabled(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Basic Usage</h2>
        <p className={styles.sectionDescription}>
          Pass an array of <code>options</code> with <code>value</code> and{' '}
          <code>label</code> fields. The component is controlled — the parent
          owns state via <code>value</code> and <code>onChange</code>.
        </p>
        <div className={styles.exampleArea}>
          <Select
            value={basicValue}
            onChange={setBasicValue}
            options={modelOptions}
            aria-label="Model"
          />
        </div>
        <CodeSnippet>{`const [model, setModel] = useState('claude-opus-4-6')

<Select
  value={model}
  onChange={setModel}
  options={[
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
    { value: 'claude-haiku-4', label: 'Claude Haiku 4' },
  ]}
  aria-label="Model"
/>`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Sizes</h2>
        <p className={styles.sectionDescription}>
          Three sizes that match <code>Button</code> for consistent alignment
          when composed together — for example, a model picker alongside a send
          button in a <code>ComposerFooter</code>.
        </p>
        <div className={styles.exampleArea}>
          <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>sm</span>
            <Select
              value={smValue}
              onChange={setSmValue}
              options={modelOptions}
              size="sm"
              aria-label="Model"
            />
          </div>
          <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>md</span>
            <Select
              value={mdValue}
              onChange={setMdValue}
              options={modelOptions}
              size="md"
              aria-label="Model"
            />
          </div>
          <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>lg</span>
            <Select
              value={lgValue}
              onChange={setLgValue}
              options={modelOptions}
              size="lg"
              aria-label="Model"
            />
          </div>
        </div>
        <CodeSnippet>{`<Select size="sm" ... />
<Select size="md" ... />
<Select size="lg" ... />`}</CodeSnippet>
      </section>

      {/* With Label */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Label</h2>
        <p className={styles.sectionDescription}>
          Use the <code>label</code> prop to render a visible{' '}
          <code>&lt;label&gt;</code> above the select. The label is
          automatically linked to the select for accessibility. When you omit{' '}
          <code>label</code>, provide an <code>aria-label</code> instead so
          screen readers can still announce the field's purpose.
        </p>
        <div className={styles.exampleArea}>
          <Select
            value={labelValue}
            onChange={setLabelValue}
            options={modelOptions}
            label="Model"
          />
        </div>
        <CodeSnippet>{`{/* Visible label */}
<Select
  label="Model"
  value={model}
  onChange={setModel}
  options={modelOptions}
/>

{/* No visible label — use aria-label instead */}
<Select
  aria-label="Model"
  value={model}
  onChange={setModel}
  options={modelOptions}
/>`}</CodeSnippet>
      </section>

      {/* Placeholder */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Placeholder</h2>
        <p className={styles.sectionDescription}>
          Set <code>placeholder</code> to show hint text when no value is
          selected. Useful for optional selections where the user should
          explicitly pick an option rather than defaulting to the first one.
        </p>
        <div className={styles.exampleArea}>
          <Select
            value={placeholderValue}
            onChange={setPlaceholderValue}
            options={modelOptions}
            placeholder="Choose a model…"
            aria-label="Model"
          />
        </div>
        <CodeSnippet>{`<Select
  placeholder="Choose a model…"
  value={model}
  onChange={setModel}
  options={modelOptions}
  aria-label="Model"
/>`}</CodeSnippet>
      </section>

      {/* Disabled Options */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Disabled Options</h2>
        <p className={styles.sectionDescription}>
          Set <code>disabled: true</code> on individual options to make them
          unselectable — useful for showing models that are unavailable or
          features that require an upgrade.
        </p>
        <div className={styles.exampleArea}>
          <Select
            value={disabledOptValue}
            onChange={setDisabledOptValue}
            options={modelOptionsWithDisabled}
            aria-label="Model"
          />
        </div>
        <CodeSnippet>{`<Select
  value={model}
  onChange={setModel}
  options={[
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
    { value: 'gpt-5.4', label: 'GPT-5.4', disabled: true },
  ]}
  aria-label="Model"
/>`}</CodeSnippet>
      </section>

      {/* Disabled */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Disabled</h2>
        <p className={styles.sectionDescription}>
          Disable the entire select when a precondition hasn't been met — for
          example, when the user hasn't authenticated or the available models
          are still loading.
        </p>
        <div className={styles.exampleArea}>
          <Select
            value={disabledValue}
            onChange={setDisabledValue}
            options={modelOptions}
            disabled
            aria-label="Model"
          />
        </div>
        <CodeSnippet>{`<Select
  disabled
  value={model}
  onChange={setModel}
  options={modelOptions}
  aria-label="Model"
/>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>Select</h3>
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
                <td><code>value</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Current selected value</td>
              </tr>
              <tr>
                <td><code>onChange</code></td>
                <td><code>{`(value: string) => void`}</code></td>
                <td>—</td>
                <td>Called when the selection changes</td>
              </tr>
              <tr>
                <td><code>options</code></td>
                <td><code>{`SelectOption[]`}</code></td>
                <td>—</td>
                <td>Array of <code>{`{ value, label, disabled? }`}</code></td>
              </tr>
              <tr>
                <td><code>placeholder</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Placeholder text when no value is selected</td>
              </tr>
              <tr>
                <td><code>label</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Visible label above the select (omit and use <code>aria-label</code> for hidden label)</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>{`'sm' | 'md' | 'lg'`}</code></td>
                <td><code>'md'</code></td>
                <td>Size of the select — matches Button sizes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
