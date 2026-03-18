import { useState, useEffect, useRef, useCallback } from 'react'
import { MarkdownRenderer } from '../../components/MarkdownRenderer/MarkdownRenderer'
import { CodeSnippet } from '../CodeSnippet'
import styles from './MarkdownRendererPage.module.css'

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

  const startStreaming = useCallback(() => {
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
  }, [contentType])

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
    <div className={styles.page}>
      <h1 className={styles.title}>MarkdownRenderer</h1>
      <p className={styles.subtitle}>
        Renders markdown content with full formatting, syntax-highlighted code
        blocks, and streaming support — designed for AI chat responses.
      </p>

      {/* ===== Demo ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <MarkdownRenderer
            content={demoContent}
            streaming={demoStreaming}
          />
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>CONTENT</span>
            <div className={styles.controlOptions}>
              {(['simple', 'rich', 'code-heavy', 'plain text'] as ContentType[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${contentType === t && !isSimulating ? styles.chipActive : ''}`}
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
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>STREAMING</span>
            <div className={styles.controlOptions}>
              <button
                className={`${styles.chip} ${isSimulating ? styles.chipActive : ''}`}
                onClick={startStreaming}
              >
                simulate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Content</h2>
        <p className={styles.sectionDescription}>
          Pass any markdown string to the <code>content</code> prop. Plain text
          renders cleanly as prose without unwanted formatting — no special
          handling needed.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={PLAIN_TEXT_CONTENT} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer
  content="Sure, I can help with that. The easiest approach would be to start with the existing configuration and modify it to fit your needs."
/>`}</CodeSnippet>
      </div>

      {/* ===== Headings and Structure ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Headings and Structure</h2>
        <p className={styles.sectionDescription}>
          Standard markdown headings and horizontal rules are fully supported,
          with typography scaled using design tokens.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={HEADINGS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`## Getting Started

Follow these steps to set up your project.

### Installation

Run the install command to get started.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Code Blocks ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Code Blocks</h2>
        <p className={styles.sectionDescription}>
          Fenced code blocks render with syntax highlighting via the built-in{' '}
          <code>CodeBlock</code> component. Inline code like{' '}
          <code>setState()</code> uses a subtle background treatment.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={CODE_HEAVY_CONTENT} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`Here's how to set up the client:

\\\`\\\`\\\`typescript
const client = new Client({ apiKey: process.env.API_KEY })
\\\`\\\`\\\`

The \\\`timeout\\\` option is in milliseconds.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Lists ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Lists</h2>
        <p className={styles.sectionDescription}>
          All list types including GFM task lists are supported, with proper
          nesting and spacing.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={LISTS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`- [x] Design the API schema
- [x] Implement authentication
- [ ] Add rate limiting\`} />`}</CodeSnippet>
      </div>

      {/* ===== Tables ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Tables</h2>
        <p className={styles.sectionDescription}>
          GitHub-flavored markdown tables render with clean borders and header
          styling consistent with the design system.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={TABLE_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| POST | /api/users | Create a user |\`} />`}</CodeSnippet>
      </div>

      {/* ===== Blockquotes ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Blockquotes</h2>
        <p className={styles.sectionDescription}>
          Blockquotes use the accent color for the left border, making them
          visually distinct for quoted content or callouts in AI responses.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={BLOCKQUOTE_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`> Use composition over inheritance. Prefer small, focused interfaces
> that can be combined.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Links ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Links</h2>
        <p className={styles.sectionDescription}>
          Links open in new tabs by default with{' '}
          <code>target=&quot;_blank&quot;</code> and{' '}
          <code>rel=&quot;noopener noreferrer&quot;</code> for security.
          Override via the <code>components.a</code> prop.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer content={LINKS_EXAMPLE} />
        </div>
        <CodeSnippet>{`<MarkdownRenderer content={\`Check out the [documentation](https://example.com) for more details.\`} />`}</CodeSnippet>
      </div>

      {/* ===== Streaming ===== */}
      <div className={styles.section}>
        <h2 className={styles.heading}>Streaming</h2>
        <p className={styles.sectionDescription}>
          Use <code>streaming</code> when rendering an AI response that is still
          being generated. Sets <code>aria-busy</code> for accessibility.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer
            content={sectionStreamContent || 'Press "start" to simulate streaming...'}
            streaming={sectionStreaming}
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>ACTION</span>
            <div className={styles.controlOptions}>
              <button
                className={`${styles.chip} ${sectionStreaming ? styles.chipActive : ''}`}
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
      <div className={styles.section}>
        <h2 className={styles.heading}>Custom Components</h2>
        <p className={styles.sectionDescription}>
          Override default element renderers via the <code>components</code>{' '}
          prop. The <code>code</code> override replaces fenced code blocks,{' '}
          <code>a</code> replaces links, and <code>img</code> replaces images.
        </p>
        <div className={styles.demoArea}>
          <MarkdownRenderer
            content={CUSTOM_COMPONENT_EXAMPLE}
            components={{
              code: ({ language, children }) => (
                <pre
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--color-accent)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    whiteSpace: 'pre',
                    overflowX: 'auto',
                  }}
                >
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
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
      <div className={styles.section}>
        <h2 className={styles.heading}>Props</h2>
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
                <td><code>content</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Markdown string to render</td>
              </tr>
              <tr>
                <td><code>streaming</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Sets <code>aria-busy</code> for assistive technology</td>
              </tr>
              <tr>
                <td><code>components</code></td>
                <td><code>{'Partial<MarkdownComponents>'}</code></td>
                <td>—</td>
                <td>Override default renderers for code blocks, links, and images</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
