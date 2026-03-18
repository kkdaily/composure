# Composure

A React component library for building AI chat interfaces. Solves the UI patterns that every AI app rebuilds from scratch — chat bubbles, auto-scrolling, composers, streaming text, code blocks — so you can focus on your product instead.

[Live Demo](https://TODO) <!-- Replace with deployed URL -->

![Composure docs site](./docs-screenshot.png) <!-- Replace with actual screenshot -->

## Components

| Component | Description |
|-----------|-------------|
| **Avatar** | Image with fallback initials, composable with sub-components |
| **Button** | Primary, secondary, ghost, and destructive variants with icon slots and loading state |
| **ChatMessage** | Role-based message bubbles with avatar, content, and action slots |
| **CodeBlock** | Syntax-highlighted code with Shiki, copy button, and line numbers |
| **Composer** | Auto-resizing textarea with header/footer slots and keyboard submit |
| **FilePreview** | File attachment chips with thumbnails, type icons, and remove actions |
| **IconButton** | Icon-only button with required accessible label |
| **ScrollArea** | Auto-scroll-to-bottom with user scroll intent detection |
| **Select** | Dynamic-width select with label and ghost variant |

## Why this exists

Every AI chat app — ChatGPT, Claude, Gemini, Cursor — solves the same frontend problems: auto-scrolling that respects user intent, composers that grow with input, message bubbles that handle streaming, code blocks with syntax highlighting. Developers building AI-powered interfaces end up reinventing these patterns from scratch every time.

Composure extracts these into a set of composable, accessible, theme-aware React components. Every component uses design tokens for consistent theming (including dark mode and 8 accent color palettes), meets WCAG 2.1 AA standards, and respects `prefers-reduced-motion`. The API follows the shadcn/ui pattern — named exports, React context for shared state, and no hardcoded opinions about how you compose them.

## Built with

- React 19 + TypeScript
- CSS Modules + design tokens (no Tailwind, no runtime CSS-in-JS)
- Shiki for syntax highlighting
- Zero external UI dependencies
