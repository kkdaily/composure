import { useState } from 'react'
import { Sparkles } from 'lucide-react'
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
import { cn } from '@/lib/utils'

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
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">CodeBlock</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        A styled code display for AI chat responses with syntax highlighting,
        line numbers, and a hover copy button built in.
      </p>
      <CodeSnippet language="bash">{`pnpm dlx shadcn@latest add https://composureui.com/r/code-block.json`}</CodeSnippet>

      {/* Interactive demo */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg">
          <CodeBlock>
            <CodeBlockContent
              language={demoLanguage === 'none' ? undefined : demoLanguage}
              showLineNumbers={demoLineNumbers === 'on'}
            >
              {demoCode}
            </CodeBlockContent>
          </CodeBlock>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[100px]">Language</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['none', 'typescript', 'python'] as DemoLanguage[]).map((l) => (
                <button
                  key={l}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoLanguage === l
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoLanguage(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[100px]">Line Numbers</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['on', 'off'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoLineNumbers === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Basic Usage</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Syntax Highlighting</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Line Numbers</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Enable <code>showLineNumbers</code> for longer snippets where line
          references matter. For example, when an AI explains specific lines
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">In a Chat Message</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Nest <code>CodeBlock</code> inside <code>ChatMessageContent</code> to
          render code as part of an AI response, just like ChatGPT or Claude
          would display code in a conversation.
        </p>
        <ChatMessage role="assistant">
          <ChatMessageAvatar>
            <Sparkles className="size-4" />
          </ChatMessageAvatar>
          <ChatMessageContent variant="plain">
            <p className="m-0 text-sm leading-relaxed">Here's how you can send a message to the API:</p>
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>

        <h3 className="text-base font-semibold text-foreground">CodeBlockContent</h3>
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
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">language</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">string</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Language identifier for syntax highlighting (e.g. <code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">"typescript"</code>, <code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">"python"</code>)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">showLineNumbers</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">boolean</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">false</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Show line numbers in the gutter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
