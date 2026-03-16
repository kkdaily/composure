import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './docs/Sidebar'
import { DocsLayout } from './docs/DocsLayout'
import { OverviewPage } from './docs/pages/OverviewPage'
import { TokensPage } from './docs/pages/TokensPage'
import { ButtonPage } from './docs/pages/ButtonPage'
import { IconButtonPage } from './docs/pages/IconButtonPage'
import { ComposerPage } from './docs/pages/ComposerPage'
import { ChatMessagePage } from './docs/pages/ChatMessagePage'
import { StreamingTextPage } from './docs/pages/StreamingTextPage'
import { SelectPage } from './docs/pages/SelectPage'
import { CodeBlockPage } from './docs/pages/CodeBlockPage'
import { AvatarPage } from './docs/pages/AvatarPage'

function App() {
  return (
    <DocsLayout sidebar={<Sidebar />}>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/components/avatar" element={<AvatarPage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/chat-message" element={<ChatMessagePage />} />
        <Route path="/components/code-block" element={<CodeBlockPage />} />
        <Route path="/components/composer" element={<ComposerPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
        <Route path="/components/select" element={<SelectPage />} />
        <Route path="/components/streaming-text" element={<StreamingTextPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DocsLayout>
  )
}

export default App
