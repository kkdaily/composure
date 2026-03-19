import { useState, useRef, useCallback, useEffect } from 'react'
import { ArrowDown } from 'lucide-react'
import { ScrollArea, ScrollAreaScrollToBottom } from '../../components/ScrollArea/ScrollArea'
import {
  ChatMessage,
  ChatMessageContent,
  ChatMessageLoading,
} from '../../components/ChatMessage/ChatMessage'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

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
]

const streamingResponse = `Great question! There are several strategies to optimize context performance in React applications.

First, split your context into smaller, focused pieces. Instead of one monolithic AppContext, create separate contexts for theme, auth, locale, and other concerns. This way a theme change won't re-render components that only consume auth state.

Second, memoize your context values with useMemo so the value object only gets a new reference when the underlying data actually changes. Without this, every parent re-render triggers all consumers to re-render unnecessarily.

Third, consider the Provider placement in your component tree. Place each Provider as close as possible to the subtree that needs it — mounting too high causes broader re-renders than necessary.`

/* ===========================
   Streaming hook
   =========================== */

function useStreamingDemo(fullText: string, speed = 12) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current)
    intervalRef.current = null
    thinkingTimerRef.current = null
    setIsStreaming(false)
    setIsThinking(false)
    setStreamedText('')
    setMessages(initialMessages)
    indexRef.current = 0
  }, [])

  const startStreaming = useCallback(() => {
    if (isStreaming || isThinking) {
      stopStreaming()
      return
    }

    // Reset first
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current)
    setStreamedText('')
    indexRef.current = 0

    // Add the user follow-up question
    setMessages([
      ...initialMessages,
      { id: 3, role: 'user', text: 'What about performance? Any tips to optimize context?' },
    ])

    // Brief pause before showing thinking indicator
    thinkingTimerRef.current = setTimeout(() => {
      setIsThinking(true)

      thinkingTimerRef.current = setTimeout(() => {
        setIsThinking(false)
        setIsStreaming(true)
      }, 1000)
    }, 400)
  }, [isStreaming, isThinking, stopStreaming])

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

  return { messages, streamedText, isStreaming, isThinking, startStreaming }
}

/* ===========================
   Page
   =========================== */

export function ScrollAreaPage() {
  const [demoMode, setDemoMode] = useState<DemoMode>('auto')
  const demo = useStreamingDemo(streamingResponse)


  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">ScrollArea</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        A scrollable container with smart auto-scrolling — follows new content
        as tokens stream in, pauses when the user scrolls up, and provides an
        optional scroll-to-bottom indicator.
      </p>
      <CodeSnippet language="bash">{`pnpm dlx shadcn@latest add https://composureui.com/r/scroll-area.json`}</CodeSnippet>

      {/* Interactive demo */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="flex flex-col items-start gap-4 p-6 bg-card border border-border rounded-lg">
          <ScrollArea
            mode={demoMode}
            className="w-full h-[300px] border border-border rounded-md bg-background"
            aria-label="Chat conversation"
          >
            <div className="flex flex-col gap-4 p-4">
              {demo.messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role}>
                  <ChatMessageContent>{msg.text}</ChatMessageContent>
                </ChatMessage>
              ))}
              {demo.isThinking && (
                <ChatMessage role="assistant">
                  <ChatMessageLoading />
                </ChatMessage>
              )}
              {demo.streamedText && (
                <ChatMessage role="assistant">
                  <ChatMessageContent>{demo.streamedText}</ChatMessageContent>
                </ChatMessage>
              )}
            </div>
            <ScrollAreaScrollToBottom label="Scroll to bottom">
              <ArrowDown className="size-4" />
            </ScrollAreaScrollToBottom>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Mode</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['auto', 'manual'] as DemoMode[]).map((m) => (
                <button
                  key={m}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoMode === m
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Streaming</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                  (demo.isStreaming || demo.isThinking)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={demo.startStreaming}
              >
                {(demo.isThinking || demo.isStreaming) ? 'stop' : 'simulate'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Basic Usage</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Wrap your scrollable content in <code>ScrollArea</code> with{' '}
          <code>mode="auto"</code> to enable smart scrolling. New content
          arriving at the bottom will auto-scroll the container — unless the
          user has scrolled up to read earlier messages.
        </p>
        <CodeSnippet>{`<ScrollArea mode="auto" className={styles.chatContainer}>
  {messages.map((msg) => (
    <ChatMessage key={msg.id} role={msg.role}>
      <ChatMessageContent>{msg.text}</ChatMessageContent>
    </ChatMessage>
  ))}
</ScrollArea>`}</CodeSnippet>
      </section>

      {/* Mode */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Mode</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Scroll to Bottom Indicator</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Bottom Threshold</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>

        <h3 className="text-base font-semibold text-foreground">ScrollArea</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Prop</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Default</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">mode</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'auto' | 'manual'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">'auto'</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Auto-scroll behavior — auto follows new content, manual disables it</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">bottomThreshold</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">number</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">64</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Pixel distance from the bottom to still count as "at bottom"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
