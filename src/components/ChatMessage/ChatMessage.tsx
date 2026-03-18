import {
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import styles from './ChatMessage.module.css'

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
  const classNames = [
    styles.chatMessage,
    role === 'user' ? styles.user : '',
    showActionsOnHover ? styles.actionsOnHover : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ChatMessageContext.Provider value={{ role }}>
      <div className={classNames} {...rest}>
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
  useChatMessageContext() // validate we're inside ChatMessage
  const classNames = [styles.avatar, className ?? ''].filter(Boolean).join(' ')
  return <div className={classNames} {...rest}>{children}</div>
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

  const variantClass =
    variant === 'plain'
      ? styles.contentPlain
      : role === 'assistant'
        ? styles.contentAssistant
        : styles.contentUser

  const classNames = [styles.content, variantClass, className ?? '']
    .filter(Boolean)
    .join(' ')

  return <div className={classNames} {...rest}>{children}</div>
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
  useChatMessageContext() // validate we're inside ChatMessage
  const classNames = [styles.actions, className ?? '']
    .filter(Boolean)
    .join(' ')

  return <div className={classNames} {...rest}>{children}</div>
}
