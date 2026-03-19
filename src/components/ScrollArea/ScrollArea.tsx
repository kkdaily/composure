import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

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

  // Separate ScrollAreaScrollToBottom from scrollable content so it can be
  // positioned absolutely on the outer wrapper, outside the overflow container.
  const scrollContent: ReactNode[] = []
  const overlayContent: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ScrollAreaScrollToBottom) {
      overlayContent.push(child)
    } else {
      scrollContent.push(child)
    }
  })

  return (
    <ScrollAreaContext.Provider value={{ isAtBottom, scrollToBottom }}>
      <div
        className={cn('relative', className)}
        {...rest}
      >
        <div
          className="h-full overflow-y-auto overflow-x-hidden [overflow-anchor:none]"
          ref={containerRef}
        >
          {scrollContent}
        </div>
        {overlayContent}
      </div>
    </ScrollAreaContext.Provider>
  )
}

/* ===========================
   ScrollAreaScrollToBottom
   =========================== */

export interface ScrollAreaScrollToBottomProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Required accessible label for the scroll-to-bottom button */
  label: string
  /** Additional CSS class for external overrides */
  className?: string
  /** The scroll-to-bottom trigger — typically an icon */
  children: ReactNode
}

export function ScrollAreaScrollToBottom({
  label,
  className,
  children,
  ...rest
}: ScrollAreaScrollToBottomProps) {
  const { isAtBottom, scrollToBottom } = useScrollAreaContext()

  return (
    <div
      className={cn(
        'absolute bottom-3 left-0 right-0 z-10 flex justify-center pointer-events-none transition-opacity duration-200 ease-out motion-reduce:transition-none',
        isAtBottom
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100 [&>*]:pointer-events-auto',
        className
      )}
      aria-hidden={isAtBottom || undefined}
      {...rest}
    >
      <button
        className="flex items-center justify-center w-9 h-9 border border-border rounded-full bg-card text-foreground cursor-pointer transition-colors duration-100 ease-out hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 motion-reduce:transition-none"
        onClick={scrollToBottom}
        aria-label={label}
        tabIndex={isAtBottom ? -1 : 0}
      >
        {children}
      </button>
    </div>
  )
}
