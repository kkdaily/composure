import { useState } from 'react'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageActions,
} from '../../components/ChatMessage/ChatMessage'
import { IconButton } from '../../components/IconButton/IconButton'
import { CodeSnippet } from '../CodeSnippet'
import styles from './ChatMessagePage.module.css'

/* ===========================
   Icons
   =========================== */

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-2.8 2.7-5 6-5s6 2.2 6 5" />
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
    <path d="M2 8a6 6 0 0 1 10.3-4.2L14 2v4h-4" />
    <path d="M14 8a6 6 0 0 1-10.3 4.2L2 14v-4h4" />
  </svg>
)

const ThumbUpIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 9V14H2V9h3zm1-1l2.5-5a1.5 1.5 0 0 1 2.8.7L10.5 7H13a2 2 0 0 1 1.9 2.6l-1.5 5A2 2 0 0 1 11.5 16H6" />
  </svg>
)

const ThumbDownIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 7V2h3v5h-3zm-1 1L7.5 13a1.5 1.5 0 0 1-2.8-.7L5.5 9H3a2 2 0 0 1-1.9-2.6l1.5-5A2 2 0 0 1 4.5 0H10" />
  </svg>
)

/* ===========================
   Types
   =========================== */

type DemoRole = 'assistant' | 'user'
type DemoVariant = 'filled' | 'plain'
type DemoToggle = 'show' | 'hide'

/* ===========================
   Page
   =========================== */

export function ChatMessagePage() {
  const [demoRole, setDemoRole] = useState<DemoRole>('assistant')
  const [demoVariant, setDemoVariant] = useState<DemoVariant>('filled')
  const [demoAvatar, setDemoAvatar] = useState<DemoToggle>('show')
  const [demoActions, setDemoActions] = useState<DemoToggle>('show')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>ChatMessage</h1>
      <p className={styles.subtitle}>
        A composable chat message for AI conversations — avatar, content bubble,
        and action buttons arranged with role-aware styling.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <ChatMessage role={demoRole}>
            {demoAvatar === 'show' && (
              <ChatMessageAvatar>
                {demoRole === 'assistant' ? <SparkleIcon /> : <UserIcon />}
              </ChatMessageAvatar>
            )}
            <ChatMessageContent variant={demoVariant}>
              {demoRole === 'assistant'
                ? "Here's what I found — the key insight is that simplicity often wins over complexity in component design."
                : 'Can you explain how React context works?'}
            </ChatMessageContent>
            {demoActions === 'show' && (
              <ChatMessageActions>
                <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
                {demoRole === 'assistant' && (
                  <>
                    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
                    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
                    <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
                  </>
                )}
              </ChatMessageActions>
            )}
          </ChatMessage>
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Role</span>
            <div className={styles.controlOptions}>
              {(['assistant', 'user'] as DemoRole[]).map((r) => (
                <button
                  key={r}
                  className={`${styles.chip} ${demoRole === r ? styles.chipActive : ''}`}
                  onClick={() => setDemoRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Variant</span>
            <div className={styles.controlOptions}>
              {(['filled', 'plain'] as DemoVariant[]).map((v) => (
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
            <span className={styles.controlLabel}>Avatar</span>
            <div className={styles.controlOptions}>
              {(['show', 'hide'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${demoAvatar === t ? styles.chipActive : ''}`}
                  onClick={() => setDemoAvatar(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Actions</span>
            <div className={styles.controlOptions}>
              {(['show', 'hide'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${demoActions === t ? styles.chipActive : ''}`}
                  onClick={() => setDemoActions(t)}
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
          The simplest configuration — a <code>ChatMessage</code> with just{' '}
          <code>ChatMessageContent</code>. Useful for compact layouts or when
          avatars and actions aren't needed.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="assistant">
            <ChatMessageContent>
              I can help with that. There are a few approaches worth considering.
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageContent>
    I can help with that. There are a few approaches worth considering.
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* With Avatar */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Avatar</h2>
        <p className={styles.sectionDescription}>
          Add a <code>ChatMessageAvatar</code> to show who sent the message.
          Pass any element as children — an <code>img</code>, SVG icon, or text
          initials.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Based on my analysis, I'd recommend starting with the basics.
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              That makes sense. Can you show me an example?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Based on my analysis, I'd recommend starting with the basics.
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    That makes sense. Can you show me an example?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* With Actions */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Actions</h2>
        <p className={styles.sectionDescription}>
          Use <code>ChatMessageActions</code> to add action buttons below the
          message bubble — copy, regenerate, thumbs up/down, or any controls
          relevant to your AI interface.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Here's a quick summary of the key differences between server
              components and client components in React.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
              <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
              <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Here's a quick summary of the key differences...
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
    <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* User Messages */}
      <section className={styles.section}>
        <h2 className={styles.heading}>User Messages</h2>
        <p className={styles.sectionDescription}>
          Set <code>role</code> to <code>"user"</code> for right-aligned
          messages with accent-colored bubbles. The layout automatically mirrors
          — the avatar moves to the right and content aligns to the end.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              How do I implement dark mode with CSS custom properties?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    How do I implement dark mode with CSS custom properties?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Conversation Thread */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Conversation Thread</h2>
        <p className={styles.sectionDescription}>
          Compose multiple <code>ChatMessage</code> components to build a full
          conversation thread. Each message independently controls its role,
          avatar, and actions.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              What's the difference between useEffect and useLayoutEffect?
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Both run after render, but useLayoutEffect fires synchronously
              before the browser paints. Use useLayoutEffect when you need to
              measure DOM elements or prevent visual flicker.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Got it, thanks!
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="user">
  <ChatMessageAvatar><UserIcon /></ChatMessageAvatar>
  <ChatMessageContent>
    What's the difference between useEffect and useLayoutEffect?
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="assistant">
  <ChatMessageAvatar><SparkleIcon /></ChatMessageAvatar>
  <ChatMessageContent>
    Both run after render, but useLayoutEffect fires synchronously...
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar><UserIcon /></ChatMessageAvatar>
  <ChatMessageContent>Got it, thanks!</ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Variant */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Variant</h2>
        <p className={styles.sectionDescription}>
          Use <code>variant="plain"</code> on <code>ChatMessageContent</code> to
          remove the bubble background — useful for assistant messages in
          interfaces like Claude where responses appear as plain text rather than
          inside a colored bubble.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent variant="plain">
              Here's a quick summary of the key differences between server
              components and client components in React.
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Can you give me a concrete example?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent variant="plain">
    Here's a quick summary of the key differences...
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Can you give me a concrete example?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Without Avatar */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Without Avatar</h2>
        <p className={styles.sectionDescription}>
          All sub-components are optional and work in any combination. Here,
          actions are shown without an avatar — useful for minimal layouts that
          still need interactive controls.
        </p>
        <div className={styles.conversation}>
          <ChatMessage role="assistant">
            <ChatMessageContent>
              Interesting! Based on my analysis, I'd recommend starting with the
              basics and building up from there.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageContent>
    Interesting! Based on my analysis, I'd recommend starting with the
    basics and building up from there.
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>ChatMessage</h3>
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
                <td><code>role</code></td>
                <td><code>{`'assistant' | 'user'`}</code></td>
                <td>—</td>
                <td>Determines bubble color and layout direction</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.subHeading}>ChatMessageContent</h3>
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
                <td><code>{`'filled' | 'plain'`}</code></td>
                <td><code>'filled'</code></td>
                <td>Background style — filled shows a colored bubble, plain removes it</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
