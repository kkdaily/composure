import { useState } from 'react'
import {
  CodeBlock,
  CodeBlockContent,
} from '../../components/CodeBlock/CodeBlock'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
} from '../../components/ChatMessage/ChatMessage'
import { CodeSnippet } from '../CodeSnippet'
import styles from './CodeBlockPage.module.css'

/* ===========================
   Icons
   =========================== */

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

/* ===========================
   Page
   =========================== */

export function CodeBlockPage() {
  const [demoLanguage, setDemoLanguage] = useState<DemoLanguage>('typescript')
  const [demoLineNumbers, setDemoLineNumbers] = useState<DemoToggle>('off')

  const demoCode = demoLanguage === 'python' ? samplePython : sampleTypescript

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>CodeBlock</h1>
      <p className={styles.subtitle}>
        A styled code display for AI chat responses — syntax highlighting, line
        numbers, and a hover copy button built in.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <CodeBlock>
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
        </div>
      </section>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Basic Usage</h2>
        <p className={styles.sectionDescription}>
          Wrap <code>CodeBlockContent</code> in <code>CodeBlock</code>. A copy
          button appears automatically at the top right when the user hovers.
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

      {/* Syntax Highlighting */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Syntax Highlighting</h2>
        <p className={styles.sectionDescription}>
          Pass a <code>language</code> prop to <code>CodeBlockContent</code> to
          enable syntax highlighting. Tokens are resolved from the active theme.
        </p>
        <CodeBlock>
          <CodeBlockContent language="typescript">
            {sampleTypescript}
          </CodeBlockContent>
        </CodeBlock>
        <CodeSnippet>{`<CodeBlock>
  <CodeBlockContent language="typescript">
    {codeString}
  </CodeBlockContent>
</CodeBlock>`}</CodeSnippet>
      </section>

      {/* Line Numbers */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Line Numbers</h2>
        <p className={styles.sectionDescription}>
          Enable <code>showLineNumbers</code> for longer snippets where line
          references matter — for example, when an AI explains specific lines
          in generated code.
        </p>
        <CodeBlock>
          <CodeBlockContent language="python" showLineNumbers>
            {samplePython}
          </CodeBlockContent>
        </CodeBlock>
        <CodeSnippet>{`<CodeBlock>
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
                <td>Language identifier for syntax highlighting (e.g. <code>"typescript"</code>, <code>"python"</code>)</td>
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
