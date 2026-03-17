# Composure - React + TypeScript + Vite App

## Project Overview

A React + TypeScript frontend application built with Vite. Uses React Router for client-side routing and Shiki for syntax highlighting.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Router:** React Router DOM 7
- **Syntax Highlighting:** Shiki 4
- **Linting:** ESLint with TypeScript support

## Project Structure

```
src/
  App.tsx            - Main application component
  main.tsx           - Entry point; wraps app in ThemeProvider + BrowserRouter
  index.css          - Global styles
  context/
    theme.tsx        - ThemeProvider + useTheme hook (light/dark/system)
  assets/
    logos/           - SVG logo variations (composure-v1.svg used in navbar)
  docs/
    Navbar.tsx       - Top navbar with logo, brand, theme toggle, GitHub link
    Sidebar.tsx      - Left sidebar navigation
    DocsLayout.tsx   - Page layout combining Navbar + Sidebar + content
  tokens/
    tokens.css       - Design tokens (CSS vars); dark tokens under [data-theme="dark"]
```

## Theme System

Inspired by Radix UI's `<Theme>` pattern:

- **`ThemeProvider`** (`src/context/theme.tsx`) wraps the app and manages theme state
- Supports three modes: `"light"`, `"dark"`, `"system"` — persisted to `localStorage` as `composure-theme`
- Sets `data-theme` attribute on `<html>` so CSS variables respond without JavaScript
- **CSS strategy:** `[data-theme="dark"]` forces dark; `@media (prefers-color-scheme: dark)` with `:not([data-theme])` handles system mode
- **`useTheme()`** hook exposes `{ theme, resolvedTheme, setTheme }` anywhere in the tree
- The navbar has a toggle button cycling system → light → dark with matching icons

## Development

- **Dev server:** `npm run dev` — runs on port 5000
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Workflows

- **Start application** — runs `npm run dev` on port 5000 (webview)

## Deployment

Configured as a static site:
- Build command: `npm run build`
- Public directory: `dist`
