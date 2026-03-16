import { useState } from 'react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '../../components/Avatar/Avatar'
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
} from '../../components/ChatMessage/ChatMessage'
import { CodeSnippet } from '../CodeSnippet'
import styles from './AvatarPage.module.css'

/* ===========================
   Icons
   =========================== */

const SparkleIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
  </svg>
)

const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-2.8 2.7-5 6-5s6 2.2 6 5" />
  </svg>
)

const BotIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="10" height="8" rx="2" />
    <circle cx="6" cy="9" r="1" fill="currentColor" />
    <circle cx="10" cy="9" r="1" fill="currentColor" />
    <path d="M8 1v4" />
  </svg>
)

/* ===========================
   Types
   =========================== */

type DemoSize = 'sm' | 'md' | 'lg'
type DemoContent = 'icon' | 'initials' | 'image'

/* ===========================
   Page
   =========================== */

export function AvatarPage() {
  const [demoSize, setDemoSize] = useState<DemoSize>('md')
  const [demoContent, setDemoContent] = useState<DemoContent>('icon')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Avatar</h1>
      <p className={styles.subtitle}>
        A composable avatar for displaying user or assistant identity — supports
        images with automatic fallback to initials or icons.
      </p>

      {/* Interactive demo */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Demo</h2>
        <div className={styles.demoArea}>
          <Avatar size={demoSize}>
            {demoContent === 'image' && (
              <AvatarImage
                src="https://api.dicebear.com/9.x/notionists/svg?seed=composure"
                alt="Demo user"
              />
            )}
            <AvatarFallback>
              {demoContent === 'initials' ? 'KD' : <SparkleIcon />}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className={styles.controls}>
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
            <span className={styles.controlLabel}>Content</span>
            <div className={styles.controlOptions}>
              {(['icon', 'initials', 'image'] as DemoContent[]).map((c) => (
                <button
                  key={c}
                  className={`${styles.chip} ${demoContent === c ? styles.chipActive : ''}`}
                  onClick={() => setDemoContent(c)}
                >
                  {c}
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
          The simplest configuration — an <code>Avatar</code> with an{' '}
          <code>AvatarFallback</code> containing an icon. Ideal for AI assistant
          avatars in chat interfaces.
        </p>
        <div className={styles.avatarRow}>
          <Avatar>
            <AvatarFallback><SparkleIcon /></AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback><UserIcon /></AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback><BotIcon /></AvatarFallback>
          </Avatar>
        </div>
        <CodeSnippet>{`<Avatar>
  <AvatarFallback><SparkleIcon /></AvatarFallback>
</Avatar>`}</CodeSnippet>
      </section>

      {/* Sizes */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Sizes</h2>
        <p className={styles.sectionDescription}>
          Three sizes to fit different contexts — <code>sm</code> for compact
          message lists, <code>md</code> for standard chat messages, and{' '}
          <code>lg</code> for profile headers or conversation starters.
        </p>
        <div className={styles.avatarRow}>
          <Avatar size="sm">
            <AvatarFallback><SparkleIcon /></AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback><SparkleIcon /></AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback><SparkleIcon /></AvatarFallback>
          </Avatar>
        </div>
        <CodeSnippet>{`<Avatar size="sm">
  <AvatarFallback><SparkleIcon /></AvatarFallback>
</Avatar>

<Avatar size="md">
  <AvatarFallback><SparkleIcon /></AvatarFallback>
</Avatar>

<Avatar size="lg">
  <AvatarFallback><SparkleIcon /></AvatarFallback>
</Avatar>`}</CodeSnippet>
      </section>

      {/* With Initials */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Initials</h2>
        <p className={styles.sectionDescription}>
          Pass text initials as children of <code>AvatarFallback</code> for a
          lightweight avatar when no profile image is available — common for user
          avatars in multi-user chat interfaces.
        </p>
        <div className={styles.avatarRow}>
          <Avatar size="sm">
            <AvatarFallback>KD</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
        <CodeSnippet>{`<Avatar size="sm">
  <AvatarFallback>KD</AvatarFallback>
</Avatar>

<Avatar size="md">
  <AvatarFallback>JL</AvatarFallback>
</Avatar>

<Avatar size="lg">
  <AvatarFallback>AB</AvatarFallback>
</Avatar>`}</CodeSnippet>
      </section>

      {/* With Image */}
      <section className={styles.section}>
        <h2 className={styles.heading}>With Image</h2>
        <p className={styles.sectionDescription}>
          Add an <code>AvatarImage</code> to display a profile photo. If the image
          fails to load, the <code>AvatarFallback</code> automatically shows instead
          — no error handling needed from the consumer.
        </p>
        <div className={styles.avatarRow}>
          <Avatar size="lg">
            <AvatarImage
              src="https://api.dicebear.com/9.x/notionists/svg?seed=composure"
              alt="Demo user"
            />
            <AvatarFallback>KD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src="https://api.dicebear.com/9.x/notionists/svg?seed=avatar2"
              alt="Second user"
            />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src="https://invalid-url-that-will-fail.test/photo.jpg"
              alt="Broken image"
            />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
        <CodeSnippet>{`<Avatar size="lg">
  <AvatarImage src="/user.jpg" alt="Jane Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

{/* Image fails → fallback shows automatically */}
<Avatar size="lg">
  <AvatarImage src="/broken.jpg" alt="Broken" />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>`}</CodeSnippet>
      </section>

      {/* In a Chat Message */}
      <section className={styles.section}>
        <h2 className={styles.heading}>In a Chat Message</h2>
        <p className={styles.sectionDescription}>
          Use <code>Avatar</code> inside <code>ChatMessageAvatar</code> to combine
          image fallback behavior with the chat message grid layout.
        </p>
        <ChatMessage role="assistant">
          <ChatMessageAvatar>
            <Avatar size="md">
              <AvatarFallback><SparkleIcon /></AvatarFallback>
            </Avatar>
          </ChatMessageAvatar>
          <ChatMessageContent>
            I can help you with that. Let me look into it.
          </ChatMessageContent>
        </ChatMessage>
        <CodeSnippet>{`<ChatMessage role="assistant">
  <ChatMessageAvatar>
    <Avatar size="md">
      <AvatarFallback><SparkleIcon /></AvatarFallback>
    </Avatar>
  </ChatMessageAvatar>
  <ChatMessageContent>
    I can help you with that. Let me look into it.
  </ChatMessageContent>
</ChatMessage>`}</CodeSnippet>
      </section>

      {/* Props table */}
      <section className={styles.section}>
        <h2 className={styles.heading}>Props</h2>

        <h3 className={styles.subHeading}>Avatar</h3>
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
                <td><code>size</code></td>
                <td><code>{`'sm' | 'md' | 'lg'`}</code></td>
                <td><code>'md'</code></td>
                <td>Avatar size — sm (24px), md (32px), lg (48px)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className={styles.subHeading}>AvatarImage</h3>
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
                <td><code>src</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Image source URL</td>
              </tr>
              <tr>
                <td><code>alt</code></td>
                <td><code>string</code></td>
                <td>—</td>
                <td>Alt text for the image</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
