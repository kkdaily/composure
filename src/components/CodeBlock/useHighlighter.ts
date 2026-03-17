import { useState, useEffect } from 'react'
import { type HighlighterCore, type ThemedToken } from 'shiki/core'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

/**
 * Shared highlighter singleton. Lazily initialized on first use.
 * Uses the JavaScript RegExp engine (no WASM) for smaller bundle size.
 */
let highlighterPromise: Promise<HighlighterCore> | null = null
let highlighterInstance: HighlighterCore | null = null

// Languages loaded so far (to avoid redundant imports)
const loadedLanguages = new Set<string>()

// Map of language IDs to their dynamic import functions
const languageImports: Record<string, () => Promise<unknown>> = {
  javascript: () => import('shiki/langs/javascript.mjs'),
  js: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  ts: () => import('shiki/langs/typescript.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  py: () => import('shiki/langs/python.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  sh: () => import('shiki/langs/bash.mjs'),
  shell: () => import('shiki/langs/shellscript.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  yml: () => import('shiki/langs/yaml.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  md: () => import('shiki/langs/markdown.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
}

// Canonical language name (resolve aliases)
const languageAliases: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'shellscript',
  yml: 'yaml',
  md: 'markdown',
}

function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import('shiki/themes/github-light.mjs'),
        import('shiki/themes/github-dark.mjs'),
      ],
      engine: createJavaScriptRegexEngine(),
    }).then((h) => {
      highlighterInstance = h
      return h
    })
  }
  return highlighterPromise
}

async function ensureLanguageLoaded(
  highlighter: HighlighterCore,
  language: string
): Promise<string | null> {
  const canonical = languageAliases[language] || language
  if (loadedLanguages.has(canonical)) return canonical

  const importFn = languageImports[language]
  if (!importFn) return null

  const lang = await importFn()
  await highlighter.loadLanguage(lang as Parameters<HighlighterCore['loadLanguage']>[0])
  loadedLanguages.add(canonical)
  return canonical
}

export interface HighlightResult {
  /** Tokenized lines — each line is an array of themed tokens */
  tokens: ThemedToken[][]
  /** Whether highlighting is ready (false during async load) */
  ready: boolean
}

/**
 * Hook that returns syntax-highlighted tokens for a code string.
 * Returns `{ tokens: [], ready: false }` while the highlighter loads,
 * then re-renders with the highlighted tokens.
 */
export function useHighlighter(
  code: string,
  language?: string
): HighlightResult {
  const [result, setResult] = useState<HighlightResult>({
    tokens: [],
    ready: false,
  })

  useEffect(() => {
    if (!language) {
      setResult({ tokens: [], ready: false })
      return
    }

    let cancelled = false

    async function highlight() {
      const highlighter = await getHighlighter()
      const canonicalLang = await ensureLanguageLoaded(highlighter, language!)
      if (cancelled || !canonicalLang) return

      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      const { tokens } = highlighter.codeToTokens(code, {
        lang: canonicalLang,
        theme: isDark ? 'github-dark' : 'github-light',
      })

      if (!cancelled) {
        setResult({ tokens, ready: true })
      }
    }

    highlight()

    return () => {
      cancelled = true
    }
  }, [code, language])

  return result
}
