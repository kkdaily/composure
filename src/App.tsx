import { useState } from 'react'
import { Sidebar } from './docs/Sidebar'
import type { PageId } from './docs/Sidebar'
import { DocsLayout } from './docs/DocsLayout'
import { OverviewPage } from './docs/pages/OverviewPage'
import { TokensPage } from './docs/pages/TokensPage'
import { ButtonPage } from './docs/pages/ButtonPage'
import { IconButtonPage } from './docs/pages/IconButtonPage'
import { ComposerPage } from './docs/pages/ComposerPage'
import { ChatMessagePage } from './docs/pages/ChatMessagePage'
import { StreamingTextPage } from './docs/pages/StreamingTextPage'
import { SelectPage } from './docs/pages/SelectPage'
import { ComponentPlaceholder } from './docs/pages/ComponentPlaceholder'

const componentNames: Record<string, string> = {
  'chat-message': 'ChatMessage',
  'message-list': 'MessageList',
  composer: 'Composer',
  'streaming-text': 'StreamingText',
  'code-block': 'CodeBlock',
  'copy-button': 'CopyButton',
  avatar: 'Avatar',
  tooltip: 'Tooltip',
  'loading-dots': 'LoadingDots',
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('overview')

  function renderPage() {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />
      case 'tokens':
        return <TokensPage />
      case 'button':
        return <ButtonPage />
      case 'icon-button':
        return <IconButtonPage />
      case 'composer':
        return <ComposerPage />
      case 'chat-message':
        return <ChatMessagePage />
      case 'streaming-text':
        return <StreamingTextPage />
      case 'select':
        return <SelectPage />
      default:
        return (
          <ComponentPlaceholder
            name={componentNames[activePage] ?? activePage}
          />
        )
    }
  }

  return (
    <DocsLayout
      sidebar={
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      }
    >
      {renderPage()}
    </DocsLayout>
  )
}

export default App
