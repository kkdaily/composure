import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Sparkles, User, ArrowDown, ArrowUp, Copy, Plus, RotateCw,
  ScrollText, Zap, Puzzle, Palette, Square,
} from 'lucide-react'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageLoading,
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
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilePreview } from '../../components/FilePreview/FilePreview'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

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
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [composerValue, setComposerValue] = useState('')
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  // Track IDs of messages that came from streaming so we skip their entrance animation
  const streamedMsgIds = useRef(new Set<string>())
  const [files, setFiles] = useState<{ file: File; preview?: string }[]>([])
  const [model, setModel] = useState('sonnet')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const responseIndexRef = useRef(0)
  const msgIdCounter = useRef(0)
  const streamIntervalRef = useRef<ReturnType<typeof setInterval>>()
  const streamingContentRef = useRef<string>('')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const startStream = useCallback((content: string, onComplete?: () => void) => {
    // Clear any existing stream (guards against StrictMode double-calls)
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    setIsStreaming(true)
    setStreamingContent('')
    streamingContentRef.current = ''
    let i = 0

    streamIntervalRef.current = setInterval(() => {
      i += 3
      if (i >= content.length) {
        clearInterval(streamIntervalRef.current)
        const msgId = `msg-stream-${++msgIdCounter.current}`
        streamedMsgIds.current.add(msgId)
        setStreamingContent(null)
        streamingContentRef.current = ''
        setMessages(prev => [...prev, {
          id: msgId,
          role: 'assistant',
          content,
        }])
        setIsStreaming(false)
        onComplete?.()
      } else {
        const partial = content.slice(0, i)
        streamingContentRef.current = partial
        setStreamingContent(partial)
      }
    }, 24)
  }, [])

  const handleStop = useCallback(() => {
    if (!isStreaming) return
    clearInterval(streamIntervalRef.current)
    const partial = streamingContentRef.current
    if (partial) {
      const msgId = `msg-stream-${++msgIdCounter.current}`
      streamedMsgIds.current.add(msgId)
      setMessages(prev => [...prev, {
        id: msgId,
        role: 'assistant',
        content: partial,
      }])
    }
    setStreamingContent(null)
    streamingContentRef.current = ''
    setIsStreaming(false)
  }, [isStreaming])

  // Auto-play demo on mount
  useEffect(() => {
    // Step 1: Show first user message after 2s
    const t1 = setTimeout(() => {
      setMessages([INITIAL_MESSAGES[0]])
    }, 2000)

    // Step 2: Show thinking indicator after 3.2s
    const t2 = setTimeout(() => {
      setIsThinking(true)
      // Step 2b: Start streaming after a brief thinking delay
      const t2b = setTimeout(() => {
        setIsThinking(false)
        startStream(INITIAL_MESSAGES[1].content)
      }, 1000)
      timersRef.current.push(t2b)
    }, 3200)

    timersRef.current = [t1, t2]

    return () => {
      timersRef.current.forEach(clearTimeout)
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current)
    }
  }, [startStream])

  const handleSend = useCallback((value: string) => {
    if (!value.trim() || isStreaming) return

    setMessages(prev => [...prev, {
      id: `msg-user-${++msgIdCounter.current}`,
      role: 'user',
      content: value.trim(),
    }])
    setComposerValue('')

    const t = setTimeout(() => {
      setIsThinking(true)
      const t2 = setTimeout(() => {
        setIsThinking(false)
        const response = CANNED_RESPONSES[responseIndexRef.current % CANNED_RESPONSES.length]
        responseIndexRef.current++
        startStream(response)
      }, 1000)
      timersRef.current.push(t2)
    }, 400)

    timersRef.current.push(t)
  }, [isStreaming, startStream])

  const handleAddFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected) return
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.file.name))
      const newFiles = Array.from(selected)
        .filter(f => !existing.has(f.name))
        .map(file => ({
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        }))
      return [...prev, ...newFiles]
    })
    // Reset so the same file can be re-selected after removal
    e.target.value = ''
  }, [])

  const handleRemoveFile = useCallback((name: string) => {
    setFiles(prev => {
      const removed = prev.find(f => f.file.name === name)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return prev.filter(f => f.file.name !== name)
    })
  }, [])

  return (
    <div className="flex flex-col gap-16">

      {/* ---- Hero ---- */}
      <section className="flex flex-col gap-4 pb-8 border-b border-border">
        <span className="inline-flex items-center gap-2 font-mono text-xs text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-[3px] w-fit">
          v0.1.0
        </span>
        <h1 className="text-[2.5rem] font-bold text-foreground tracking-tighter leading-tight max-sm:text-[2rem]">
          Composure
        </h1>
        <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
          React components for building AI chat interfaces — purpose-built for
          streaming, auto-scroll, code highlighting, and the patterns every AI
          app needs.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <NavLink
            to="/components/composer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-5 py-2 text-sm font-semibold no-underline cursor-pointer transition-opacity duration-100 hover:opacity-88 motion-reduce:transition-none"
          >
            Browse components
          </NavLink>
          <a
            href="https://github.com/kkdaily/composure"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-transparent text-secondary-foreground border border-border rounded-md px-5 py-2 text-sm font-medium no-underline cursor-pointer transition-[border-color,color] duration-100 hover:border-muted-foreground hover:text-foreground motion-reduce:transition-none"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* ---- Live Demo ---- */}
      <section className="flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">
          Live demo
        </span>
        <div className="flex flex-col h-[540px] border border-border rounded-lg overflow-hidden bg-background shadow-sm dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] max-sm:h-[460px]">
          <ScrollArea className="flex-1 min-h-0" mode="manual">
            <div className="flex flex-col gap-5 p-5">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={streamedMsgIds.current.has(msg.id) ? '' : 'animate-[message-slide-in_220ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none'}
                >
                  <ChatMessage
                    role={msg.role}
                    showActionsOnHover={msg.role === 'assistant'}
                  >
                    <ChatMessageAvatar>
                      <span
                        className={cn(
                          'flex items-center justify-center w-full h-full rounded-full',
                          msg.role === 'assistant'
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {msg.role === 'assistant' ? <Sparkles className="size-4" /> : <User className="size-4" />}
                      </span>
                    </ChatMessageAvatar>
                    <ChatMessageContent variant={msg.role === 'assistant' ? 'plain' : 'filled'}>
                      {msg.role === 'assistant'
                        ? <MarkdownRenderer content={msg.content} className="text-sm" />
                        : msg.content
                      }
                    </ChatMessageContent>
                    {msg.role === 'assistant' && (
                      <ChatMessageActions>
                        <Button variant="ghost" size="icon-xs" aria-label="Copy">
                          <Copy className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" aria-label="Regenerate">
                          <RotateCw className="size-3.5" />
                        </Button>
                      </ChatMessageActions>
                    )}
                  </ChatMessage>
                </div>
              ))}

              {isThinking && (
                <div className="animate-[message-slide-in_220ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
                  <ChatMessage role="assistant">
                    <ChatMessageAvatar>
                      <span className="flex items-center justify-center w-full h-full rounded-full bg-primary/15 text-primary">
                        <Sparkles className="size-4" />
                      </span>
                    </ChatMessageAvatar>
                    <ChatMessageLoading />
                  </ChatMessage>
                </div>
              )}

              {streamingContent !== null && (
                <div className="animate-[message-slide-in_220ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
                  <ChatMessage role="assistant">
                    <ChatMessageAvatar>
                      <span className="flex items-center justify-center w-full h-full rounded-full bg-primary/15 text-primary">
                        <Sparkles className="size-4" />
                      </span>
                    </ChatMessageAvatar>
                    <ChatMessageContent variant="plain">
                      <MarkdownRenderer
                        content={streamingContent || '\u200B'}
                        streaming
                        className="text-sm"
                      />
                    </ChatMessageContent>
                  </ChatMessage>
                </div>
              )}
            </div>

            <ScrollAreaScrollToBottom label="Scroll to bottom">
              <ArrowDown className="size-4" />
            </ScrollAreaScrollToBottom>
          </ScrollArea>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="p-3 border-t border-border bg-card">
            <Composer
              value={composerValue}
              onChange={setComposerValue}
              onSubmit={isStreaming ? handleStop : handleSend}
            >
              {files.length > 0 && (
                <ComposerHeader>
                  <ComposerHeaderStart>
                    {files.map(({ file, preview }) => (
                      <FilePreview
                        key={file.name}
                        name={file.name}
                        size="sm"
                        thumbnail={preview}
                        onRemove={() => handleRemoveFile(file.name)}
                      />
                    ))}
                  </ComposerHeaderStart>
                </ComposerHeader>
              )}
              <ComposerInput placeholder="Try sending a message…" />
              <ComposerFooter bordered={false}>
                <ComposerFooterStart>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Attach file"
                    onClick={handleAddFile}
                  >
                    <Plus className="size-4" />
                  </Button>
                </ComposerFooterStart>
                <ComposerFooterEnd>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="h-8 border-none shadow-none text-sm gap-1 px-2 text-muted-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sonnet">Claude 4 Sonnet</SelectItem>
                      <SelectItem value="opus">Claude 4 Opus</SelectItem>
                      <SelectItem value="haiku">Claude 4 Haiku</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    </SelectContent>
                  </Select>
                  {isStreaming ? (
                    <Button
                      variant="default"
                      size="icon-sm"
                      aria-label="Stop generating"
                      type="submit"
                    >
                      <Square className="size-3.5 fill-current" />
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="icon-sm"
                      aria-label="Send"
                      type="submit"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                  )}
                </ComposerFooterEnd>
              </ComposerFooter>
            </Composer>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Type a message and press Enter — the demo is fully interactive
        </p>
      </section>

      {/* ---- Highlights ---- */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Built for the hard parts
          </h2>
          <p className="text-base text-secondary-foreground leading-relaxed max-w-[600px]">
            Every AI chat app rebuilds the same complex UI patterns. Composure
            extracts them into composable, accessible, theme-aware components
            for the shadcn ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <div className="flex flex-col gap-2 p-5 bg-card border border-border rounded-md">
            <span className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
              <ScrollText className="size-5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Scroll intent detection</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Distinguishes user scrolls from programmatic ones using
              wheel/touch events — streaming auto-scrolls without hijacking
              reading.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 bg-card border border-border rounded-md">
            <span className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
              <Zap className="size-5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Streaming-safe highlighting</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Lazy-loads Shiki grammars with a sync fast-path to avoid flashes
              during character-by-character code rendering.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 bg-card border border-border rounded-md">
            <span className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
              <Puzzle className="size-5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Composable primitives</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Sub-components share state via context. Named exports for
              tree-shaking. Mix and match in any layout.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 bg-card border border-border rounded-md">
            <span className="flex items-center justify-center size-9 rounded-md bg-primary/10 text-primary">
              <Palette className="size-5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Built for shadcn</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              Designed for the shadcn registry. Works with your existing theme
              tokens, dark mode, and primitives like Button and Avatar.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Installation ---- */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Installation
          </h2>
          <p className="text-base text-secondary-foreground leading-relaxed max-w-[600px]">
            Composure components are available on the shadcn registry. Add them
            to any project that has shadcn/ui set up.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step 1
            </span>
            <p className="text-sm text-secondary-foreground">
              Install the components you need:
            </p>
            <CodeSnippet language="bash">{`pnpm dlx shadcn@latest add https://composureui.com/r/composer.json
pnpm dlx shadcn@latest add https://composureui.com/r/chat-message.json
pnpm dlx shadcn@latest add https://composureui.com/r/scroll-area.json
pnpm dlx shadcn@latest add https://composureui.com/r/code-block.json
pnpm dlx shadcn@latest add https://composureui.com/r/markdown-renderer.json
pnpm dlx shadcn@latest add https://composureui.com/r/file-preview.json`}</CodeSnippet>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step 2
            </span>
            <p className="text-sm text-secondary-foreground">
              Add the composure CSS variables to your globals.css for AI-specific
              tokens (chat bubbles, file type colors):
            </p>
            <CodeSnippet language="css">{`:root {
  --composure-assistant-bubble: #f0f0f0;
  --composure-user-bubble: #7c3aed;
  --composure-user-bubble-text: #ffffff;
}

.dark {
  --composure-assistant-bubble: #1e1e1e;
  --composure-user-bubble: #818cf8;
  --composure-user-bubble-text: #111111;
}`}</CodeSnippet>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step 3
            </span>
            <p className="text-sm text-secondary-foreground">
              Import and compose. Each component exports sub-components as
              separate named exports — mix and match in any layout.
            </p>
            <CodeSnippet language="tsx">{`import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage, ChatMessageContent } from '@/components/ui/chat-message'
import { Composer, ComposerInput, ComposerFooter } from '@/components/ui/composer'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { Button } from '@/components/ui/button'

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
          </div>
        </div>
      </section>

    </div>
  )
}
