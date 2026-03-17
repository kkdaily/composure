import { CodeBlock, CodeBlockContent } from '../components/CodeBlock/CodeBlock'

export interface CodeSnippetProps {
  children: string
  language?: string
  className?: string
}

export function CodeSnippet({ children, language = 'tsx', className }: CodeSnippetProps) {
  return (
    <CodeBlock className={className}>
      <CodeBlockContent language={language}>{children}</CodeBlockContent>
    </CodeBlock>
  )
}
