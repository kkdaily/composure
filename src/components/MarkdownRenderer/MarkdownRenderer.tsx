import {
  type HTMLAttributes,
  type ComponentType,
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  isValidElement,
  useMemo,
} from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock, CodeBlockContent } from '../CodeBlock/CodeBlock'
import { cn } from '@/lib/utils'

/* ===========================
   Types
   =========================== */

export interface MarkdownComponents {
  /** Custom renderer for fenced code blocks */
  code: ComponentType<{ language?: string; children: string }>
  /** Custom renderer for links */
  a: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>
  /** Custom renderer for images */
  img: ComponentType<ImgHTMLAttributes<HTMLImageElement>>
}

export interface MarkdownRendererProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> {
  /** Markdown string to render */
  content: string
  /** Set aria-busy during streaming */
  streaming?: boolean
  /** Override default element renderers */
  components?: Partial<MarkdownComponents>
  /** Additional CSS class for external overrides */
  className?: string
}

/* ===========================
   MarkdownRenderer
   =========================== */

export function MarkdownRenderer({
  content,
  streaming = false,
  components: userComponents,
  className,
  ...rest
}: MarkdownRendererProps) {
  const markdownComponents: import('react-markdown').Components = useMemo(() => ({
    pre({ children }) {
      const child = isValidElement(children) ? children : null

      if (child && child.props) {
        const childProps = child.props as Record<string, unknown>
        const childClassName = String(childProps.className || '')
        const match = /language-(\w+)/.exec(childClassName)
        const language = match ? match[1] : undefined
        const codeString = String(childProps.children).replace(/\n$/, '')

        if (userComponents?.code) {
          const UserCode = userComponents.code
          return <UserCode language={language}>{codeString}</UserCode>
        }

        return (
          <div className="mb-4 last:mb-0">
            <CodeBlock>
              <CodeBlockContent language={language}>
                {codeString}
              </CodeBlockContent>
            </CodeBlock>
          </div>
        )
      }

      return <pre>{children}</pre>
    },

    code({ className: codeClassName, children, ...codeRest }) {
      return (
        <code
          className={cn(
            'font-mono text-[0.9em] bg-muted px-1 rounded-sm text-foreground',
            codeClassName
          )}
          {...codeRest}
        >
          {children}
        </code>
      )
    },

    a({ children, ...aRest }) {
      if (userComponents?.a) {
        const UserA = userComponents.a
        return <UserA {...aRest}>{children}</UserA>
      }

      return (
        <a target="_blank" rel="noopener noreferrer" {...aRest}>
          {children}
        </a>
      )
    },

    img(imgProps) {
      if (userComponents?.img) {
        const UserImg = userComponents.img
        return <UserImg {...imgProps} />
      }

      return <img loading="lazy" {...imgProps} />
    },
  }), [userComponents])

  return (
    <div
      className={cn(
        'prose dark:prose-invert max-w-none break-words',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-a:transition-colors prose-a:duration-100 prose-a:ease-out prose-a:motion-reduce:transition-none',
        'prose-blockquote:border-l-primary prose-blockquote:text-secondary-foreground',
        'prose-strong:text-foreground',
        'prose-th:text-secondary-foreground prose-th:text-xs prose-th:uppercase prose-th:tracking-wider prose-th:font-medium',
        'prose-td:text-secondary-foreground',
        'prose-img:rounded-md',
        'prose-hr:border-border',
        'prose-del:text-muted-foreground',
        '[&_li>input[type=checkbox]]:mr-2 [&_li>input[type=checkbox]]:accent-primary',
        className
      )}
      aria-busy={streaming || undefined}
      {...rest}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </Markdown>
    </div>
  )
}
