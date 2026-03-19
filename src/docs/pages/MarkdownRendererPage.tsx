import { useState, useEffect, useRef, useCallback } from 'react'
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

/* ===========================
   Demo content strings
   =========================== */

const SIMPLE_CONTENT = `Here's a quick summary of the changes:

- Refactored the **authentication module** to use JWT tokens
- Fixed a bug where \`session.expires\` was not being checked
- Updated the deployment script to handle rollbacks

Let me know if you'd like me to explain any of these in more detail.`

const RICH_CONTENT = `## Analysis Complete

I've reviewed the codebase and found a few areas to improve.

### Performance

The main bottleneck is in the **data processing pipeline**. Specifically, the \`transformRecords()\` function is running in O(n²) time due to nested loops.

> Consider using a hash map for lookups instead of iterating through the array each time. This would bring it down to O(n).

### Dependencies

| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| react | 18.2.0 | 19.2.4 | Medium |
| vite | 5.4.0 | 8.0.2 | Low |
| typescript | 5.3.0 | 5.9.3 | Low |

### Next Steps

1. Optimize the \`transformRecords\` function
2. Update dependencies starting with low-risk packages
3. Add integration tests for the new auth flow

---

Feel free to ask if you need help with any of these.`

const CODE_HEAVY_CONTENT = `Here's how to set up the API client:

\`\`\`typescript
import { Client } from '@api/sdk'

const client = new Client({
  apiKey: process.env.API_KEY,
  baseUrl: 'https://api.example.com',
  timeout: 30000,
})
\`\`\`

Then you can make requests:

\`\`\`typescript
const response = await client.chat.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
  ],
})

console.log(response.choices[0].message.content)
\`\`\`

The \`timeout\` option is in milliseconds. If a request takes longer, it will throw a \`TimeoutError\`.`

const PLAIN_TEXT_CONTENT = `Sure, I can help with that. The easiest approach would be to start with the existing configuration and modify it to fit your needs. You don't need to rewrite anything from scratch.`

const CONTENT_MAP: Record<ContentType, string> = {
  simple: SIMPLE_CONTENT,
  rich: RICH_CONTENT,
  'code-heavy': CODE_HEAVY_CONTENT,
  'plain text': PLAIN_TEXT_CONTENT,
}

/* ===========================
   Section example content
   =========================== */

const HEADINGS_EXAMPLE = `## Getting Started

Follow these steps to set up your project.

### Installation

Run the install command to get started.

#### Prerequisites

Make sure you have Node.js 18+ installed.`

const LISTS_EXAMPLE = `Unordered list:

- Set up the development environment
- Configure the database connection
- Write integration tests
  - Unit tests for the API layer
  - End-to-end tests for the UI

Ordered list:

1. Clone the repository
2. Install dependencies
3. Run the migrations

Task list:

- [x] Design the API schema
- [x] Implement authentication
- [ ] Add rate limiting
- [ ] Deploy to production`

const TABLE_EXAMPLE = `| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create a user |
| DELETE | /api/users/:id | Delete a user |

Table with list-like content in cells:

| Feature | Status |
|---------|--------|
| Auth | Done |
| API | In progress |
| Tests | Pending |`

const BLOCKQUOTE_EXAMPLE = `> The best way to predict the future is to invent it.

This approach is commonly referenced in software architecture:

> Use composition over inheritance. Prefer small, focused interfaces
> that can be combined rather than deep class hierarchies.

Code inside a blockquote:

> Here's the recommended pattern:
>
> \`\`\`typescript
> const result = await fetchData()
> \`\`\``

const LINKS_EXAMPLE = `Check out the [documentation](https://example.com) for more details. You can also read the [API reference](https://example.com/api) for the full specification.`

const STREAMING_EXAMPLE = `Let me analyze your code. The issue is in the \`handleSubmit\` function — you're calling \`setState\` inside a loop, which triggers a re-render on every iteration.

Here's the fix:

\`\`\`typescript
function handleSubmit(items: Item[]) {
  const processed = items.map(item => transform(item))
  setState(processed)
}
\`\`\``

const CUSTOM_COMPONENT_EXAMPLE = `Here's a simple example:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\``

/* ===========================
   Types
   =========================== */

type ContentType = 'simple' | 'rich' | 'code-heavy' | 'plain text'

/* ===========================
   MarkdownRendererPage
   =========================== */

export function MarkdownRendererPage() {
  const [contentType, setContentType] = useState<ContentType>('rich')
  const [demoStreaming, setDemoStreaming] = useState(false)

  // Streaming simulation for the demo
  const [streamedContent, setStreamedContent] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const stopStreaming = useCallback(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsSimulating(false)
    setDemoStreaming(false)
    setStreamedContent('')
  }, [])

  const startStreaming = useCallback(() => {
    if (isSimulating) {
      stopStreaming()
      return
    }

    const fullContent = CONTENT_MAP[contentType]
    setStreamedContent('')
    setIsSimulating(true)
    setDemoStreaming(true)

    let index = 0
    intervalRef.current = window.setInterval(() => {
      // Stream 2-4 characters per tick for a natural feel
      const chunkSize = 2 + Math.floor(Math.random() * 3)
      index += chunkSize
      if (index >= fullContent.length) {
        setStreamedContent(fullContent)
        setIsSimulating(false)
        setDemoStreaming(false)
        if (intervalRef.current) window.clearInterval(intervalRef.current)
      } else {
        setStreamedContent(fullContent.slice(0, index))
      }
    }, 30)
  }, [contentType, isSimulating, stopStreaming])

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [])

  // Section-level streaming simulation
  const [sectionStreamContent, setSectionStreamContent] = useState('')
  const [sectionStreaming, setSectionStreaming] = useState(false)
  const sectionIntervalRef = useRef<number | null>(null)

  const startSectionStreaming = useCallback(() => {
    setSectionStreamContent('')
    setSectionStreaming(true)
    let index = 0
    sectionIntervalRef.current = window.setInterval(() => {
      const chunkSize = 2 + Math.floor(Math.random() * 3)
      index += chunkSize
      if (index >= STREAMING_EXAMPLE.length) {
        setSectionStreamContent(STREAMING_EXAMPLE)
        setSectionStreaming(false)
        if (sectionIntervalRef.current) window.clearInterval(sectionIntervalRef.current)
      } else {
        setSectionStreamContent(STREAMING_EXAMPLE.slice(0, index))
      }
    }, 30)
  }, [])

  useEffect(() => {
    return () => {
      if (sectionIntervalRef.current) window.clearInterval(sectionIntervalRef.current)
    }
  }, [])

  const demoContent = isSimulating ? streamedContent : CONTENT_MAP[contentType]

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">MarkdownRenderer</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        Renders markdown content with full formatting, syntax-highlighted code
        blocks, and streaming support, designed for AI chat responses.
      </p>
      <CodeSnippet language="bash">{`pnpm dlx shadcn@latest add https://composureui.com/r/markdown-renderer.json`}</CodeSnippet>

      {/* ===== Demo ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="p-6 bg-card border border-border rounded-lg h-[400px] overflow-y-auto">
          <MarkdownRenderer
            content={demoContent}
            streaming={demoStreaming}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">CONTENT</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['simple', 'rich', 'code-heavy', 'plain text'] as ContentType[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    contentType === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => {
                    if (intervalRef.current) window.clearInterval(intervalRef.current)
                    setIsSimulating(false)
                    setDemoStreaming(false)
                    setContentType(t)
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">STREAMING</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                  isSimulating
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={startStreaming}
              >
                {isSimulating ? 'stop' : 'simulate'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Content</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Pass any markdown string to the <code>content</code> prop. Plain text
          renders as clean prose without extra formatting and no special handling
          is needed.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={PLAIN_TEXT_CONTENT} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer
  content="Sure, I can help with that. The easiest approach would be to start with the existing configuration and modify it to fit your needs."
/>`}</CodeSnippet>
      </div>

      {/* ===== Headings and Structure ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Headings and Structure</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Standard markdown headings and horizontal rules are fully supported,
          with typography scaled using design tokens.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={HEADINGS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`## Getting Started

Follow these steps to set up your project.

### Installation

Run the install command to get started.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Code Blocks ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Code Blocks</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Fenced code blocks render with syntax highlighting via the built-in{' '}
          <code>CodeBlock</code> component. Inline code like{' '}
          <code>setState()</code> uses a subtle background treatment.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={CODE_HEAVY_CONTENT} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`Here's how to set up the client:

\\\`\\\`\\\`typescript
const client = new Client({ apiKey: process.env.API_KEY })
\\\`\\\`\\\`

The \\\`timeout\\\` option is in milliseconds.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Lists ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Lists</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          All list types including GFM task lists are supported, with proper
          nesting and spacing.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={LISTS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`- [x] Design the API schema
- [x] Implement authentication
- [ ] Add rate limiting\`} />`}</CodeSnippet>
      </div>

      {/* ===== Tables ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Tables</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          GitHub-flavored markdown tables render with clean borders and header
          styling consistent with the design system.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={TABLE_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create a user |\`} />`}</CodeSnippet>
      </div>

      {/* ===== Blockquotes ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Blockquotes</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Blockquotes use the accent color for the left border, making them
          visually distinct for quoted content or callouts in AI responses.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={BLOCKQUOTE_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`> Use composition over inheritance. Prefer small, focused interfaces
> that can be combined.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Links ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Links</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Links open in new tabs by default with{' '}
          <code>target=&quot;_blank&quot;</code> and{' '}
          <code>rel=&quot;noopener noreferrer&quot;</code> for security.
          Override via the <code>components.a</code> prop.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer content={LINKS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`Check out the [documentation](https://example.com) for more details.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Streaming ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Streaming</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>streaming</code> when rendering an AI response that is still
          being generated. Sets <code>aria-busy</code> for accessibility.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer
            content={sectionStreamContent || 'Press "start" to simulate streaming...'}
            streaming={sectionStreaming}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">ACTION</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                  sectionStreaming
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                )}
                onClick={startSectionStreaming}
                disabled={sectionStreaming}
              >
                start
              </button>
            </div>
          </div>
        </div>
        <CodeSnippet>{`<MarkdownRenderer
  content={streamedContent}
  streaming={isStreaming}
/>`}</CodeSnippet>
      </div>

      {/* ===== Custom Components ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Custom Components</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Override default element renderers via the <code>components</code>{' '}
          prop. The <code>code</code> override replaces fenced code blocks,{' '}
          <code>a</code> replaces links, and <code>img</code> replaces images.
        </p>
        <div className="p-6 bg-card border border-border rounded-lg">
          <MarkdownRenderer
            content={CUSTOM_COMPONENT_EXAMPLE}
            components={{
              code: ({ language, children }) => (
                <pre className="p-4 bg-muted rounded-lg border-2 border-dashed border-primary font-mono text-sm text-foreground whitespace-pre overflow-x-auto">
                  <div className="text-xs text-primary mb-2">
                    {language ? `Custom renderer — ${language}` : 'Custom renderer'}
                  </div>
                  {children}
                </pre>
              ),
            }}
          />
        </div>
        <CodeSnippet>{`<MarkdownRenderer
  content={markdownString}
  components={{
    code: ({ language, children }) => (
      <MyCustomCodeBlock language={language}>
        {children}
      </MyCustomCodeBlock>
    ),
  }}
/>`}</CodeSnippet>
      </div>

      {/* ===== Props Table ===== */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>
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
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">content</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">string</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Markdown string to render</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">streaming</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">boolean</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">false</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Sets <code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">aria-busy</code> for assistive technology</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">components</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{'Partial<MarkdownComponents>'}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Override default renderers for code blocks, links, and images</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
