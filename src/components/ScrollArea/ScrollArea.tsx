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
  // Ref mirrors the mode prop so MutationObserver callbacks always read the
  // latest value instead of a stale useEffect closure.
  const modeRef = useRef(mode)
  modeRef.current = mode

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

  // Manage isUserScrollingRef exclusively via wheel/touch events.
  // These only fire from real user input, never from programmatic scrollTo.
  // - Wheel up (deltaY < 0): latch isUserScrollingRef = true
  // - Wheel down (deltaY > 0) AND at bottom: unlatch isUserScrollingRef = false
  // The scroll event handler NEVER touches isUserScrollingRef — it only syncs isAtBottom state.
  useEffect(() => {
    const el = containerRef.current
    if (!el || mode !== 'auto') return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        // User scrolling up — disable auto-scroll
        isUserScrollingRef.current = true
      } else if (e.deltaY > 0 && isUserScrollingRef.current) {
        // User scrolling down — check if they've reached the bottom
        // Use requestAnimationFrame to read layout after the wheel scroll applies
        requestAnimationFrame(() => {
          if (checkIsAtBottom()) {
            isUserScrollingRef.current = false
          }
        })
      }
    }

    const handleTouchMove = () => {
      // Any touch interaction — disable auto-scroll. The scroll-to-bottom
      // button is the primary way to resume on touch devices.
      isUserScrollingRef.current = true
    }

    el.addEventListener('wheel', handleWheel, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [mode, checkIsAtBottom])

  // Sync isAtBottom state for the scroll-to-bottom indicator
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      setIsAtBottom(checkIsAtBottom())
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [checkIsAtBottom])

  // Observe content changes — auto-scroll when appropriate, sync isAtBottom in all modes.
  // Reads modeRef.current (not the closure mode) so the callback always sees the
  // latest prop value, even if the useEffect hasn't re-run yet.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new MutationObserver(() => {
      if (modeRef.current === 'auto' && !isUserScrollingRef.current) {
        el.scrollTo({ top: el.scrollHeight })
        setIsAtBottom(true)
      } else {
        setIsAtBottom(checkIsAtBottom())
      }
    })

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [checkIsAtBottom])

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

  const classNames = [
    styles.scrollToBottom,
    isAtBottom ? styles.scrollToBottomHidden : styles.scrollToBottomVisible,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      onClick={scrollToBottom}
      aria-hidden={isAtBottom || undefined}
      {...rest}
    >
      {children}
    </div>
  )
}
