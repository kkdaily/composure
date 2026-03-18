import { type HTMLAttributes, type JSX } from 'react'
import { cn } from '@/lib/utils'

/* ===========================
   File type detection
   =========================== */

export type FileType =
  | 'image'
  | 'document'
  | 'spreadsheet'
  | 'code'
  | 'archive'
  | 'video'
  | 'audio'
  | 'generic'

const extensionMap: Record<string, FileType> = {
  // Image
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
  webp: 'image', svg: 'image', bmp: 'image', ico: 'image',
  // Document
  pdf: 'document', doc: 'document', docx: 'document',
  txt: 'document', md: 'document', rtf: 'document',
  // Spreadsheet
  csv: 'spreadsheet', xlsx: 'spreadsheet', xls: 'spreadsheet',
  tsv: 'spreadsheet',
  // Code
  ts: 'code', tsx: 'code', js: 'code', jsx: 'code',
  py: 'code', rb: 'code', rs: 'code', go: 'code',
  java: 'code', c: 'code', cpp: 'code', h: 'code',
  css: 'code', html: 'code', json: 'code', yaml: 'code',
  yml: 'code', xml: 'code', sh: 'code', sql: 'code',
  // Archive
  zip: 'archive', tar: 'archive', gz: 'archive', rar: 'archive',
  '7z': 'archive', bz2: 'archive',
  // Video
  mp4: 'video', mov: 'video', webm: 'video', avi: 'video',
  mkv: 'video',
  // Audio
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio',
  aac: 'audio', m4a: 'audio',
}

function detectFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return 'generic'
  return extensionMap[ext] ?? 'generic'
}

/* ===========================
   Icons
   =========================== */

function ImageIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <circle cx="5.5" cy="5.5" r="1" />
      <path d="M14 10.5l-3-3-7 7" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5z" />
      <path d="M9 1v4h4" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" />
      <line x1="5.5" y1="10.5" x2="10.5" y2="10.5" />
    </svg>
  )
}

function SpreadsheetIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <line x1="2" y1="6" x2="14" y2="6" />
      <line x1="2" y1="10" x2="14" y2="10" />
      <line x1="6" y1="2" x2="6" y2="14" />
      <line x1="10" y1="2" x2="10" y2="14" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="5.5 4.5 2 8 5.5 11.5" />
      <polyline points="10.5 4.5 14 8 10.5 11.5" />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="12" height="3" rx="1" />
      <path d="M3 5v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5" />
      <line x1="6.5" y1="9" x2="9.5" y2="9" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="3" width="10" height="10" rx="1.5" />
      <polygon points="14.5 5.5 11.5 8 14.5 10.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function AudioIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3v10l-3-3H1.5V6H3z" />
      <path d="M10 5.5a3.5 3.5 0 0 1 0 5" />
      <path d="M12 3.5a6.5 6.5 0 0 1 0 9" />
    </svg>
  )
}

function GenericFileIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5z" />
      <path d="M9 1v4h4" />
    </svg>
  )
}

const iconsByType: Record<FileType, () => JSX.Element> = {
  image: ImageIcon,
  document: DocumentIcon,
  spreadsheet: SpreadsheetIcon,
  code: CodeIcon,
  archive: ArchiveIcon,
  video: VideoIcon,
  audio: AudioIcon,
  generic: GenericFileIcon,
}

/* ===========================
   Remove button icon
   =========================== */

function CloseIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </svg>
  )
}

/* ===========================
   File type color classes
   =========================== */

const fileTypeClasses: Record<FileType, string> = {
  image: 'bg-filetype-image-bg text-filetype-image-fg',
  document: 'bg-filetype-document-bg text-filetype-document-fg',
  spreadsheet: 'bg-filetype-spreadsheet-bg text-filetype-spreadsheet-fg',
  code: 'bg-filetype-code-bg text-filetype-code-fg',
  archive: 'bg-filetype-archive-bg text-filetype-archive-fg',
  video: 'bg-filetype-video-bg text-filetype-video-fg',
  audio: 'bg-filetype-audio-bg text-filetype-audio-fg',
  generic: 'bg-muted text-muted-foreground',
}

/* ===========================
   Size classes
   =========================== */

const sizeClasses = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-11',
} as const

const iconAreaSizeClasses = {
  sm: 'w-5 h-5 text-xs',
  md: 'w-7 h-7 text-base',
  lg: 'w-9 h-9 text-lg',
} as const

/* ===========================
   FilePreview
   =========================== */

export interface FilePreviewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** File name to display */
  name: string
  /** Size of the component — matches Button heights */
  size?: 'sm' | 'md' | 'lg'
  /** File type for icon selection — auto-detected from extension if omitted */
  type?: FileType
  /** Image thumbnail URL — shown as visual preview for image files */
  thumbnail?: string
  /** Called when remove button is clicked — omit to hide the remove button */
  onRemove?: () => void
  /** Additional CSS class for external overrides */
  className?: string
}

export function FilePreview({
  name,
  size = 'md',
  type,
  thumbnail,
  onRemove,
  className,
  ...rest
}: FilePreviewProps) {
  const resolvedType = type ?? detectFileType(name)
  const Icon = iconsByType[resolvedType]

  return (
    <div
      className={cn(
        'group/file relative inline-flex items-center gap-2 pl-1 pr-3 bg-card border border-border rounded-md max-w-[220px] cursor-default transition-colors duration-100 ease-out hover:bg-muted motion-reduce:transition-none',
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          'flex items-center justify-center shrink-0 rounded-sm overflow-hidden',
          iconAreaSizeClasses[size],
          fileTypeClasses[resolvedType]
        )}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon />
        )}
      </div>
      <span
        className={cn(
          'text-xs font-medium text-foreground leading-tight whitespace-nowrap overflow-hidden text-ellipsis min-w-0',
          size === 'lg' && 'text-sm'
        )}
      >
        {name}
      </span>
      {onRemove && (
        <button
          type="button"
          className="absolute -top-1 -right-1 flex items-center justify-center w-[18px] h-[18px] p-0 border border-border rounded-full bg-card text-muted-foreground text-[10px] cursor-pointer opacity-0 transition-all duration-100 ease-out group-hover/file:opacity-100 hover:text-foreground hover:bg-muted focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 motion-reduce:transition-none"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
