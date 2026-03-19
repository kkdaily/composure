# Composure

React components for building AI chat interfaces, purpose-built for streaming, auto-scroll, code highlighting, and file attachments. Installable via the shadcn CLI.

**[Live docs](https://composureui.com)** · **[GitHub](https://github.com/kkdaily/composure)**

## Components

| Component | What it does |
|-----------|-------------|
| **ChatMessage** | Role-based message layout with avatar, content bubble, loading indicator, and hover-reveal actions |
| **CodeBlock** | Syntax-highlighted code display with Shiki, copy button, line numbers, and streaming-safe rendering |
| **Composer** | Auto-resizing textarea with composable header/footer slots, keyboard submit, and file attachment support |
| **FilePreview** | File attachment preview with auto-detected type icons, thumbnails, and removable state |
| **MarkdownRenderer** | GitHub Flavored Markdown with integrated CodeBlock highlighting and streaming support |
| **ScrollArea** | Smart auto-scrolling container with scroll intent detection, lerp-based smooth scroll, and scroll-to-bottom indicator |

Composure focuses on complex components that shadcn doesn't provide. For standard primitives (Button, Avatar, Select), use shadcn's built-in components alongside Composure.

## Installation

```bash
pnpm dlx shadcn@latest add https://composureui.com/r/chat-message.json
pnpm dlx shadcn@latest add https://composureui.com/r/composer.json
pnpm dlx shadcn@latest add https://composureui.com/r/scroll-area.json
pnpm dlx shadcn@latest add https://composureui.com/r/code-block.json
pnpm dlx shadcn@latest add https://composureui.com/r/markdown-renderer.json
pnpm dlx shadcn@latest add https://composureui.com/r/file-preview.json
```

## Quick example

```tsx
import { ScrollArea } from '@/components/ui/scroll-area'
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
        <ComposerInput placeholder="Message..." />
        <ComposerFooter>
          <Button size="sm" type="submit">Send</Button>
        </ComposerFooter>
      </Composer>
    </>
  )
}
```

## Built with

- React 19 + TypeScript (strict mode)
- Tailwind CSS 4 + shadcn/ui primitives
- Shiki for syntax highlighting
- Vite 8
- WCAG 2.1 AA accessible
- Full `prefers-reduced-motion` support

## License

MIT
