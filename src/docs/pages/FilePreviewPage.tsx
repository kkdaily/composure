import { useState } from 'react'
import { FilePreview } from '../../components/FilePreview/FilePreview'
import {
  Composer,
  ComposerInput,
  ComposerHeader,
  ComposerHeaderStart,
  ComposerFooter,
  ComposerFooterEnd,
} from '../../components/Composer/Composer'
import { IconButton } from '../../components/IconButton/IconButton'
import { CodeSnippet } from '../CodeSnippet'
import styles from './FilePreviewPage.module.css'

/* ===========================
   Icons
   =========================== */

const SendIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9M14 2l-4 12-3-7-7-3z" />
  </svg>
)

/* ===========================
   Types
   =========================== */

type DemoType = 'image' | 'document' | 'code' | 'spreadsheet' | 'generic'
type DemoSize = 'sm' | 'md' | 'lg'
type DemoRemove = 'on' | 'off'
type DemoThumbnail = 'on' | 'off'

const demoFilesByType: Record<DemoType, { name: string }> = {
  image: { name: 'screenshot.png' },
  document: { name: 'report.pdf' },
  code: { name: 'index.tsx' },
  spreadsheet: { name: 'data.csv' },
  generic: { name: 'backup.dat' },
}

/* ===========================
   Page
   =========================== */

export function FilePreviewPage() {
  const [demoType, setDemoType] = useState<DemoType>('document')
  const [demoSize, setDemoSize] = useState<DemoSize>('md')
  const [demoRemove, setDemoRemove] = useState<DemoRemove>('on')
  const [demoThumbnail, setDemoThumbnail] = useState<DemoThumbnail>('off')

  const demoFile = demoFilesByType[demoType]
  const showThumbnail = demoThumbnail === 'on' && demoType === 'image'

  // Composer demo state
  const [composerValue, setComposerValue] = useState('')
  const [composerFiles, setComposerFiles] = useState([
    { name: 'quarterly-report.pdf' },
    { name: 'chart.png' },
    { name: 'raw-data.csv' },
  ])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>FilePreview</h1>
      <p className={styles.subtitle}>
        A compact preview card for file attachments — auto-detects file type
        from extension and displays a colored icon, filename, and optional
        remove button.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <FilePreview
            name={demoFile.name}
            size={demoSize}
            type={demoType}
            thumbnail={showThumbnail ? 'https://picsum.photos/id/10/80/80' : undefined}
            onRemove={demoRemove === 'on' ? () => {} : undefined}
          />
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Type</span>
            <div className={styles.controlOptions}>
              {(['document', 'image', 'code', 'spreadsheet', 'generic'] as DemoType[]).map((t) => (
                <button
                  key={t}
                  className={`${styles.chip} ${demoType === t ? styles.chipActive : ''}`}
                  onClick={() => setDemoType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Size</span>
            <div className={styles.controlOptions}>
              {(['sm', 'md', 'lg'] as DemoSize[]).map((s) => (
                <button
                  key={s}
                  className={`${styles.chip} ${demoSize === s ? styles.chipActive : ''}`}
                  onClick={() => setDemoSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Remove</span>
            <div className={styles.controlOptions}>
              {(['on', 'off'] as DemoRemove[]).map((r) => (
                <button
                  key={r}
                  className={`${styles.chip} ${demoRemove === r ? styles.chipActive : ''}`}
                  onClick={() => setDemoRemove(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {demoType === 'image' && (
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Thumbnail</span>
              <div className={styles.controlOptions}>
                {(['off', 'on'] as DemoThumbnail[]).map((t) => (
                  <button
                    key={t}
                    className={`${styles.chip} ${demoThumbnail === t ? styles.chipActive : ''}`}
                    onClick={() => setDemoThumbnail(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Basic Usage</h2>
        <p className={styles.sectionDescription}>
          Pass a <code>name</code> and the file type icon and color are
          auto-detected from the file extension — no manual type prop needed
          for common file formats.
        </p>
        <div className={styles.previewRow}>
          <FilePreview name="report.pdf" />
          <FilePreview name="notes.txt" />
        </div>
        <CodeSnippet>{`<FilePreview name="report.pdf" />
<FilePreview name="notes.txt" />`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Sizes</h2>
        <p className={styles.sectionDescription}>
          FilePreview supports <code>sm</code>, <code>md</code>, and{' '}
          <code>lg</code> sizes that match the height of the Button component
          at the same size — so they align naturally when placed side by side.
        </p>
        <div className={styles.previewRow}>
          <FilePreview name="small.pdf" size="sm" />
          <FilePreview name="medium.pdf" size="md" />
          <FilePreview name="large.pdf" size="lg" />
        </div>
        <CodeSnippet>{`<FilePreview name="small.pdf" size="sm" />
<FilePreview name="medium.pdf" size="md" />
<FilePreview name="large.pdf" size="lg" />`}</CodeSnippet>
      </section>

      {/* File Types */}
      <section className={styles.section}>
        <h2 className={styles.heading}>File Types</h2>
        <p className={styles.sectionDescription}>
          Each file type gets a distinct icon and background color for quick
          visual identification. Types are auto-detected from the file
          extension, or you can set the <code>type</code> prop explicitly.
        </p>
        <div className={styles.previewRow}>
          <FilePreview name="photo.png" />
          <FilePreview name="report.pdf" />
          <FilePreview name="data.csv" />
          <FilePreview name="index.tsx" />
          <FilePreview name="bundle.zip" />
          <FilePreview name="clip.mp4" />
          <FilePreview name="track.mp3" />
          <FilePreview name="backup.dat" />
        </div>
        <CodeSnippet>{`<FilePreview name="photo.png" />
<FilePreview name="report.pdf" />
<FilePreview name="data.csv" />
<FilePreview name="index.tsx" />
<FilePreview name="bundle.zip" />
<FilePreview name="clip.mp4" />
<FilePreview name="track.mp3" />
<FilePreview name="backup.dat" />`}</CodeSnippet>
      </section>

      {/* With Thumbnail */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Thumbnail</h2>
        <p className={styles.sectionDescription}>
          For image files, pass a <code>thumbnail</code> URL to show a visual
          preview instead of the file type icon. The thumbnail renders inside
          the same icon area with <code>object-fit: cover</code>.
        </p>
        <div className={styles.previewRow}>
          <FilePreview
            name="landscape.jpg"
            thumbnail="https://picsum.photos/id/10/80/80"
          />
          <FilePreview
            name="portrait.png"
            thumbnail="https://picsum.photos/id/64/80/80"
          />
        </div>
        <CodeSnippet>{`<FilePreview
  name="landscape.jpg"
  thumbnail="/thumbnails/landscape-thumb.jpg"
/>`}</CodeSnippet>
      </section>

      {/* With Remove Button */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Remove Button</h2>
        <p className={styles.sectionDescription}>
          Pass an <code>onRemove</code> callback to show a remove button that
          appears on hover. Use this in the Composer to let users remove
          attached files before sending.
        </p>
        <div className={styles.previewRow}>
          <FilePreview name="draft.docx" onRemove={() => {}} />
          <FilePreview name="styles.css" onRemove={() => {}} />
        </div>
        <CodeSnippet>{`<FilePreview
  name="draft.docx"
  onRemove={() => removeFile('draft.docx')}
/>`}</CodeSnippet>
      </section>

      {/* In a Composer */}
      <section className={styles.section}>
        <h2 className={styles.heading}>In a Composer</h2>
        <p className={styles.sectionDescription}>
          Use <code>FilePreview</code> inside{' '}
          <code>ComposerHeader</code> to show attached files above the
          textarea. This is the primary use case — matching how ChatGPT and
          Claude display file attachments in their composers.
        </p>
        <Composer
          value={composerValue}
          onChange={setComposerValue}
          onSubmit={() => setComposerValue('')}
        >
          {composerFiles.length > 0 && (
            <ComposerHeader>
              <ComposerHeaderStart>
                {composerFiles.map((file) => (
                  <FilePreview
                    key={file.name}
                    name={file.name}
                    onRemove={() =>
                      setComposerFiles((prev) =>
                        prev.filter((f) => f.name !== file.name)
                      )
                    }
                  />
                ))}
              </ComposerHeaderStart>
            </ComposerHeader>
          )}
          <ComposerInput placeholder="Ask about these files…" />
          <ComposerFooter bordered={false}>
            <ComposerFooterEnd>
              <IconButton variant="primary" label="Send message" disabled={!composerValue.trim()}>
                <SendIcon />
              </IconButton>
            </ComposerFooterEnd>
          </ComposerFooter>
        </Composer>
        <CodeSnippet>{`<Composer value={value} onChange={setValue} onSubmit={handleSend}>
  <ComposerHeader>
    <ComposerHeaderStart>
      {files.map((file) => (
        <FilePreview
          key={file.name}
          name={file.name}
          onRemove={() => removeFile(file.name)}
        />
      ))}
    </ComposerHeaderStart>
  </ComposerHeader>
  <ComposerInput placeholder="Ask about these files…" />
  <ComposerFooter bordered={false}>
    <ComposerFooterEnd>
      <IconButton variant="primary" label="Send">
        <SendIcon />
      </IconButton>
    </ComposerFooterEnd>
  </ComposerFooter>
</Composer>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>name</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>File name to display</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><code>{`'sm' | 'md' | 'lg'`}</code></td>
                <td><code>'md'</code></td>
                <td>Component size — matches Button heights at each size</td>
              </tr>
              <tr>
                <td><code>type</code></td>
                <td><code>{`'image' | 'document' | 'spreadsheet' | 'code' | 'archive' | 'video' | 'audio' | 'generic'`}</code></td>
                <td>auto</td>
                <td>File type for icon selection — auto-detected from extension if omitted</td>
              </tr>
              <tr>
                <td><code>thumbnail</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Image thumbnail URL — replaces the type icon with a visual preview</td>
              </tr>
              <tr>
                <td><code>onRemove</code></td>
                <td><code>{'() => void'}</code></td>
                <td>—</td>
                <td>Called when remove button is clicked — omit to hide the button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
