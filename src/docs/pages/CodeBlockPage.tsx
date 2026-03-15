import { useState, useCallback } from 'react'
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockContent,
} from '../../components/CodeBlock/CodeBlock'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
} from '../../components/ChatMessage/ChatMessage'
import { IconButton } from '../../components/IconButton/IconButton'
import { CodeSnippet } from '../CodeSnippet'
import styles from './CodeBlockPage.module.css'

/* ===========================
   Icons
   =========================== */

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
)

const CheckIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8.5l3.5 3.5 6.5-7" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

/* ===========================
   Sample code strings
   =========================== */

const sampleTypescript = `interface ChatMessage {
  role: 'assistant' | 'user'
  content: string
  timestamp: Date
}

async function sendMessage(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  return response.json()
}`

const samplePython = `import asyncio
from dataclasses import dataclass

@dataclass
class ChatMessage:
    role: str
    content: str

async def stream_response(prompt: str):
    async for chunk in client.stream(prompt):
        yield chunk.text`

const sampleShort = `const greeting = 'Hello, world!'
console.log(greeting)`

/* ===========================
   Types
   =========================== */

type DemoLanguage = 'none' | 'typescript' | 'python'
type DemoToggle = 'on' | 'off'
type DemoHeader = 'none' | 'filename' | 'filename + copy'

/* ===========================
   Page
   =========================== */

export function CodeBlockPage() {
  const [demoLanguage, setDemoLanguage] = useState<DemoLanguage>('typescript')
  const [demoLineNumbers, setDemoLineNumbers] = useState<DemoToggle>('off')
  const [demoHeader, setDemoHeader] = useState<DemoHeader>('filename + copy')
  const [demoCopied, setDemoCopied] = useState(false)

  const demoCode = demoLanguage === 'python' ? samplePython : sampleTypescript
  const demoFilename = demoLanguage === 'python' ? 'stream.py' : 'chat.ts'

  const handleDemoCopy = useCallback(() => {
    navigator.clipboard.writeText(demoCode).then(() => {
      setDemoCopied(true)
      setTimeout(() => setDemoCopied(false), 1500)
    })
  }, [demoCode])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>CodeBlock</h1>
      <p className={styles.subtitle}>
        A composable code display for AI chat responses — header, content,
        and line numbers with full consumer control over actions.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <CodeBlock>
            {demoHeader !== 'none' && (
              <CodeBlockHeader>
                <span>{demoFilename}</span>
                {demoHeader === 'filename + copy' && (
                  <IconButton
                    label={demoCopied ? 'Copied' : 'Copy code'}
                    size="sm"
                    variant="ghost"
                    onClick={handleDemoCopy}
                  >
                    {demoCopied ? <CheckIcon /> : <CopyIcon />}
                  </IconButton>
                )}
              </CodeBlockHeader>
            )}
            <CodeBlockContent
              language={demoLanguage === 'none' ? undefined : demoLanguage}
              showLineNumbers={demoLineNumbers === 'on'}
            >
              {demoCode}
            </CodeBlockContent>
          </CodeBlock>
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Language</span>
            <div className={styles.controlOptions}>
              {(['none', 'typescript', 'python'] as DemoLanguage[]).map((l) => (
                <button
                  key={l}
                  className={`${styles.chip} ${demoLanguage === l ? styles.chipActive : ''}`}
                  onClick={() => setDemoLanguage(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Line Numbers</span>
            <div className={styles.controlOptions}>
              {(['on', 'off'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${demoLineNumbers === t ? styles.chipActive : ''}`}
                  onClick={() => setDemoLineNumbers(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Header</span>
            <div className={styles.controlOptions}>
              {(['none', 'filename', 'filename + copy'] as DemoHeader[]).map((h) => (
                <button
                  key={h}
                  className={`${styles.chip} ${demoHeader === h ? styles.chipActive : ''}`}
                  onClick={() => setDemoHeader(h)}
                >
                  {h}
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
          The simplest configuration — a <code>CodeBlock</code> with just{' '}
          <code>CodeBlockContent</code>. Useful for inline code snippets in AI
          responses where no header or actions are needed.
        </p>
        <CodeBlock>
          <CodeBlockContent>{sampleShort}</CodeBlockContent>
        </CodeBlock>
        <CodeSnippet>{`<CodeBlock>
  <CodeBlockContent>
    {\`const greeting = 'Hello, world!'
console.log(greeting)\`}
  </CodeBlockContent>
</CodeBlock>`}</CodeSnippet>
      </section>

      {/* With Header */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Header</h2>
        <p className={styles.sectionDescription}>
          Add a <code>CodeBlockHeader</code> to display a filename, language
          label, or action buttons. The header is a flexbox row with{' '}
          <code>space-between</code> layout — place your own content freely.
        </p>
        <CodeBlock>
          <CodeBlockHeader>
            <span>chat.ts</span>
            <IconButton label="Copy code" size="sm" variant="ghost">
              <CopyIcon />
            </IconButton>
          </CodeBlockHeader>
          <CodeBlockContent language="typescript">
            {sampleTypescript}
          </CodeBlockContent>
        </CodeBlock>
        <CodeSnippet>{`<CodeBlock>
  <CodeBlockHeader>
    <span>chat.ts</span>
    <IconButton label="Copy code" size="sm" variant="ghost">
      <CopyIcon />
    </IconButton>
  </CodeBlockHeader>
  <CodeBlockContent language="typescript">
    {codeString}
  </CodeBlockContent>
</CodeBlock>`}</CodeSnippet>
      </section>

      {/* Line Numbers */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Line Numbers</h2>
        <p className={styles.sectionDescription}>
          Enable <code>showLineNumbers</code> on <code>CodeBlockContent</code>{' '}
          for longer code snippets where line references are helpful — for example,
          when an AI assistant explains specific lines in generated code.
        </p>
        <CodeBlock>
          <CodeBlockHeader>
            <span>stream.py</span>
          </CodeBlockHeader>
          <CodeBlockContent language="python" showLineNumbers>
            {samplePython}
          </CodeBlockContent>
        </CodeBlock>
        <CodeSnippet>{`<CodeBlock>
  <CodeBlockHeader>
    <span>stream.py</span>
  </CodeBlockHeader>
  <CodeBlockContent language="python" showLineNumbers>
    {codeString}
  </CodeBlockContent>
</CodeBlock>`}</CodeSnippet>
      </section>

      {/* In a Chat Message */}
      <section className={styles.section}>
        <h2 className={styles.heading}>In a Chat Message</h2>
        <p className={styles.sectionDescription}>
          Nest <code>CodeBlock</code> inside <code>ChatMessageContent</code> to
          render code as part of an AI response — just like ChatGPT or Claude
          would display code in a conversation.
        </p>
        <ChatMessage role="assistant">
          <ChatMessageAvatar>
            <SparkleIcon />
          </ChatMessageAvatar>
          <ChatMessageContent variant="plain">
            <p className={styles.inlineText}>Here's how you can send a message to the API:</p>
            <CodeBlock>
              <CodeBlockHeader>
                <span>chat.ts</span>
                <IconButton label="Copy code" size="sm" variant="ghost">
                  <CopyIcon />
                </IconButton>
              </CodeBlockHeader>
              <CodeBlockContent language="typescript">
                {sampleShort}
              </CodeBlockContent>
            </CodeBlock>
          </ChatMessageContent>
        </ChatMessage>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent variant="plain">
    <p>Here's how you can send a message to the API:</p>
    <CodeBlock>
      <CodeBlockHeader>
        <span>chat.ts</span>
        <IconButton label="Copy code" size="sm" variant="ghost">
          <CopyIcon />
        </IconButton>
      </CodeBlockHeader>
      <CodeBlockContent language="typescript">
        {codeString}
      </CodeBlockContent>
    </CodeBlock>
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>CodeBlockContent</h3>
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
                <td><code>language</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Language identifier — sets a data attribute for syntax highlighting integration</td>
              </tr>
              <tr>
                <td><code>showLineNumbers</code></td>
                <td><code>boolean</code></td>
                <td><code>false</code></td>
                <td>Show line numbers in the gutter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
