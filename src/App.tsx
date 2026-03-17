import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './docs/Sidebar'
import { DocsLayout } from './docs/DocsLayout'
import { OverviewPage } from './docs/pages/OverviewPage'
import { TokensPage } from './docs/pages/TokensPage'
import { ThemeOverviewPage } from './docs/pages/theme/ThemeOverviewPage'
import { ColorPage } from './docs/pages/theme/ColorPage'
import { DarkModePage } from './docs/pages/theme/DarkModePage'
import { TypographyPage } from './docs/pages/theme/TypographyPage'
import { SpacingPage } from './docs/pages/theme/SpacingPage'
import { RadiusPage } from './docs/pages/theme/RadiusPage'
import { ButtonPage } from './docs/pages/ButtonPage'
import { IconButtonPage } from './docs/pages/IconButtonPage'
import { ComposerPage } from './docs/pages/ComposerPage'
import { ChatMessagePage } from './docs/pages/ChatMessagePage'
import { ScrollAreaPage } from './docs/pages/ScrollAreaPage'
import { SelectPage } from './docs/pages/SelectPage'
import { CodeBlockPage } from './docs/pages/CodeBlockPage'
import { AvatarPage } from './docs/pages/AvatarPage'

function App() {
  return (
    <DocsLayout sidebar={<Sidebar />}>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/theme" element={<ThemeOverviewPage />} />
        <Route path="/theme/color" element={<ColorPage />} />
        <Route path="/theme/dark-mode" element={<DarkModePage />} />
        <Route path="/theme/typography" element={<TypographyPage />} />
        <Route path="/theme/spacing" element={<SpacingPage />} />
        <Route path="/theme/radius" element={<RadiusPage />} />
        <Route path="/components/avatar" element={<AvatarPage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/chat-message" element={<ChatMessagePage />} />
        <Route path="/components/code-block" element={<CodeBlockPage />} />
        <Route path="/components/composer" element={<ComposerPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
        <Route path="/components/scroll-area" element={<ScrollAreaPage />} />
        <Route path="/components/select" element={<SelectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DocsLayout>
  )
}

export default App
