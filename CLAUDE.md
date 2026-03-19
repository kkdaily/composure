# Composure

React component library for AI chat interfaces, built for the shadcn ecosystem. Components are installable via the shadcn CLI from a custom registry at `composureui.com`.

The repo contains two things:
1. The component library (`/src/components`)
2. A documentation site (`/src/docs`) deployed at [composureui.com](https://composureui.com)

## Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Tailwind CSS 4** for all styling (via `cn()` utility from `clsx` + `tailwind-merge`)
- **Vite 8** for dev/build
- **shadcn/ui** primitives for Button, Avatar, Select (in `/src/components/ui/`)
- **Shiki** for syntax highlighting (lazy-loaded grammars, sync fast-path)
- **react-markdown** + **remark-gfm** for markdown rendering
- **Lucide** icons throughout
- **Geist Sans** / **Geist Mono** fonts via `@fontsource`

## Custom components

These are the components this library provides (shadcn doesn't have them):

| Component | Sub-components |
|-----------|---------------|
| ChatMessage | ChatMessageAvatar, ChatMessageContent, ChatMessageLoading, ChatMessageActions |
| CodeBlock | CodeBlockContent |
| Composer | ComposerInput, ComposerHeader, ComposerHeaderStart, ComposerHeaderEnd, ComposerFooter, ComposerFooterStart, ComposerFooterEnd |
| FilePreview | (flat props API, no sub-components) |
| MarkdownRenderer | (flat props API) |
| ScrollArea | ScrollAreaScrollToBottom |

## Architecture patterns

- **Composable sub-components** following the shadcn pattern: separate named exports (not dot-notation), shared state via React context, each with its own `className` prop
- **Tailwind utility classes** for all styling. No CSS Modules, no inline styles
- **CSS custom properties** defined in `/src/styles/globals.css` for theme colors, AI-specific tokens (chat bubbles, file-type colors), and font families
- **Dark mode** via `.dark` class selector (shadcn pattern)
- All components accept `className` and spread `...rest` for consumer flexibility

## File structure

```
/src
  /components
    /ChatMessage/ChatMessage.tsx
    /CodeBlock/CodeBlock.tsx + useHighlighter.ts
    /Composer/Composer.tsx
    /FilePreview/FilePreview.tsx
    /MarkdownRenderer/MarkdownRenderer.tsx
    /ScrollArea/ScrollArea.tsx
    /ui/            # shadcn primitives (button, avatar, select)
  /context/theme.tsx
  /docs
    /pages/         # one file per component doc page + OverviewPage
    Sidebar.tsx
    Navbar.tsx
    DocsLayout.tsx
    CodeSnippet.tsx
  /styles/globals.css
  /lib/utils.ts     # cn() utility
  /index.ts         # public exports
  App.tsx
  main.tsx
/registry.json      # shadcn registry definition
/components.json    # shadcn CLI config
```

## TypeScript

- Every component has an exported props interface
- String union types over booleans for variant props (`role: 'assistant' | 'user'`, not `isAssistant`)
- Props interfaces extend appropriate `HTMLAttributes` so consumers can pass `aria-*` attributes via `...rest`

## Accessibility

All components target WCAG 2.1 AA:
- Semantic HTML elements, `focus-visible` outlines, `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative icons
- `aria-busy` during loading/streaming, `aria-live="polite"` on scroll containers
- `prefers-reduced-motion` respected (Tailwind `motion-reduce:` utilities + JS check in ScrollArea's lerp)
- Semantic `<header>`/`<footer>` elements in Composer

## Registry

Components are published as a custom shadcn registry. `registry.json` defines the items, and `npx shadcn@latest build` generates individual JSON files in `public/r/` during the build step. These are served as static files on Vercel.

## Build

```bash
npm run dev      # Vite dev server
npm run build    # tsc + vite build + shadcn registry build
```

The build script runs `npx shadcn@latest build` after Vite to generate registry files in `public/r/`.
