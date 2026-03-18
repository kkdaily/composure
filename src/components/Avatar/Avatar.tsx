import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ImgHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

/* ===========================
   Context
   =========================== */

interface AvatarContextValue {
  size: 'sm' | 'md' | 'lg'
  hasImage: boolean
  setHasImage: (value: boolean) => void
}

const AvatarContext = createContext<AvatarContextValue | null>(null)

function useAvatarContext() {
  const ctx = useContext(AvatarContext)
  if (!ctx) {
    throw new Error(
      'Avatar sub-components must be rendered inside <Avatar>'
    )
  }
  return ctx
}

/* ===========================
   Avatar (root)
   =========================== */

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS class for external overrides */
  className?: string
  /** AvatarImage and/or AvatarFallback */
  children: ReactNode
}

const sizeClasses = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-12',
} as const

export function Avatar({
  size = 'md',
  className,
  children,
  ...rest
}: AvatarProps) {
  const [hasImage, setHasImage] = useState(false)

  return (
    <AvatarContext.Provider value={{ size, hasImage, setHasImage }}>
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-muted text-muted-foreground motion-reduce:transition-none',
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </AvatarContext.Provider>
  )
}

/* ===========================
   AvatarImage
   =========================== */

export interface AvatarImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'className' | 'src' | 'alt'> {
  /** Image source URL */
  src: string
  /** Alt text for the image */
  alt: string
  /** Additional CSS class for external overrides */
  className?: string
}

export function AvatarImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  ...rest
}: AvatarImageProps) {
  const { hasImage, setHasImage } = useAvatarContext()

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'size-full object-cover',
        !hasImage && 'absolute size-0 opacity-0',
        className
      )}
      onLoad={(e) => {
        setHasImage(true)
        onLoad?.(e)
      }}
      onError={(e) => {
        setHasImage(false)
        onError?.(e)
      }}
      {...rest}
    />
  )
}

/* ===========================
   AvatarFallback
   =========================== */

export interface AvatarFallbackProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  /** Additional CSS class for external overrides */
  className?: string
  /** Fallback content — initials, icon, etc. */
  children: ReactNode
}

const fallbackSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const

export function AvatarFallback({ className, children, ...rest }: AvatarFallbackProps) {
  const { size, hasImage } = useAvatarContext()

  if (hasImage) return null

  return (
    <span
      className={cn(
        'flex items-center justify-center size-full font-medium leading-none select-none',
        fallbackSizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
