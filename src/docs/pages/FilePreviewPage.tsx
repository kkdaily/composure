import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { FilePreview } from '../../components/FilePreview/FilePreview'
import {
  Composer,
  ComposerInput,
  ComposerHeader,
  ComposerHeaderStart,
  ComposerFooter,
  ComposerFooterEnd,
} from '../../components/Composer/Composer'
import { Button } from '@/components/ui/button'
import { CodeSnippet } from '../CodeSnippet'
import { cn } from '@/lib/utils'

/* ===========================
   Types
   =========================== */

type DemoVariant = 'compact' | 'card'
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
  const [demoVariant, setDemoVariant] = useState<DemoVariant>('compact')
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
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground tracking-tight">FilePreview</h1>
      <p className="text-lg text-secondary-foreground leading-relaxed max-w-[540px]">
        A compact preview card for file attachments that auto-detects file type
        from the extension and displays a colored icon, filename, and optional
        remove button.
      </p>
      <CodeSnippet language="bash">{`pnpm dlx shadcn@latest add https://composureui.com/r/file-preview.json`}</CodeSnippet>

      {/* Interactive demo */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Demo</h2>
        <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg items-start">
          <FilePreview
            name={demoFile.name}
            variant={demoVariant}
            size={demoSize}
            type={demoType}
            thumbnail={showThumbnail ? 'https://picsum.photos/id/10/80/80' : undefined}
            onRemove={demoRemove === 'on' ? () => {} : undefined}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Variant</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['compact', 'card'] as DemoVariant[]).map((v) => (
                <button
                  key={v}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoVariant === v
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Type</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['document', 'image', 'code', 'spreadsheet', 'generic'] as DemoType[]).map((t) => (
                <button
                  key={t}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoType === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Size</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['sm', 'md', 'lg'] as DemoSize[]).map((s) => (
                <button
                  key={s}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoSize === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Remove</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['on', 'off'] as DemoRemove[]).map((r) => (
                <button
                  key={r}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                    demoRemove === r
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={() => setDemoRemove(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {demoType === 'image' && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[80px]">Thumbnail</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['off', 'on'] as DemoThumbnail[]).map((t) => (
                  <button
                    key={t}
                    className={cn(
                      'px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors',
                      demoThumbnail === t
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent border-border text-secondary-foreground hover:bg-muted hover:text-foreground'
                    )}
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Basic Usage</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Pass a <code>name</code> and the file type icon and color are
          auto-detected from the extension, so no manual type prop is needed
          for common file formats.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
          <FilePreview name="report.pdf" />
          <FilePreview name="notes.txt" />
        </div>
        <CodeSnippet>{`<FilePreview name="report.pdf" />
<FilePreview name="notes.txt" />`}</CodeSnippet>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Variants</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>compact</code> for inline chips in tight spaces like
          composer headers or message footers. Use <code>card</code> for a
          more prominent display with a larger icon area and file type
          subtitle, matching the style used in Claude's composer.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
          <FilePreview name="report.pdf" variant="compact" />
          <FilePreview name="report.pdf" variant="card" />
        </div>
        <div className="flex items-start gap-3 flex-wrap">
          <FilePreview
            name="landscape.jpg"
            variant="compact"
            thumbnail="https://picsum.photos/id/10/80/80"
            onRemove={() => {}}
          />
          <FilePreview
            name="landscape.jpg"
            variant="card"
            thumbnail="https://picsum.photos/id/10/80/80"
            onRemove={() => {}}
          />
        </div>
        <CodeSnippet>{`{/* Compact: inline chip style */}
<FilePreview name="report.pdf" variant="compact" />

{/* Card: larger card with file type subtitle */}
<FilePreview name="report.pdf" variant="card" />

{/* Card with thumbnail */}
<FilePreview
  name="landscape.jpg"
  variant="card"
  thumbnail="/thumbs/landscape.jpg"
  onRemove={() => removeFile('landscape.jpg')}
/>`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Sizes</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          FilePreview supports <code>sm</code>, <code>md</code>, and{' '}
          <code>lg</code> sizes that match the height of the Button component
          at the same size, so they align naturally when placed side by side.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
          <FilePreview name="small.pdf" size="sm" />
          <FilePreview name="medium.pdf" size="md" />
          <FilePreview name="large.pdf" size="lg" />
        </div>
        <CodeSnippet>{`<FilePreview name="small.pdf" size="sm" />
<FilePreview name="medium.pdf" size="md" />
<FilePreview name="large.pdf" size="lg" />`}</CodeSnippet>
      </section>

      {/* File Types */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">File Types</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Each file type gets a distinct icon and background color for quick
          visual identification. Types are auto-detected from the file
          extension, or you can set the <code>type</code> prop explicitly.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Thumbnail</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          For image files, pass a <code>thumbnail</code> URL to show a visual
          preview instead of the file type icon. The thumbnail renders inside
          the same icon area with <code>object-fit: cover</code>.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
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
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">With Remove Button</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Pass an <code>onRemove</code> callback to show a remove button that
          appears on hover. Use this in the Composer to let users remove
          attached files before sending.
        </p>
        <div className="flex items-start gap-3 flex-wrap">
          <FilePreview name="draft.docx" onRemove={() => {}} />
          <FilePreview name="styles.css" onRemove={() => {}} />
        </div>
        <CodeSnippet>{`<FilePreview
  name="draft.docx"
  onRemove={() => removeFile('draft.docx')}
/>`}</CodeSnippet>
      </section>

      {/* In a Composer */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">In a Composer</h2>
        <p className="text-sm text-secondary-foreground leading-relaxed max-w-[600px]">
          Use <code>FilePreview</code> inside{' '}
          <code>ComposerHeader</code> to show attached files above the
          textarea. This is the primary use case, matching how ChatGPT and
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
              <Button variant="default" size="icon" aria-label="Send message" disabled={!composerValue.trim()}>
                <ArrowUp className="size-4" />
              </Button>
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
      <Button variant="default" size="icon" aria-label="Send">
        <SendIcon />
      </Button>
    </ComposerFooterEnd>
  </ComposerFooter>
</Composer>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Props</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Prop</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Default</th>
                <th className="text-left px-3 py-2 border-b-2 border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">name</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">string</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">File name to display</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">variant</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'compact' | 'card'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">'compact'</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Visual style. Compact is a single-row chip, card is a taller card with file type subtitle</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">size</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'sm' | 'md' | 'lg'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">'md'</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Component size. Matches Button heights at each size</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">type</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{`'image' | 'document' | 'spreadsheet' | 'code' | 'archive' | 'video' | 'audio' | 'generic'`}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">auto</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">File type for icon selection. Auto-detected from extension if omitted</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">thumbnail</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">string</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Image thumbnail URL. Replaces the type icon with a visual preview</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">onRemove</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top"><code className="font-mono text-[0.85em] bg-muted px-1.5 py-0.5 rounded-sm text-foreground">{'() => void'}</code></td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">—</td>
                <td className="px-3 py-2 border-b border-border text-secondary-foreground align-top">Called when remove button is clicked. Omit to hide the button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
