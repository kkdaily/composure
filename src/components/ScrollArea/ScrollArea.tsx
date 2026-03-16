import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import styles from './ScrollArea.module.css'

/* ===========================
   Context
   =========================== */

interface ScrollAreaContextValue {
  isAtBottom: boolean
  scrollToBottom: () => void
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null)

function useScrollAreaContext() {
  const ctx = useContext(ScrollAreaContext)
  if (!ctx) {
    throw new Error(
      'ScrollArea sub-components must be rendered inside <ScrollArea>'
    )
  }
  return ctx
}

/* ===========================
   ScrollArea (root)
   =========================== */

export interface ScrollAreaProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Scroll behavior mode */
  mode?: 'auto' | 'manual'
  /** Pixel distance from the bottom to still count as "at bottom" */
  bottomThreshold?: number
  /** Additional CSS class for external overrides */
  className?: string
  /** Content and optional ScrollAreaScrollToBottom */
  children: ReactNode
}

export function ScrollArea({
  mode = 'auto',
  bottomThreshold = 64,
  className,
  children,
  ...rest
}: ScrollAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const isUserScrollingRef = useRef(false)
  const lastScrollTopRef = useRef(0)

  const checkIsAtBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight <= bottomThreshold
  }, [bottomThreshold])

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    isUserScrollingRef.current = false
    setIsAtBottom(true)
  }, [])

  // Reset user-scrolling state when mode changes
  useEffect(() => {
    isUserScrollingRef.current = false
  }, [mode])

  // Handle scroll events to detect user scroll-up
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const currentScrollTop = el.scrollTop
      const atBottom = checkIsAtBottom()

      // Only track user-scroll-up when in auto mode
      if (mode === 'auto') {
        if (currentScrollTop < lastScrollTopRef.current && !atBottom) {
          isUserScrollingRef.current = true
        }

        if (atBottom) {
          isUserScrollingRef.current = false
        }
      }

      setIsAtBottom(atBottom)
      lastScrollTopRef.current = currentScrollTop
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [checkIsAtBottom, mode])

  // Observe content changes — auto-scroll when appropriate, sync isAtBottom in all modes
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new MutationObserver(() => {
      if (mode === 'auto' && !isUserScrollingRef.current) {
        // Auto-scroll to bottom
        el.scrollTo({ top: el.scrollHeight })
        setIsAtBottom(true)
      } else {
        // Not auto-scrolling — sync isAtBottom so the indicator can appear
        setIsAtBottom(checkIsAtBottom())
      }
    })

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [mode, checkIsAtBottom])

  const classNames = [styles.scrollArea, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <ScrollAreaContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div className={classNames} ref={containerRef} {...rest}>
        {children}
      </div>
    </ScrollAreaContext.Provider>
  )
}

/* ===========================
   ScrollAreaScrollToBottom
   =========================== */

export interface ScrollAreaScrollToBottomProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** The scroll-to-bottom trigger — typically an IconButton */
  children: ReactNode
}

export function ScrollAreaScrollToBottom({
  className,
  children,
  ...rest
}: ScrollAreaScrollToBottomProps) {
  const { isAtBottom, scrollToBottom } = useScrollAreaContext()

  if (isAtBottom) return null

  const classNames = [styles.scrollToBottom, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      onClick={scrollToBottom}
      {...rest}
    >
      {children}
    </div>
  )
}
