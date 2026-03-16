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
        <Route path="/avatar" element={<Navigate to="/components/avatar" replace />} />
        <Route path="/button" element={<Navigate to="/components/button" replace />} />
        <Route path="/chat-message" element={<Navigate to="/components/chat-message" replace />} />
        <Route path="/code-block" element={<Navigate to="/components/code-block" replace />} />
        <Route path="/composer" element={<Navigate to="/components/composer" replace />} />
        <Route path="/icon-button" element={<Navigate to="/components/icon-button" replace />} />
        <Route path="/select" element={<Navigate to="/components/select" replace />} />
        <Route path="/streaming-text" element={<Navigate to="/components/streaming-text" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DocsLayout>
  )
}

export default App
