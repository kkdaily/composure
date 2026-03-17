import { NavLink } from 'react-router-dom'
import styles from './OverviewPage.module.css'

export function OverviewPage() {
  return (
    <div className={styles.page}>

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <span className={styles.badge}>v0.1.0 — work in progress</span>
        <h1 className={styles.title}>Composure</h1>
        <p className={styles.subtitle}>
          A React component library for AI-powered interfaces. Purpose-built for
          chat UIs, streaming text, code output, and the input patterns that
          appear in every AI application.
        </p>
        <div className={styles.heroActions}>
          <NavLink to="/components/button" className={styles.btnPrimary}>
            Browse components
          </NavLink>
          <a
            href="https://github.com/kkdaily/composure"
            target="_blank"
            rel="noreferrer"
            className={styles.btnSecondary}
          >
            GitHub
          </a>
        </div>
      </section>

      {/* ---- Step 1: Install ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepLabel}>Step 1</span>
          <h2 className={styles.heading}>Install the package</h2>
          <p className={styles.body}>
            Add Composure to your project with npm, yarn, or pnpm.
          </p>
        </div>
        <div className={styles.installRow}>
          <span className={styles.installPrompt}>$</span>
          <span className={styles.installCmd}>npm install composure</span>
        </div>
      </section>

      {/* ---- Step 2: Import tokens ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepLabel}>Step 2</span>
          <h2 className={styles.heading}>Import the design tokens</h2>
          <p className={styles.body}>
            All component styles depend on CSS custom properties defined in the
            token sheet. Import it once at your app root before any component
            imports.
          </p>
        </div>
        <div className={styles.codeBlock}>
          <code>{`import 'composure/tokens.css'`}</code>
        </div>
      </section>

      {/* ---- Step 3: Wrap with ThemeProvider ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepLabel}>Step 3</span>
          <h2 className={styles.heading}>Wrap your app with ThemeProvider</h2>
          <p className={styles.body}>
            ThemeProvider sets the active color mode and accent palette on the
            document root. Both are persisted to <code>localStorage</code>{' '}
            automatically.
          </p>
        </div>
        <div className={styles.codeBlock}>
          <code>{`import 'composure/tokens.css'
import { ThemeProvider } from 'composure'

export default function App() {
  return (
    <ThemeProvider accentColor="indigo">
      {/* your app */}
    </ThemeProvider>
  )
}`}</code>
        </div>
      </section>

      {/* ---- Step 4: Use a component ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepLabel}>Step 4</span>
          <h2 className={styles.heading}>Use your first component</h2>
          <p className={styles.body}>
            Import components as named exports. Complex components like Composer
            expose sub-components as separate named exports so you can compose
            them however your layout requires.
          </p>
        </div>
        <div className={styles.codeBlock}>
          <code>{`import {
  ScrollArea,
  ChatMessage,
  Composer,
  ComposerInput,
  ComposerFooter,
  ComposerFooterEnd,
  Button,
} from 'composure'

export function Chat() {
  const [input, setInput] = React.useState('')
  const [messages, setMessages] = React.useState([])

  function handleSend() {
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <ScrollArea>
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
      </ScrollArea>

      <Composer>
        <ComposerInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          placeholder="Message…"
        />
        <ComposerFooter>
          <ComposerFooterEnd>
            <Button size="sm" onClick={handleSend}>Send</Button>
          </ComposerFooterEnd>
        </ComposerFooter>
      </Composer>
    </div>
  )
}`}</code>
        </div>
      </section>

    </div>
  )
}
