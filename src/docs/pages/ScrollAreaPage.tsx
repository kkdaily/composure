import { useState, useRef, useCallback, useEffect } from 'react'
import { ScrollArea, ScrollAreaScrollToBottom } from '../../components/ScrollArea/ScrollArea'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
} from '../../components/ChatMessage/ChatMessage'
import { CodeSnippet } from '../CodeSnippet'
import styles from './ScrollAreaPage.module.css'

/* ===========================
   Icons
   =========================== */

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-2.8 2.7-5 6-5s6 2.2 6 5" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3v10" />
    <path d="M4 9l4 4 4-4" />
  </svg>
)

/* ===========================
   Types
   =========================== */

type DemoMode = 'auto' | 'manual'

interface Message {
  id: number
  role: 'assistant' | 'user'
  text: string
}

/* ===========================
   Sample data
   =========================== */

const initialMessages: Message[] = [
  { id: 1, role: 'user', text: 'Can you explain how React context works?' },
  { id: 2, role: 'assistant', text: 'React context provides a way to pass data through the component tree without having to pass props down manually at every level. You create a context with createContext(), provide it with a Provider, and consume it with useContext().' },
  { id: 3, role: 'user', text: 'When should I use context versus props?' },
  { id: 4, role: 'assistant', text: 'Use context when data needs to be accessed by many components at different nesting levels — things like themes, auth state, or locale. For data that only one or two children need, regular props are simpler and more explicit.' },
]

const streamingResponse = `Great question! There are several strategies to optimize context performance in React applications.

First, split your context into smaller, focused pieces. Instead of one monolithic AppContext, create separate contexts for theme, auth, locale, and other concerns. This way a theme change won't re-render components that only consume auth state.

Second, memoize your context values with useMemo so the value object only gets a new reference when the underlying data actually changes. Without this, every parent re-render triggers all consumers to re-render unnecessarily.

Third, consider the Provider placement in your component tree. Place each Provider as close as possible to the subtree that needs it — mounting too high causes broader re-renders than necessary.`

/* ===========================
   Page
   =========================== */

/* ===========================
   Streaming hook
   =========================== */

function useStreamingDemo(fullText: string, speed = 12) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const indexRef = useRef(0)

  const startStreaming = useCallback(() => {
    if (isStreaming) return

    // Add the user follow-up question, then start streaming
    setMessages([
      ...initialMessages,
      { id: 5, role: 'user', text: 'What about performance? Any tips to optimize context?' },
    ])
    setStreamedText('')
    indexRef.current = 0
    setIsStreaming(true)
  }, [isStreaming])

  useEffect(() => {
    if (!isStreaming) return

    intervalRef.current = setInterval(() => {
      indexRef.current += 1
      if (indexRef.current >= fullText.length) {
        setStreamedText(fullText)
        setIsStreaming(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      } else {
        setStreamedText(fullText.slice(0, indexRef.current))
      }
    }, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isStreaming, fullText, speed])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsStreaming(false)
    setStreamedText('')
    indexRef.current = 0
    setMessages(initialMessages)
  }, [])

  return { messages, streamedText, isStreaming, startStreaming, reset }
}

/* ===========================
   Page
   =========================== */

export function ScrollAreaPage() {
  const [demoMode, setDemoMode] = useState<DemoMode>('auto')
  const demo = useStreamingDemo(streamingResponse)
  const basicDemo = useStreamingDemo(streamingResponse)

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>ScrollArea</h1>
      <p className={styles.subtitle}>
        A scrollable container with smart auto-scrolling — follows new content
        as tokens stream in, pauses when the user scrolls up, and provides an
        optional scroll-to-bottom indicator.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <ScrollArea
            mode={demoMode}
            className={styles.scrollContainer}
            aria-label="Chat conversation"
          >
            <div className={styles.conversation}>
              {demo.messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role}>
                  <ChatMessageAvatar>
                    {msg.role === 'assistant' ? <SparkleIcon /> : <UserIcon />}
                  </ChatMessageAvatar>
                  <ChatMessageContent>{msg.text}</ChatMessageContent>
                </ChatMessage>
              ))}
              {demo.streamedText && (
                <ChatMessage role="assistant">
                  <ChatMessageAvatar>
                    <SparkleIcon />
                  </ChatMessageAvatar>
                  <ChatMessageContent>{demo.streamedText}</ChatMessageContent>
                </ChatMessage>
              )}
            </div>
            <ScrollAreaScrollToBottom>
              <button className={styles.scrollToBottomButton} aria-label="Scroll to bottom">
                <ArrowDownIcon />
              </button>
            </ScrollAreaScrollToBottom>
          </ScrollArea>
          <div className={styles.controlOptions}>
            <button
              className={styles.chip}
              onClick={demo.startStreaming}
              disabled={demo.isStreaming}
            >
              {demo.isStreaming ? 'Streaming…' : 'Stream response'}
            </button>
            <button className={styles.chip} onClick={demo.reset}>
              Reset
            </button>
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Mode</span>
            <div className={styles.controlOptions}>
              {(['auto', 'manual'] as DemoMode[]).map((m) => (
                <button
                  key={m}
                  className={`${styles.chip} ${demoMode === m ? styles.chipActive : ''}`}
                  onClick={() => setDemoMode(m)}
                >
                  {m}
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
          Wrap your scrollable content in <code>ScrollArea</code> with{' '}
          <code>mode="auto"</code> to enable smart scrolling. New content
          arriving at the bottom will auto-scroll the container — unless the
          user has scrolled up to read earlier messages.
        </p>
        <div className={styles.exampleArea}>
          <ScrollArea mode="auto" className={styles.scrollContainer}>
            <div className={styles.conversation}>
              {basicDemo.messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role}>
                  <ChatMessageAvatar>
                    {msg.role === 'assistant' ? <SparkleIcon /> : <UserIcon />}
                  </ChatMessageAvatar>
                  <ChatMessageContent>{msg.text}</ChatMessageContent>
                </ChatMessage>
              ))}
              {basicDemo.streamedText && (
                <ChatMessage role="assistant">
                  <ChatMessageAvatar>
                    <SparkleIcon />
                  </ChatMessageAvatar>
                  <ChatMessageContent>{basicDemo.streamedText}</ChatMessageContent>
                </ChatMessage>
              )}
            </div>
          </ScrollArea>
          <button
            className={styles.chip}
            onClick={basicDemo.startStreaming}
            disabled={basicDemo.isStreaming}
          >
            {basicDemo.isStreaming ? 'Streaming…' : 'Stream response'}
          </button>
        </div>
        <CodeSnippet>{`<ScrollArea mode="auto" className={styles.chatContainer}>
  {messages.map((msg) => (
    <ChatMessage key={msg.id} role={msg.role}>
      <ChatMessageContent>{msg.text}</ChatMessageContent>
    </ChatMessage>
  ))}
</ScrollArea>`}</CodeSnippet>
      </section>

      {/* Mode */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Mode</h2>
        <p className={styles.sectionDescription}>
          In <code>"auto"</code> mode, the container follows new content as it
          appears — ideal for streaming AI responses where tokens arrive
          incrementally. If the user scrolls up to read earlier messages,
          auto-scrolling pauses until they return to the bottom. Set{' '}
          <code>"manual"</code> to disable auto-scrolling entirely.
        </p>
        <CodeSnippet>{`{/* Auto-scroll during streaming */}
<ScrollArea mode="auto">
  {messages.map(...)}
</ScrollArea>

{/* No auto-scroll — static content */}
<ScrollArea mode="manual">
  {messages.map(...)}
</ScrollArea>`}</CodeSnippet>
      </section>

      {/* Scroll to Bottom */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Scroll to Bottom Indicator</h2>
        <p className={styles.sectionDescription}>
          Add a <code>ScrollAreaScrollToBottom</code> sub-component to show a
          scroll-to-bottom trigger when the user has scrolled away from the
          bottom. It automatically hides when at the bottom and shows when
          scrolled up. Pass any element as children — the component handles
          visibility and wires up the click-to-scroll behavior.
        </p>
        <CodeSnippet>{`<ScrollArea mode="auto" className={styles.chatContainer}>
  {messages.map((msg) => (
    <ChatMessage key={msg.id} role={msg.role}>
      <ChatMessageContent>{msg.text}</ChatMessageContent>
    </ChatMessage>
  ))}
  <ScrollAreaScrollToBottom>
    <IconButton label="Scroll to bottom" size="sm">
      <ArrowDownIcon />
    </IconButton>
  </ScrollAreaScrollToBottom>
</ScrollArea>`}</CodeSnippet>
      </section>

      {/* Bottom Threshold */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Bottom Threshold</h2>
        <p className={styles.sectionDescription}>
          Set <code>bottomThreshold</code> to control how close to the bottom
          (in pixels) counts as "at bottom." A larger value makes the
          auto-scroll resume sooner as the user scrolls back down — useful when
          messages have extra padding or action rows that add height below the
          last visible content.
        </p>
        <CodeSnippet>{`{/* Resume auto-scroll within 100px of the bottom */}
<ScrollArea mode="auto" bottomThreshold={100}>
  {messages.map(...)}
</ScrollArea>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>ScrollArea</h3>
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
                <td><code>mode</code></td>
                <td><code>{`'auto' | 'manual'`}</code></td>
                <td><code>'auto'</code></td>
                <td>Auto-scroll behavior — auto follows new content, manual disables it</td>
              </tr>
              <tr>
                <td><code>bottomThreshold</code></td>
                <td><code>number</code></td>
                <td><code>64</code></td>
                <td>Pixel distance from the bottom to still count as "at bottom"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
