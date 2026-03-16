import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ImgHTMLAttributes,
} from 'react'
import styles from './Avatar.module.css'

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

export function Avatar({
  size = 'md',
  className,
  children,
  ...rest
}: AvatarProps) {
  const [hasImage, setHasImage] = useState(false)

  const classNames = [styles.avatar, styles[size], className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <AvatarContext.Provider value={{ size, hasImage, setHasImage }}>
      <div className={classNames} {...rest}>
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

  const classNames = [
    styles.image,
    hasImage ? '' : styles.imageHidden,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <img
      src={src}
      alt={alt}
      className={classNames}
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

export function AvatarFallback({ className, children, ...rest }: AvatarFallbackProps) {
  const { size, hasImage } = useAvatarContext()

  if (hasImage) return null

  const sizeClass =
    size === 'sm'
      ? styles.fallbackSm
      : size === 'lg'
        ? styles.fallbackLg
        : styles.fallbackMd

  const classNames = [styles.fallback, sizeClass, className ?? '']
    .filter(Boolean)
    .join(' ')

  return <span className={classNames} {...rest}>{children}</span>
}
