import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageActions,
} from '../../components/ChatMessage/ChatMessage'
import {
  Composer,
  ComposerInput,
  ComposerHeader,
  ComposerHeaderStart,
  ComposerFooter,
  ComposerFooterStart,
  ComposerFooterEnd,
} from '../../components/Composer/Composer'
import {
  ScrollArea,
  ScrollAreaScrollToBottom,
} from '../../components/ScrollArea/ScrollArea'
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer'
import { IconButton } from '../../components/IconButton/IconButton'
import { FilePreview } from '../../components/FilePreview/FilePreview'
import { CodeSnippet } from '../CodeSnippet'
import styles from './OverviewPage.module.css'

/* ===========================
   Icons
   =========================== */

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.25l1.4 4.35L13.75 7l-4.35 1.4L8 12.75l-1.4-4.35L2.25 7l4.35-1.4Z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3 14.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3v10M4 9l4 4 4-4" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 14V2M3 7l5-5 5 5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1" />
      <path d="M2 11V3a1 1 0 0 1 1-1h8" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.5 4.5v4h4" />
      <path d="M3 10a6 6 0 1 0 1.5-5.5L1.5 8.5" />
    </svg>
  )
}

/* ===========================
   Highlight icons
   =========================== */

function ScrollHighlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="2" width="14" height="16" rx="2" />
      <path d="M10 6v4M8 8l2 2 2-2" />
    </svg>
  )
}

function StreamHighlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 6 8 6" />
      <polyline points="4 10 12 10" />
      <polyline points="4 14 10 14" />
      <path d="M14 14l2-2-2-2" />
    </svg>
  )
}

function PuzzleHighlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2h4v2a2 2 0 1 1-4 0V2z" />
      <rect x="3" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}

function PaletteHighlightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <circle cx="10" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* ===========================
   Demo data
   =========================== */

interface DemoMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGES: DemoMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Create a React hook for debouncing input values',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Here's a \`useDebounce\` hook:

\`\`\`tsx
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
\`\`\`

The output only updates once the input stops changing for the given duration — ideal for search inputs or expensive API calls.`,
  },
]

const AUTO_PLAY_USER_MSG: DemoMessage = {
  id: 'msg-3',
  role: 'user',
  content: 'Show me how to use it with a search input',
}

const AUTO_PLAY_RESPONSE = `Here's a search component using the hook:

\`\`\`tsx
function Search() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)

  useEffect(() => {
    if (debounced) fetchResults(debounced)
  }, [debounced])

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
\`\`\`

The search only fires after 300ms of inactivity, reducing API calls while the user types.`

const CANNED_RESPONSES = [
  `You can extend it with a loading indicator:

\`\`\`tsx
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(true)
    const id = setTimeout(() => {
      setDebounced(value)
      setPending(false)
    }, delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return { debounced, pending }
}
\`\`\`

The \`pending\` flag lets you show a spinner while the debounce settles.`,

  `Here's a debounced callback variant:

\`\`\`tsx
function useDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
) {
  const ref = useRef<ReturnType<typeof setTimeout>>()

  return useCallback((...args: Parameters<T>) => {
    clearTimeout(ref.current)
    ref.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}
\`\`\`

This debounces the **function call** itself — useful for form saves or analytics events.`,
]

/* ===========================
   OverviewPage
   =========================== */

export function OverviewPage() {
  const [messages, setMessages] = useState<DemoMessage[]>(INITIAL_MESSAGES)
  const [composerValue, setComposerValue] = useState('')
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const demoFiles = useRef(['schema.prisma', 'utils.ts', 'data.csv'])
  const fileIndexRef = useRef(0)

  const responseIndexRef = useRef(0)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval>>()
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const startStream = useCallback((content: string) => {
    setIsStreaming(true)
    setStreamingContent('')
    let i = 0

    streamIntervalRef.current = setInterval(() => {
      i += 3
      if (i >= content.length) {
        clearInterval(streamIntervalRef.current)
        setStreamingContent(null)
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content,
        }])
        setIsStreaming(false)
      } else {
        setStreamingContent(content.slice(0, i))
      }
    }, 18)
  }, [])

  // Auto-play demo on mount
  useEffect(() => {
    const t1 = setTimeout(() => {
      setMessages(prev => {
        if (prev.some(m => m.id === AUTO_PLAY_USER_MSG.id)) return prev
        return [...prev, AUTO_PLAY_USER_MSG]
      })
    }, 1800)

    const t2 = setTimeout(() => {
      startStream(AUTO_PLAY_RESPONSE)
    }, 3000)

    timersRef.current = [t1, t2]

    return () => {
      timersRef.current.forEach(clearTimeout)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    }
  }, [startStream])

  const handleSend = useCallback((value: string) => {
    if (!value.trim() || isStreaming) return

    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: value.trim(),
    }])
    setComposerValue('')

    const t = setTimeout(() => {
      const response = CANNED_RESPONSES[responseIndexRef.current % CANNED_RESPONSES.length]
      responseIndexRef.current++
      startStream(response)
    }, 800)

    timersRef.current.push(t)
  }, [isStreaming, startStream])

  const handleAddFile = useCallback(() => {
    const name = demoFiles.current[fileIndexRef.current % demoFiles.current.length]
    fileIndexRef.current++
    setFiles(prev => prev.includes(name) ? prev : [...prev, name])
  }, [])

  const handleRemoveFile = useCallback((name: string) => {
    setFiles(prev => prev.filter(f => f !== name))
  }, [])

  return (
    <div className={styles.page}>

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <span className={styles.badge}>v0.1.0</span>
        <h1 className={styles.title}>Composure</h1>
        <p className={styles.subtitle}>
          React components for building AI chat interfaces — purpose-built for
          streaming, auto-scroll, code highlighting, and the patterns every AI
          app needs.
        </p>
        <div className={styles.heroActions}>
          <NavLink to="/components/composer" className={styles.btnPrimary}>
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

      {/* ---- Live Demo ---- */}
      <section className={styles.demoSection}>
        <span className={styles.demoLabel}>Live demo</span>
        <div className={styles.chatWindow}>
          <ScrollArea className={styles.chatScrollArea} mode="auto">
            <div className={styles.messageList}>
              {messages.map(msg => (
                <div key={msg.id} className={styles.messageIn}>
                  <ChatMessage
                    role={msg.role}
                    showActionsOnHover={msg.role === 'assistant'}
                  >
                    <ChatMessageAvatar>
                      <span className={msg.role === 'assistant' ? styles.assistantAvatar : styles.userAvatar}>
                        {msg.role === 'assistant' ? <SparkleIcon /> : <UserIcon />}
                      </span>
                    </ChatMessageAvatar>
                    <ChatMessageContent variant={msg.role === 'assistant' ? 'plain' : 'filled'}>
                      {msg.role === 'assistant'
                        ? <MarkdownRenderer content={msg.content} className={styles.demoMarkdown} />
                        : msg.content
                      }
                    </ChatMessageContent>
                    {msg.role === 'assistant' && (
                      <ChatMessageActions>
                        <IconButton label="Copy" size="sm">
                          <CopyIcon />
                        </IconButton>
                        <IconButton label="Regenerate" size="sm">
                          <RefreshIcon />
                        </IconButton>
                      </ChatMessageActions>
                    )}
                  </ChatMessage>
                </div>
              ))}

              {streamingContent !== null && (
                <div className={styles.messageIn}>
                  <ChatMessage role="assistant">
                    <ChatMessageAvatar>
                      <span className={styles.assistantAvatar}>
                        <SparkleIcon />
                      </span>
                    </ChatMessageAvatar>
                    <ChatMessageContent variant="plain">
                      <MarkdownRenderer
                        content={streamingContent || '\u200B'}
                        streaming
                        className={styles.demoMarkdown}
                      />
                    </ChatMessageContent>
                  </ChatMessage>
                </div>
              )}
            </div>

            <ScrollAreaScrollToBottom label="Scroll to bottom">
              <ArrowDownIcon />
            </ScrollAreaScrollToBottom>
          </ScrollArea>

          <div className={styles.composerWrapper}>
            <Composer
              value={composerValue}
              onChange={setComposerValue}
              onSubmit={handleSend}
              disabled={isStreaming}
            >
              {files.length > 0 && (
                <ComposerHeader>
                  <ComposerHeaderStart>
                    {files.map(name => (
                      <FilePreview
                        key={name}
                        name={name}
                        size="sm"
                        onRemove={() => handleRemoveFile(name)}
                      />
                    ))}
                  </ComposerHeaderStart>
                </ComposerHeader>
              )}
              <ComposerInput placeholder="Try sending a message…" />
              <ComposerFooter bordered={false}>
                <ComposerFooterStart>
                  <IconButton
                    label="Attach file"
                    size="sm"
                    onClick={handleAddFile}
                  >
                    <PlusIcon />
                  </IconButton>
                </ComposerFooterStart>
                <ComposerFooterEnd>
                  <IconButton
                    label="Send"
                    size="sm"
                    variant="primary"
                    type="submit"
                    disabled={isStreaming || !composerValue.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </ComposerFooterEnd>
              </ComposerFooter>
            </Composer>
          </div>
        </div>
        <p className={styles.demoHint}>
          Type a message and press Enter — the demo is fully interactive
        </p>
      </section>

      {/* ---- Highlights ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Built for the hard parts</h2>
          <p className={styles.body}>
            Every AI chat app rebuilds the same complex UI patterns. Composure
            extracts them into composable, accessible, theme-aware components
            for the shadcn ecosystem.
          </p>
        </div>

        <div className={styles.highlightGrid}>
          <div className={styles.highlightCard}>
            <span className={styles.highlightIcon}><ScrollHighlightIcon /></span>
            <h3 className={styles.highlightTitle}>Scroll intent detection</h3>
            <p className={styles.highlightDesc}>
              Distinguishes user scrolls from programmatic ones using
              wheel/touch events — streaming auto-scrolls without hijacking
              reading.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <span className={styles.highlightIcon}><StreamHighlightIcon /></span>
            <h3 className={styles.highlightTitle}>Streaming-safe highlighting</h3>
            <p className={styles.highlightDesc}>
              Lazy-loads Shiki grammars with a sync fast-path to avoid flashes
              during character-by-character code rendering.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <span className={styles.highlightIcon}><PuzzleHighlightIcon /></span>
            <h3 className={styles.highlightTitle}>Composable primitives</h3>
            <p className={styles.highlightDesc}>
              Sub-components share state via context. Named exports for
              tree-shaking. Mix and match in any layout.
            </p>
          </div>
          <div className={styles.highlightCard}>
            <span className={styles.highlightIcon}><PaletteHighlightIcon /></span>
            <h3 className={styles.highlightTitle}>Built for shadcn</h3>
            <p className={styles.highlightDesc}>
              Designed for the shadcn registry. Works with your existing theme
              tokens, dark mode, and primitives like Button and Avatar.
            </p>
          </div>
        </div>
      </section>

      {/* ---- What's included ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>What's included</h2>
          <p className={styles.body}>
            Six components purpose-built for AI chat interfaces: Composer,
            ChatMessage, CodeBlock, ScrollArea, MarkdownRenderer, and
            FilePreview. Designed for the shadcn registry — they work alongside
            your existing shadcn primitives like Button and Avatar.
          </p>
        </div>
      </section>

      {/* ---- Quick start ---- */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Quick start</h2>
          <p className={styles.body}>
            Import components as named exports. Complex components like Composer
            expose sub-components as separate named exports so you can compose
            them however your layout requires.
          </p>
        </div>
        <CodeSnippet language="tsx">{`import {
  ScrollArea,
  ChatMessage, ChatMessageContent,
  Composer, ComposerInput, ComposerFooter,
  MarkdownRenderer,
} from 'composure'

export function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  return (
    <>
      <ScrollArea>
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role}>
            <ChatMessageContent>
              <MarkdownRenderer content={m.content} />
            </ChatMessageContent>
          </ChatMessage>
        ))}
      </ScrollArea>

      <Composer value={input} onChange={setInput} onSubmit={handleSend}>
        <ComposerInput placeholder="Message…" />
        <ComposerFooter>
          <Button size="sm" type="submit">Send</Button>
        </ComposerFooter>
      </Composer>
    </>
  )
}`}</CodeSnippet>
      </section>

    </div>
  )
}
