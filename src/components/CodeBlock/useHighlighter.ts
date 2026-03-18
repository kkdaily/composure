import { useState, useEffect, useMemo } from 'react'
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
 * Synchronously highlight code if the highlighter and language are already
 * loaded. Returns null when the fast path isn't available (first load).
 */
function highlightSync(
  code: string,
  language: string,
  resolvedTheme?: 'light' | 'dark'
): ThemedToken[][] | null {
  if (!highlighterInstance) return null

  const canonical = languageAliases[language] || language
  if (!loadedLanguages.has(canonical)) return null

  const isDark =
    resolvedTheme != null
      ? resolvedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches

  const { tokens } = highlighterInstance.codeToTokens(code, {
    lang: canonical,
    theme: isDark ? 'github-dark' : 'github-light',
  })

  return tokens
}

export function useHighlighter(
  code: string,
  language?: string,
  resolvedTheme?: 'light' | 'dark'
): HighlightResult {
  // Fast path: if highlighter + language are already loaded, compute
  // tokens synchronously. This eliminates the flash during streaming
  // where the component would render unhighlighted, then re-render
  // highlighted after the async effect completes.
  const syncTokens = useMemo(
    () => (language ? highlightSync(code, language, resolvedTheme) : null),
    [code, language, resolvedTheme]
  )

  const [asyncResult, setAsyncResult] = useState<HighlightResult>({
    tokens: [],
    ready: false,
  })

  useEffect(() => {
    // If sync path already produced tokens, skip the async work
    if (syncTokens || !language) {
      return
    }

    let cancelled = false

    async function highlight() {
      const highlighter = await getHighlighter()
      const canonicalLang = await ensureLanguageLoaded(highlighter, language!)
      if (cancelled || !canonicalLang) return

      const isDark =
        resolvedTheme != null
          ? resolvedTheme === 'dark'
          : window.matchMedia('(prefers-color-scheme: dark)').matches

      const { tokens } = highlighter.codeToTokens(code, {
        lang: canonicalLang,
        theme: isDark ? 'github-dark' : 'github-light',
      })

      if (!cancelled) {
        setAsyncResult({ tokens, ready: true })
      }
    }

    highlight()

    return () => {
      cancelled = true
    }
  }, [code, language, resolvedTheme, syncTokens])

  if (syncTokens) {
    return { tokens: syncTokens, ready: true }
  }

  return asyncResult
}
