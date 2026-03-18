import { useState } from 'react'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageActions,
} from '../../components/ChatMessage/ChatMessage'
import { IconButton } from '../../components/IconButton/IconButton'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

/* ===========================
   Icons
   =========================== */

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-2.8 2.7-5 6-5s6 2.2 6 5" />
  </svg>
)

const CopyIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="9" height="9" rx="1" />
    <path d="M2 11V3a1 1 0 0 1 1-1h8" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8a6 6 0 0 1 10.3-4.2L14 2v4h-4" />
    <path d="M14 8a6 6 0 0 1-10.3 4.2L2 14v-4h4" />
  </svg>
)

const ThumbUpIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 9V14H2V9h3zm1-1l2.5-5a1.5 1.5 0 0 1 2.8.7L10.5 7H13a2 2 0 0 1 1.9 2.6l-1.5 5A2 2 0 0 1 11.5 16H6" />
  </svg>
)

const ThumbDownIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 7V2h3v5h-3zm-1 1L7.5 13a1.5 1.5 0 0 1-2.8-.7L5.5 9H3a2 2 0 0 1-1.9-2.6l1.5-5A2 2 0 0 1 4.5 0H10" />
  </svg>
)

/* ===========================
   Types
   =========================== */

type DemoRole = 'assistant' | 'user'
type DemoVariant = 'filled' | 'plain'
type DemoToggle = 'show' | 'hide'
type DemoOnOff = 'on' | 'off'

/* ===========================
   Page
   =========================== */

export function ChatMessagePage() {
  const [demoRole, setDemoRole] = useState<DemoRole>('assistant')
  const [demoVariant, setDemoVariant] = useState<DemoVariant>('filled')
  const [demoAvatar, setDemoAvatar] = useState<DemoToggle>('show')
  const [demoActions, setDemoActions] = useState<DemoToggle>('show')
  const [demoHoverActions, setDemoHoverActions] = useState<DemoOnOff>('off')

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">ChatMessage</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        A composable chat message for AI conversations — avatar, content bubble,
        and action buttons arranged with role-aware styling.
      </p>

      {/* Interactive demo */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg">
          <ChatMessage role={demoRole} showActionsOnHover={demoHoverActions === 'on'}>
            {demoAvatar === 'show' && (
              <ChatMessageAvatar>
                {demoRole === 'assistant' ? <SparkleIcon /> : <UserIcon />}
              </ChatMessageAvatar>
            )}
            <ChatMessageContent variant={demoVariant}>
              {demoRole === 'assistant'
                ? "Here's what I found — the key insight is that simplicity often wins over complexity in component design."
                : 'Can you explain how React context works?'}
            </ChatMessageContent>
            {demoActions === 'show' && (
              <ChatMessageActions>
                <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
                {demoRole === 'assistant' && (
                  <>
                    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
                    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
                    <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
                  </>
                )}
              </ChatMessageActions>
            )}
          </ChatMessage>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Role</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['assistant', 'user'] as DemoRole[]).map((r) => (
                <button
                  key={r}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoRole === r
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Variant</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['filled', 'plain'] as DemoVariant[]).map((v) => (
                <button
                  key={v}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoVariant === v
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Avatar</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['show', 'hide'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoAvatar === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoAvatar(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Actions</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['show', 'hide'] as DemoToggle[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoActions === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoActions(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Hover actions</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['on', 'off'] as DemoOnOff[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoHoverActions === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoHoverActions(t)}
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
          The simplest configuration — a <code>ChatMessage</code> with just{' '}
          <code>ChatMessageContent</code>. Useful for compact layouts or when
          avatars and actions aren't needed.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant">
            <ChatMessageContent>
              I can help with that. There are a few approaches worth considering.
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageContent>
    I can help with that. There are a few approaches worth considering.
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* With Avatar */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Avatar</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Add a <code>ChatMessageAvatar</code> to show who sent the message.
          Pass any element as children — an <code>img</code>, SVG icon, or text
          initials.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Based on my analysis, I'd recommend starting with the basics.
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              That makes sense. Can you show me an example?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Based on my analysis, I'd recommend starting with the basics.
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    That makes sense. Can you show me an example?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* With Actions */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Actions</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>ChatMessageActions</code> to add action buttons below the
          message bubble — copy, regenerate, thumbs up/down, or any controls
          relevant to your AI interface.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Here's a quick summary of the key differences between server
              components and client components in React.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
              <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
              <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Here's a quick summary of the key differences...
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
    <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Hover Actions */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Hover Actions</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Pass <code>showActionsOnHover</code> to keep actions hidden until the
          user hovers the message. Actions are also revealed on keyboard focus
          within the row, keeping the interface accessible. Hover over the
          message below to see it in action.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant" showActionsOnHover>
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Here's a quick summary of the key differences between server
              components and client components in React.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
              <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
              <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant" showActionsOnHover>
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Here's a quick summary of the key differences...
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
    <IconButton label="Bad response" size="sm"><ThumbDownIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* User Messages */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">User Messages</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Set <code>role</code> to <code>"user"</code> for right-aligned
          messages with accent-colored bubbles. The layout automatically mirrors
          — the avatar moves to the right and content aligns to the end.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              How do I implement dark mode with CSS custom properties?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    How do I implement dark mode with CSS custom properties?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Conversation Thread */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Conversation Thread</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Compose multiple <code>ChatMessage</code> components to build a full
          conversation thread. Each message independently controls its role,
          avatar, and actions.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              What's the difference between useEffect and useLayoutEffect?
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Both run after render, but useLayoutEffect fires synchronously
              before the browser paints. Use useLayoutEffect when you need to
              measure DOM elements or prevent visual flicker.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Got it, thanks!
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="user">
  <ChatMessageAvatar><UserIcon /></ChatMessageAvatar>
  <ChatMessageContent>
    What's the difference between useEffect and useLayoutEffect?
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="assistant">
  <ChatMessageAvatar><SparkleIcon /></ChatMessageAvatar>
  <ChatMessageContent>
    Both run after render, but useLayoutEffect fires synchronously...
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Good response" size="sm"><ThumbUpIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar><UserIcon /></ChatMessageAvatar>
  <ChatMessageContent>Got it, thanks!</ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Variant */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Variant</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>variant="plain"</code> on <code>ChatMessageContent</code> to
          remove the bubble background — useful for assistant messages in
          interfaces like Claude where responses appear as plain text rather than
          inside a colored bubble.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant">
            <ChatMessageAvatar>
              <SparkleIcon />
            </ChatMessageAvatar>
            <ChatMessageContent variant="plain">
              Here's a quick summary of the key differences between server
              components and client components in React.
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="user">
            <ChatMessageAvatar>
              <UserIcon />
            </ChatMessageAvatar>
            <ChatMessageContent>
              Can you give me a concrete example?
            </ChatMessageContent>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent variant="plain">
    Here's a quick summary of the key differences...
  </ChatMessageContent>
</ChatMessage>

<ChatMessage role="user">
  <ChatMessageAvatar>
    <UserIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    Can you give me a concrete example?
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Without Avatar */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Without Avatar</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          All sub-components are optional and work in any combination. Here,
          actions are shown without an avatar — useful for minimal layouts that
          still need interactive controls.
        </p>
        <div className="flex flex-col gap-4">
          <ChatMessage role="assistant">
            <ChatMessageContent>
              Interesting! Based on my analysis, I'd recommend starting with the
              basics and building up from there.
            </ChatMessageContent>
            <ChatMessageActions>
              <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
              <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
            </ChatMessageActions>
          </ChatMessage>
        </div>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageContent>
    Interesting! Based on my analysis, I'd recommend starting with the
    basics and building up from there.
  </ChatMessageContent>
  <ChatMessageActions>
    <IconButton label="Copy" size="sm"><CopyIcon /></IconButton>
    <IconButton label="Regenerate" size="sm"><RefreshIcon /></IconButton>
  </ChatMessageActions>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>

        <h3 className="text-base font-semibold text-foreground">ChatMessage</h3>
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
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">role</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'assistant' | 'user'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Determines bubble color and layout direction</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">showActionsOnHover</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">boolean</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">false</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Hides <code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">ChatMessageActions</code> until the message is hovered or focused</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-semibold text-foreground">ChatMessageContent</h3>
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
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">variant</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'filled' | 'plain'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">'filled'</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Background style — filled shows a colored bubble, plain removes it</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
