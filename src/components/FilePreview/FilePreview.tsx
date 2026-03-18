import { type HTMLAttributes } from 'react'
import styles from './FilePreview.module.css'

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
   FilePreview
   =========================== */

export interface FilePreviewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** File name to display */
  name: string
  /** File size string (e.g. "2.4 MB") */
  size?: string
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
  size,
  type,
  thumbnail,
  onRemove,
  className,
  ...rest
}: FilePreviewProps) {
  const resolvedType = type ?? detectFileType(name)
  const Icon = iconsByType[resolvedType]

  const classNames = [styles.filePreview, className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classNames} {...rest}>
      <div className={`${styles.iconArea} ${styles[`icon-${resolvedType}`]}`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className={styles.thumbnail}
          />
        ) : (
          <Icon />
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        {size && <span className={styles.size}>{size}</span>}
      </div>
      {onRemove && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
