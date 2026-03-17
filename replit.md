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
  App.tsx          - Main application component
  main.tsx         - Entry point with BrowserRouter
  index.css        - Global styles
  components/      - Reusable UI components
  docs/            - Documentation content
  tokens/          - Design tokens (CSS variables)
```

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
