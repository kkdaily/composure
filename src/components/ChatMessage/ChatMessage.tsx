import {
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

/* ===========================
   Context
   =========================== */

interface ChatMessageContextValue {
  role: 'assistant' | 'user'
}

const ChatMessageContext = createContext<ChatMessageContextValue | null>(null)

function useChatMessageContext() {
  const ctx = useContext(ChatMessageContext)
  if (!ctx) {
    throw new Error(
      'ChatMessage sub-components must be rendered inside <ChatMessage>'
    )
  }
  return ctx
}

/* ===========================
   ChatMessage (root)
   =========================== */

export interface ChatMessageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'role'> {
  /** Determines bubble color and layout direction */
  role: 'assistant' | 'user'
  /** When true, ChatMessageActions are hidden and only revealed on hover */
  showActionsOnHover?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** ChatMessage sub-components */
  children: ReactNode
}

export function ChatMessage({
  role,
  showActionsOnHover = false,
  className,
  children,
  ...rest
}: ChatMessageProps) {
  return (
    <ChatMessageContext.Provider value={{ role }}>
      <div
        className={cn(
          'group/message grid items-start gap-x-3 gap-y-1 max-w-full',
          role === 'user'
            ? 'grid-cols-[1fr_auto]'
            : 'grid-cols-[auto_1fr]',
          showActionsOnHover &&
            '[&_.chat-actions]:opacity-0 [&_.chat-actions]:transition-opacity [&_.chat-actions]:duration-150 [&_.chat-actions]:ease-linear hover:[&_.chat-actions]:opacity-100 [&:has(:focus-visible)_.chat-actions]:opacity-100 [&_.chat-actions]:motion-reduce:transition-none',
          className
        )}
        {...(role === 'user' ? { 'data-scroll-anchor': 'start' } : {})}
        {...rest}
      >
        {children}
      </div>
    </ChatMessageContext.Provider>
  )
}

/* ===========================
   ChatMessageAvatar
   =========================== */

export interface ChatMessageAvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Avatar content (img, SVG, initials, etc.) */
  children: ReactNode
}

export function ChatMessageAvatar({
  className,
  children,
  ...rest
}: ChatMessageAvatarProps) {
  const { role } = useChatMessageContext()
  return (
    <div
      className={cn(
        'row-span-full w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-muted text-muted-foreground text-sm',
        role === 'user' ? 'col-start-2' : 'col-start-1',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ===========================
   ChatMessageContent
   =========================== */

export interface ChatMessageContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Background style — 'filled' shows a colored bubble, 'plain' removes the background */
  variant?: 'filled' | 'plain'
  /** Additional CSS class for external overrides */
  className?: string
  /** Message body content */
  children: ReactNode
}

export function ChatMessageContent({
  variant = 'filled',
  className,
  children,
  ...rest
}: ChatMessageContentProps) {
  const { role } = useChatMessageContext()

  return (
    <div
      className={cn(
        'py-3 px-4 rounded-lg text-sm leading-relaxed max-w-[85%] min-w-0 break-words',
        role === 'user' ? 'col-start-1 justify-self-end' : 'col-start-2',
        variant === 'plain'
          ? 'bg-transparent text-foreground px-0'
          : role === 'assistant'
            ? 'bg-composure-assistant-bubble text-foreground'
            : 'bg-composure-user-bubble text-composure-user-bubble-text justify-self-end',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ===========================
   ChatMessageLoading
   =========================== */

export interface ChatMessageLoadingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
}

export function ChatMessageLoading({
  className,
  ...rest
}: ChatMessageLoadingProps) {
  return (
    <div
      className={cn(
        'col-start-2 flex items-center gap-1.5 py-3 px-4 rounded-lg bg-composure-assistant-bubble w-fit',
        className
      )}
      role="status"
      aria-label="Thinking"
      {...rest}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="thinking-dot block w-2 h-2 rounded-full bg-muted-foreground animate-[thinking-dot_1.4s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-50"
          style={{ animationDelay: `${i * 160}ms` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/* ===========================
   ChatMessageActions
   =========================== */

export interface ChatMessageActionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Action buttons (copy, regenerate, thumbs up/down, etc.) */
  children: ReactNode
}

export function ChatMessageActions({
  className,
  children,
  ...rest
}: ChatMessageActionsProps) {
  const { role } = useChatMessageContext()

  return (
    <div
      className={cn(
        'chat-actions flex gap-1 items-center pt-1',
        role === 'user' ? 'col-start-1 justify-self-end' : 'col-start-2',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
