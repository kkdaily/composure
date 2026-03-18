import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DocsLayout } from './docs/DocsLayout'
import { OverviewPage } from './docs/pages/OverviewPage'
import { ComposerPage } from './docs/pages/ComposerPage'
import { ChatMessagePage } from './docs/pages/ChatMessagePage'
import { ScrollAreaPage } from './docs/pages/ScrollAreaPage'
import { CodeBlockPage } from './docs/pages/CodeBlockPage'
import { FilePreviewPage } from './docs/pages/FilePreviewPage'
import { MarkdownRendererPage } from './docs/pages/MarkdownRendererPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <DocsLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/components/chat-message" element={<ChatMessagePage />} />
        <Route path="/components/code-block" element={<CodeBlockPage />} />
        <Route path="/components/composer" element={<ComposerPage />} />
        <Route path="/components/file-preview" element={<FilePreviewPage />} />
        <Route path="/components/markdown-renderer" element={<MarkdownRendererPage />} />
        <Route path="/components/scroll-area" element={<ScrollAreaPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DocsLayout>
  )
}

export default App
