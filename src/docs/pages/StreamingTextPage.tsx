import { useState, useEffect, useCallback, useRef } from 'react'
import { StreamingText } from '../../components/StreamingText/StreamingText'
import { CodeSnippet } from '../CodeSnippet'
import styles from './StreamingTextPage.module.css'

/* ===========================
   Types
   =========================== */

type DemoEffect = 'fade' | 'none'

/* ===========================
   Demo helpers
   =========================== */

const sampleText =
  "React Server Components let you render components on the server, reducing the JavaScript bundle sent to the client. They're ideal for data-heavy pages where interactivity isn't needed."

/* ===========================
   Page
   =========================== */

export function StreamingTextPage() {
  const [demoEffect, setDemoEffect] = useState<DemoEffect>('fade')

  // Simulated streaming for the demo — reveals text character by character
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startStreaming = useCallback(() => {
    setStreamedText('')
    setIsStreaming(true)
    let index = 0
    intervalRef.current = setInterval(() => {
      index++
      if (index >= sampleText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsStreaming(false)
        setStreamedText(sampleText)
      } else {
        setStreamedText(sampleText.slice(0, index))
      }
    }, 30)
  }, [])

  const resetDemo = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setStreamedText('')
    setIsStreaming(false)
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>StreamingText</h1>
      <p className={styles.subtitle}>
        Renders text with per-character fade-in animation — designed for AI
        streaming responses where tokens arrive incrementally.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <div className={styles.demoOutput}>
            {streamedText ? (
              <StreamingText effect={demoEffect}>
                {streamedText}
              </StreamingText>
            ) : (
              <span className={styles.emptyState}>
                Press "Stream" to start the demo…
              </span>
            )}
          </div>
          <div className={styles.demoButtons}>
            <button
              className={styles.demoButton}
              onClick={startStreaming}
              disabled={isStreaming}
            >
              Stream
            </button>
            <button
              className={styles.demoButton}
              onClick={resetDemo}
              disabled={!streamedText && !isStreaming}
            >
              Reset
            </button>
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Effect</span>
            <div className={styles.controlOptions}>
              {(['fade', 'none'] as DemoEffect[]).map((e) => (
                <button
                  key={e}
                  className={`${styles.chip} ${demoEffect === e ? styles.chipActive : ''}`}
                  onClick={() => setDemoEffect(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Basic Usage</h2>
        <p className={styles.sectionDescription}>
          Wrap any string in <code>StreamingText</code> to get per-character
          fade-in. Useful inside <code>ChatMessageContent</code> for AI
          responses that stream in token-by-token.
        </p>
        <div className={styles.exampleArea}>
          <StreamingText>
            Here's a quick overview of the key concepts.
          </StreamingText>
        </div>
        <CodeSnippet>{`<StreamingText>
  Here's a quick overview of the key concepts.
</StreamingText>`}</CodeSnippet>
      </section>

      {/* Effect */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Effect</h2>
        <p className={styles.sectionDescription}>
          The <code>effect</code> prop controls how newly revealed characters
          appear. Use <code>"fade"</code> for a smooth per-character fade-in, or{' '}
          <code>"none"</code> to render text instantly — useful when the stream
          has finished and the text should display without animation.
        </p>
        <div className={styles.exampleArea}>
          <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>fade</span>
            <StreamingText effect="fade">
              Characters fade in one by one.
            </StreamingText>
          </div>
          <div className={styles.exampleRow}>
            <span className={styles.exampleLabel}>none</span>
            <StreamingText effect="none">
              Text appears instantly without animation.
            </StreamingText>
          </div>
        </div>
        <CodeSnippet>{`<StreamingText effect="fade">
  Characters fade in one by one.
</StreamingText>

<StreamingText effect="none">
  Text appears instantly without animation.
</StreamingText>`}</CodeSnippet>
      </section>

      {/* With ChatMessage */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With ChatMessage</h2>
        <p className={styles.sectionDescription}>
          Combine <code>StreamingText</code> with <code>ChatMessage</code> for
          a complete streaming conversation experience. Switch to{' '}
          <code>effect="none"</code> once the response finishes so the full
          text renders without animation on re-render.
        </p>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <SparkleIcon />
  </ChatMessageAvatar>
  <ChatMessageContent>
    <StreamingText effect={isStreaming ? 'fade' : 'none'}>
      {responseText}
    </StreamingText>
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>StreamingText</h3>
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
                <td><code>effect</code></td>
                <td><code>{`'fade' | 'none'`}</code></td>
                <td><code>'fade'</code></td>
                <td>Visual effect applied to newly revealed characters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
