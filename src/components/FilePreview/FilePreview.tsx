import { type HTMLAttributes } from 'react'
import {
  Image, FileText, Table, Code, Archive, Video, Music, File, X,
} from 'lucide-react'
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

const iconsByType: Record<FileType, typeof Image> = {
  image: Image,
  document: FileText,
  spreadsheet: Table,
  code: Code,
  archive: Archive,
  video: Video,
  audio: Music,
  generic: File,
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
          <Icon className="size-[1em]" />
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
          <X className="size-[1em]" />
        </button>
      )}
    </div>
  )
}
