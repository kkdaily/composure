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
  /** Disable smart auto-scrolling entirely — ScrollArea becomes a plain overflow container */
  smartScroll?: boolean
  /** Additional CSS class for external overrides */
  className?: string
  /** Content and optional ScrollAreaScrollToBottom */
  children: ReactNode
}

export function ScrollArea({
  mode = 'auto',
  bottomThreshold = 64,
  smartScroll = true,
  className,
  children,
  ...rest
}: ScrollAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const isUserScrollingRef = useRef(false)
  const autoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const lerpFrameRef = useRef<number>()
  // Ref mirrors the mode prop so MutationObserver callbacks always read the
  // latest value instead of a stale useEffect closure.
  const modeRef = useRef(mode)
  modeRef.current = mode
  const smartScrollRef = useRef(smartScroll)
  smartScrollRef.current = smartScroll

  const checkIsAtBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight <= bottomThreshold
  }, [bottomThreshold])

  // Lerp-based smooth scroll — glides toward target at 60fps instead of
  // using browser `behavior: 'smooth'` which stutters when called rapidly
  // during streaming. The easing factor (0.15) controls how quickly it
  // catches up: each frame moves 15% of the remaining distance.
  const lerpToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return

    // Respect prefers-reduced-motion — snap instantly instead of animating
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.scrollTop = el.scrollHeight - el.clientHeight
      setIsAtBottom(true)
      return
    }

    setIsAutoScrolling(true)

    const tick = () => {
      if (!el || isUserScrollingRef.current) {
        // User took over — stop the lerp immediately
        setIsAutoScrolling(false)
        return
      }
      const target = el.scrollHeight - el.clientHeight
      const distance = target - el.scrollTop

      if (distance <= 0.5) {
        // Close enough — snap and stop
        el.scrollTop = target
        setIsAutoScrolling(false)
        return
      }

      el.scrollTop += distance * 0.15
      lerpFrameRef.current = requestAnimationFrame(tick)
    }

    // Cancel any running lerp before starting a new one
    if (lerpFrameRef.current) cancelAnimationFrame(lerpFrameRef.current)
    lerpFrameRef.current = requestAnimationFrame(tick)
  }, [])

  const hideScrollbarDuring = useCallback((scrollFn: () => void) => {
    const el = containerRef.current
    if (!el) return
    setIsAutoScrolling(true)
    clearTimeout(autoScrollTimeoutRef.current)
    scrollFn()
    // Keep scrollbar hidden until scroll settles
    const onScrollEnd = () => {
      autoScrollTimeoutRef.current = setTimeout(() => {
        setIsAutoScrolling(false)
        el.removeEventListener('scrollend', onScrollEnd)
      }, 50)
    }
    el.addEventListener('scrollend', onScrollEnd, { once: true })
    // Fallback in case scrollend doesn't fire (e.g. already at target)
    autoScrollTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(false)
      el.removeEventListener('scrollend', onScrollEnd)
    }, 500)
  }, [])

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    hideScrollbarDuring(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    })
    isUserScrollingRef.current = false
    setIsAtBottom(true)
  }, [hideScrollbarDuring])

  // Reset user-scrolling state when mode changes
  useEffect(() => {
    isUserScrollingRef.current = false
  }, [mode])

  // Clean up timeout and animation frame on unmount
  useEffect(() => {
    return () => {
      clearTimeout(autoScrollTimeoutRef.current)
      if (lerpFrameRef.current) cancelAnimationFrame(lerpFrameRef.current)
    }
  }, [])

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

    const observer = new MutationObserver((mutations) => {
      if (!smartScrollRef.current) {
        setIsAtBottom(checkIsAtBottom())
        return
      }

      if (modeRef.current === 'auto' && !isUserScrollingRef.current) {
        // Auto mode: lerp smoothly toward bottom at 60fps
        lerpToBottom()
        setIsAtBottom(true)
      } else if (modeRef.current === 'manual') {
        // Only scroll when there's a net new child added to the scroll
        // container (or its first child wrapper). If nodes were both added
        // and removed across the mutation batch (e.g. streaming content
        // finalizing into a permanent message), treat it as a replacement.
        // React may split adds and removes into separate mutation records
        // even when they're part of the same state update.
        let addedCount = 0
        let removedCount = 0
        let hasNewElement = false

        for (const mutation of mutations) {
          if (mutation.type !== 'childList') continue
          // Only count additions/removals on the scroll container or its first child
          if (mutation.target !== el && mutation.target.parentElement !== el) continue
          addedCount += mutation.addedNodes.length
          removedCount += mutation.removedNodes.length
          if (!hasNewElement) {
            for (const node of mutation.addedNodes) {
              if (node instanceof HTMLElement) {
                hasNewElement = true
                break
              }
            }
          }
        }

        // Only scroll if there are net new elements (not replacements)
        if (hasNewElement && addedCount > removedCount) {
          hideScrollbarDuring(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
          })
          return
        }
        setIsAtBottom(checkIsAtBottom())
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
  }, [checkIsAtBottom, hideScrollbarDuring])

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
          aria-live="polite"
          aria-relevant="additions"
          className={cn(
            'h-full overflow-y-auto overflow-x-hidden [overflow-anchor:none]',
            isAutoScrolling && '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
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
