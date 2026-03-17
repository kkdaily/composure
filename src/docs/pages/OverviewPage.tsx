import { NavLink } from 'react-router-dom'
import styles from './OverviewPage.module.css'

const COMPONENTS: { name: string; path: string; desc: string }[] = [
  {
    name: 'Avatar',
    path: '/components/avatar',
    desc: 'User or assistant identity with image fallback and role indicator.',
  },
  {
    name: 'Button',
    path: '/components/button',
    desc: 'Primary action trigger with size, variant, and loading state.',
  },
  {
    name: 'ChatMessage',
    path: '/components/chat-message',
    desc: 'Full conversation turn with avatar, content, and role-aware styling.',
  },
  {
    name: 'CodeBlock',
    path: '/components/code-block',
    desc: 'Syntax-highlighted code with language label and copy button.',
  },
  {
    name: 'Composer',
    path: '/components/composer',
    desc: 'Auto-resizing message input with optional header and footer slots.',
  },
  {
    name: 'IconButton',
    path: '/components/icon-button',
    desc: 'Compact accessible button for icon-only actions.',
  },
  {
    name: 'ScrollArea',
    path: '/components/scroll-area',
    desc: 'Overflow container that auto-scrolls to new content.',
  },
  {
    name: 'Select',
    path: '/components/select',
    desc: 'Accessible dropdown for choosing a value from a list.',
  },
]

const PRINCIPLES = [
  {
    icon: '◆',
    title: 'Token-driven',
    text: 'Every color, spacing value, radius, and animation speed is a CSS custom property. No raw values appear in component stylesheets.',
  },
  {
    icon: '◈',
    title: 'Composable',
    text: 'Complex components are split into named exports (Composer, ComposerInput, ComposerFooter) rather than monolithic blocks. Combine them however your layout requires.',
  },
  {
    icon: '◉',
    title: 'Accessible',
    text: 'Semantic HTML, visible focus rings, ARIA attributes, and prefers-reduced-motion support are built in — not bolted on.',
  },
  {
    icon: '◎',
    title: 'Themeable',
    text: 'Light, dark, and system modes plus eight accent color palettes are supported through ThemeProvider with zero additional CSS needed.',
  },
]

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

      {/* ---- Components ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Components</h2>
          <p className={styles.body}>
            Eight components covering the most common patterns in AI chat
            interfaces. Each has a live demo, all major props documented, and
            copyable code snippets.
          </p>
        </div>
        <div className={styles.componentGrid}>
          {COMPONENTS.map((c) => (
            <NavLink key={c.name} to={c.path} className={styles.componentCard}>
              <span className={styles.componentName}>{c.name}</span>
              <span className={styles.componentDesc}>{c.desc}</span>
            </NavLink>
          ))}
        </div>
      </section>

      {/* ---- Principles ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Design principles</h2>
        </div>
        <div className={styles.principleList}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={styles.principleRow}>
              <span className={styles.principleIcon}>{p.icon}</span>
              <div className={styles.principleContent}>
                <span className={styles.principleTitle}>{p.title}</span>
                <span className={styles.principleText}>{p.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
