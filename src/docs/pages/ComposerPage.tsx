import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Composer,
  ComposerInput,
  ComposerHeader,
  ComposerHeaderStart,
  ComposerFooter,
  ComposerFooterStart,
  ComposerFooterEnd,
} from '../../components/Composer/Composer'
import { IconButton } from '../../components/IconButton/IconButton'
import { Select } from '../../components/Select/Select'
import { FilePreview } from '../../components/FilePreview/FilePreview'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

const SendIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9M14 2l-4 12-3-7-7-3z" />
  </svg>
)

const StopIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <rect x="3" y="3" width="10" height="10" rx="1" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const PlusIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
)


type DemoState = 'idle' | 'streaming'
type DemoHeader = 'none' | 'plain' | 'bordered'
type DemoFooter = 'none' | 'bordered' | 'borderless'
type DemoSendPosition = 'inline' | 'footer'

interface DemoMessage {
  role: 'user' | 'assistant'
  content: string
}

const AI_RESPONSES = [
  'That\'s a great question! Let me think about that for a moment.',
  'Here\'s what I found — the key insight is that simplicity often wins.',
  'I can help with that. There are a few approaches worth considering.',
  'Interesting! Based on my analysis, I\'d recommend starting with the basics.',
]

const MODEL_OPTIONS = [
  { value: 'gpt-5.4', label: 'GPT-5.4' },
  { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { value: 'gemini-3-1-pro', label: 'Gemini 3.1 Pro' },
]

export function ComposerPage() {
  const [demoValue, setDemoValue] = useState('')
  const [demoDisabled, setDemoDisabled] = useState(false)
  const [demoState, setDemoState] = useState<DemoState>('idle')
  const [demoHeader, setDemoHeader] = useState<DemoHeader>('none')
  const [demoFooter, setDemoFooter] = useState<DemoFooter>('borderless')
  const [demoSendPosition, setDemoSendPosition] = useState<DemoSendPosition>('footer')
  const [demoModel, setDemoModel] = useState('gpt-5.4')
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const streamRef = useRef<number | null>(null)
  const responseIndexRef = useRef(0)
  const messageLogRef = useRef<HTMLDivElement>(null)

  // Auto-scroll message log
  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight
    }
  }, [messages, streamingText])

  const stopStreaming = useCallback(() => {
    if (streamRef.current) {
      clearInterval(streamRef.current)
      streamRef.current = null
    }
    if (streamingText) {
      setMessages((prev) => [...prev, { role: 'assistant', content: streamingText }])
      setStreamingText('')
    }
    setDemoState('idle')
  }, [streamingText])

  const handleDemoSubmit = useCallback((value: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: value }])
    setDemoValue('')
    setDemoState('streaming')

    const response = AI_RESPONSES[responseIndexRef.current % AI_RESPONSES.length]
    responseIndexRef.current++

    let charIndex = 0
    setStreamingText('')

    streamRef.current = window.setInterval(() => {
      charIndex++
      if (charIndex <= response.length) {
        setStreamingText(response.slice(0, charIndex))
      } else {
        clearInterval(streamRef.current!)
        streamRef.current = null
        setMessages((prev) => [...prev, { role: 'assistant', content: response }])
        setStreamingText('')
        setDemoState('idle')
      }
    }, 30)
  }, [])

  // Section examples
  const [basicValue, setBasicValue] = useState('')
  const [stopValue, setStopValue] = useState('')
  const [stopExampleStreaming, setStopExampleStreaming] = useState(false)
  const [resizeValue, setResizeValue] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [footerValue, setFooterValue] = useState('')
  const [footerSendValue, setFooterSendValue] = useState('')
  const [borderlessValue, setBorderlessValue] = useState('')
  const [headerValue, setHeaderValue] = useState('')

  return (
    <div className="flex flex-col gap-10">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .composer-demo-cursor { animation: none; }
        }
      `}</style>
      <h1 className="text-3xl font-bold text-foreground tracking-tight">Composer</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        A composable message input for AI chat interfaces — auto-resizing
        textarea with send and stop controls.
      </p>

      {/* Interactive demo */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg">
          <div className="flex flex-col gap-2 min-h-[48px] max-h-[200px] overflow-y-auto" ref={messageLogRef}>
            {messages.length === 0 && !streamingText ? (
              <span className="text-sm text-muted-foreground italic">
                Type a message and press send…
              </span>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'text-sm px-3 py-2 rounded-md max-w-[80%] leading-relaxed',
                      msg.role === 'user'
                        ? 'text-primary-foreground bg-[var(--color-user-bubble)] self-end'
                        : 'text-foreground bg-[var(--color-assistant-bubble)] self-start'
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {streamingText && (
                  <div className="text-sm px-3 py-2 rounded-md max-w-[80%] leading-relaxed text-foreground bg-[var(--color-assistant-bubble)] self-start">
                    {streamingText}
                    <span
                      className="composer-demo-cursor inline-block w-0.5 h-[1em] bg-foreground ml-px align-text-bottom"
                      style={{ animation: 'blink 220ms step-end infinite' }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <Composer
            value={demoValue}
            onChange={setDemoValue}
            onSubmit={handleDemoSubmit}
            disabled={demoDisabled}
          >
            {demoHeader !== 'none' && (
              <ComposerHeader bordered={demoHeader === 'bordered'}>
                <ComposerHeaderStart>
                  <FilePreview name="screenshot.png" thumbnail="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=120&fit=crop" onRemove={() => {}} />
                  <FilePreview name="report.pdf" onRemove={() => {}} />
                </ComposerHeaderStart>
              </ComposerHeader>
            )}
            <ComposerInput placeholder="Ask anything…" />
            {demoSendPosition === 'inline' && (
              demoState === 'streaming' ? (
                <IconButton variant="destructive" label="Stop generating" onClick={stopStreaming}>
                  <StopIcon />
                </IconButton>
              ) : (
                <IconButton variant="primary" label="Send message" disabled={!demoValue.trim()} onClick={() => handleDemoSubmit(demoValue)}>
                  <SendIcon />
                </IconButton>
              )
            )}
            {demoFooter !== 'none' && (
              <ComposerFooter bordered={demoFooter === 'bordered'}>
                <ComposerFooterStart>
                  <IconButton label="Add" size="md">
                    <PlusIcon />
                  </IconButton>
                </ComposerFooterStart>
                <ComposerFooterEnd>
                  <Select
                    value={demoModel}
                    onChange={setDemoModel}
                    options={MODEL_OPTIONS}
                    size="md"
                    variant="ghost"
                    disabled={demoDisabled}
                  />
                  {demoSendPosition === 'footer' && (
                    demoState === 'streaming' ? (
                      <IconButton variant="destructive" label="Stop generating" onClick={stopStreaming}>
                        <StopIcon />
                      </IconButton>
                    ) : (
                      <IconButton variant="primary" label="Send message" disabled={!demoValue.trim()} onClick={() => handleDemoSubmit(demoValue)}>
                        <SendIcon />
                      </IconButton>
                    )
                  )}
                </ComposerFooterEnd>
              </ComposerFooter>
            )}
          </Composer>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Header</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['none', 'plain', 'bordered'] as DemoHeader[]).map((h) => (
                <button
                  key={h}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoHeader === h
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoHeader(h)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Footer</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['none', 'bordered', 'borderless'] as DemoFooter[]).map((f) => (
                <button
                  key={f}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoFooter === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => {
                    setDemoFooter(f)
                    if (f === 'none' && demoSendPosition === 'footer') {
                      setDemoSendPosition('inline')
                    }
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Send</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['inline', 'footer'] as DemoSendPosition[]).map((p) => (
                <button
                  key={p}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoSendPosition === p
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => {
                    setDemoSendPosition(p)
                    if (p === 'footer' && demoFooter === 'none') {
                      setDemoFooter('bordered')
                    }
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Disabled</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['off', 'on'] as const).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoDisabled === (t === 'on')
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoDisabled(t === 'on')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Basic Usage</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          The minimal configuration — a <code>Composer</code> root with
          a <code>ComposerInput</code> and your own send button. The
          parent controls the input value and handles submission.
        </p>
        <Composer
          value={basicValue}
          onChange={setBasicValue}
          onSubmit={() => setBasicValue('')}
        >
          <ComposerInput />
          <IconButton variant="primary" label="Send message" disabled={!basicValue.trim()}>
            <SendIcon />
          </IconButton>
        </Composer>
        <CodeSnippet>{`const [value, setValue] = useState('')

<Composer
  value={value}
  onChange={setValue}
  onSubmit={(v) => {
    sendMessage(v)
    setValue('')
  }}
>
  <ComposerInput placeholder="Send a message…" />
  <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
    <SendIcon />
  </IconButton>
</Composer>`}</CodeSnippet>
      </section>

      {/* With Stop Button */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Stop Button</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Swap the send button for a stop button while the AI is generating a
          response. This lets the user cancel mid-stream — a standard pattern
          in ChatGPT, Claude, and similar interfaces.
        </p>
        <Composer
          value={stopValue}
          onChange={setStopValue}
          onSubmit={() => {
            setStopValue('')
            setStopExampleStreaming(true)
          }}
        >
          <ComposerInput placeholder="Ask anything…" />
          {stopExampleStreaming ? (
            <IconButton variant="destructive" label="Stop generating" onClick={() => setStopExampleStreaming(false)}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton variant="primary" label="Send message" disabled={!stopValue.trim()}>
              <SendIcon />
            </IconButton>
          )}
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerInput />
  {isStreaming
    ? <IconButton variant="destructive" label="Stop generating" onClick={handleStop}>
        <StopIcon />
      </IconButton>
    : <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
        <SendIcon />
      </IconButton>
  }
</Composer>`}</CodeSnippet>
      </section>

      {/* Auto-Resize */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Auto-Resize</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          <code>ComposerInput</code> grows with content up
          to <code>maxRows</code>, then becomes scrollable. Set{' '}
          <code>minRows</code> to start taller — useful for prompt-heavy
          interfaces where users routinely write multi-line messages.
        </p>
        <Composer
          value={resizeValue}
          onChange={setResizeValue}
          onSubmit={() => setResizeValue('')}
        >
          <ComposerInput minRows={3} maxRows={6} placeholder="Try typing multiple lines…" />
          <IconButton variant="primary" label="Send message" disabled={!resizeValue.trim()}>
            <SendIcon />
          </IconButton>
        </Composer>
        <CodeSnippet>{`<ComposerInput
  minRows={3}
  maxRows={6}
  placeholder="Try typing multiple lines…"
/>`}</CodeSnippet>
      </section>

      {/* Custom Actions */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Custom Actions</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Since the Composer doesn't own the action button, you can use any
          button variant, icon, or label. This example uses a sparkle icon
          for a "Generate" action instead of the typical send arrow.
        </p>
        <Composer
          value={customValue}
          onChange={setCustomValue}
          onSubmit={() => setCustomValue('')}
        >
          <ComposerInput placeholder="Generate something…" />
          <IconButton variant="primary" label="Generate" disabled={!customValue.trim()}>
            <SparkleIcon />
          </IconButton>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleGenerate}>
  <ComposerInput placeholder="Generate something…" />
  <IconButton variant="primary" label="Generate" disabled={!value.trim()}>
    <SparkleIcon />
  </IconButton>
</Composer>`}</CodeSnippet>
      </section>

      {/* With Footer */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Footer</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>ComposerFooter</code> to add a row of controls below the
          textarea — model pickers, file attachments, token counts, or any
          other metadata. <code>ComposerFooterStart</code> groups items on the
          left; <code>ComposerFooterEnd</code> pushes items to the right. Both
          are optional.
        </p>
        <Composer
          value={footerValue}
          onChange={setFooterValue}
          onSubmit={() => setFooterValue('')}
        >
          <ComposerInput placeholder="Ask anything…" />
          <IconButton variant="primary" label="Send message" disabled={!footerValue.trim()}>
            <SendIcon />
          </IconButton>
          <ComposerFooter>
            <ComposerFooterStart>
              <IconButton label="Add" size="md">
                <PlusIcon />
              </IconButton>
            </ComposerFooterStart>
            <ComposerFooterEnd>
              <span className="text-xs text-muted-foreground font-mono">0 / 4,096 tokens</span>
            </ComposerFooterEnd>
          </ComposerFooter>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerInput placeholder="Ask anything…" />
  <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
    <SendIcon />
  </IconButton>
  <ComposerFooter>
    <ComposerFooterStart>
      <IconButton label="Add" size="md">
        <PlusIcon />
      </IconButton>
    </ComposerFooterStart>
    <ComposerFooterEnd>
      <span>0 / 4,096 tokens</span>
    </ComposerFooterEnd>
  </ComposerFooter>
</Composer>`}</CodeSnippet>
      </section>

      {/* Borderless Footer */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Borderless Footer</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Set <code>bordered=&#123;false&#125;</code> on <code>ComposerFooter</code> to
          remove the separator line between the input and footer — useful for a
          more minimal, compact look where the footer feels like part of the
          input area rather than a distinct zone.
        </p>
        <Composer
          value={borderlessValue}
          onChange={setBorderlessValue}
          onSubmit={() => setBorderlessValue('')}
        >
          <ComposerInput placeholder="Ask anything…" />
          <IconButton variant="primary" label="Send message" disabled={!borderlessValue.trim()}>
            <SendIcon />
          </IconButton>
          <ComposerFooter bordered={false}>
            <ComposerFooterStart>
              <IconButton label="Add" size="md">
                <PlusIcon />
              </IconButton>
            </ComposerFooterStart>
          </ComposerFooter>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerInput placeholder="Ask anything…" />
  <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
    <SendIcon />
  </IconButton>
  <ComposerFooter bordered={false}>
    <ComposerFooterStart>
      <IconButton label="Add" size="md">
        <PlusIcon />
      </IconButton>
    </ComposerFooterStart>
  </ComposerFooter>
</Composer>`}</CodeSnippet>
      </section>

      {/* With Header */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Header</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>ComposerHeader</code> to add a row of content above the
          textarea — file attachments, selected tools, or context indicators.{' '}
          <code>ComposerHeaderStart</code> groups items on the left;{' '}
          <code>ComposerHeaderEnd</code> pushes items to the right. Both are
          optional. The header always renders above the input regardless of DOM
          order.
        </p>
        <Composer
          value={headerValue}
          onChange={setHeaderValue}
          onSubmit={() => setHeaderValue('')}
        >
          <ComposerHeader>
            <ComposerHeaderStart>
              <FilePreview name="report.pdf" onRemove={() => {}} />
              <FilePreview name="data.csv" onRemove={() => {}} />
            </ComposerHeaderStart>
          </ComposerHeader>
          <ComposerInput placeholder="Ask about these files…" />
          <IconButton variant="primary" label="Send message" disabled={!headerValue.trim()}>
            <SendIcon />
          </IconButton>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerHeader>
    <ComposerHeaderStart>
      <FilePreview name="report.pdf" onRemove={() => {}} />
      <FilePreview name="data.csv" onRemove={() => {}} />
    </ComposerHeaderStart>
  </ComposerHeader>
  <ComposerInput placeholder="Ask about these files…" />
  <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
    <SendIcon />
  </IconButton>
</Composer>`}</CodeSnippet>
      </section>

      {/* Footer with Send Button */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Footer with Send Button</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Place the send button inside <code>ComposerFooterEnd</code> to
          move it into the footer row — matching layouts like
          ChatGPT where the action button sits alongside other footer controls
          rather than floating next to the textarea.
        </p>
        <Composer
          value={footerSendValue}
          onChange={setFooterSendValue}
          onSubmit={() => setFooterSendValue('')}
        >
          <ComposerInput placeholder="Message…" />
          <ComposerFooter>
            <ComposerFooterStart>
              <IconButton label="Add" size="md">
                <PlusIcon />
              </IconButton>
            </ComposerFooterStart>
            <ComposerFooterEnd>
              <IconButton variant="primary" label="Send message" disabled={!footerSendValue.trim()}>
                <SendIcon />
              </IconButton>
            </ComposerFooterEnd>
          </ComposerFooter>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerInput placeholder="Message…" />
  <ComposerFooter>
    <ComposerFooterStart>
      <IconButton label="Add" size="md">
        <PlusIcon />
      </IconButton>
    </ComposerFooterStart>
    <ComposerFooterEnd>
      <IconButton variant="primary" label="Send message" disabled={!value.trim()}>
        <SendIcon />
      </IconButton>
    </ComposerFooterEnd>
  </ComposerFooter>
</Composer>`}</CodeSnippet>
      </section>

      {/* Props tables */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>

        <h3 className="text-base font-semibold text-foreground">Composer</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <PropsTable
            rows={[
              ['disabled', 'boolean', 'false', 'Disables the entire composer'],
            ]}
          />
        </div>

        <h3 className="text-base font-semibold text-foreground">ComposerInput</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <PropsTable
            rows={[
              ['placeholder', 'string', "'Send a message…'", 'Placeholder text'],
              ['maxRows', 'number', '8', 'Maximum rows before scrolling'],
              ['minRows', 'number', '1', 'Minimum visible rows'],
            ]}
          />
        </div>

        <h3 className="text-base font-semibold text-foreground">ComposerHeader</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <PropsTable
            rows={[
              ['bordered', 'boolean', 'false', 'Show a border between the header and the input area'],
            ]}
          />
        </div>

        <h3 className="text-base font-semibold text-foreground">ComposerFooter</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <PropsTable
            rows={[
              ['bordered', 'boolean', 'true', 'Show a border between the footer and the input area'],
            ]}
          />
        </div>

      </section>
    </div>
  )
}

/* ===========================
   Reusable props table
   =========================== */

function PropsTable({
  rows,
}: {
  rows: [string, string, string, string][]
}) {
  return (
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
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop}>
            <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{prop}</code></td>
            <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{type}</code></td>
            <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">{def === '—' ? '—' : <code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{def}</code>}</td>
            <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
