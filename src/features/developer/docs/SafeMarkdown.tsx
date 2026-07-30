import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MarkdownBlock =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; value: string }
  | { kind: 'paragraph'; value: string }
  | { kind: 'unordered-list'; items: string[] }
  | { kind: 'ordered-list'; items: string[] }
  | { kind: 'quote'; value: string }
  | { kind: 'code'; language?: string; value: string }
  | { kind: 'table'; headers: string[]; rows: string[][] }

function tableCells(line: string) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let cell = ''

  for (let index = 0; index < trimmed.length; index += 1) {
    const character = trimmed[index]
    if (character === '\\' && trimmed[index + 1] === '|') {
      cell += '|'
      index += 1
      continue
    }
    if (character === '|') {
      cells.push(cell.trim())
      cell = ''
      continue
    }
    cell += character
  }
  cells.push(cell.trim())
  return cells
}

function isTableDivider(line: string) {
  const cells = tableCells(line)
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

function isBlockStart(lines: readonly string[], index: number) {
  const line = lines[index]
  if (!line.trim()) return true
  if (/^```/.test(line.trim())) return true
  if (/^#{1,4}\s+/.test(line)) return true
  if (/^>\s?/.test(line)) return true
  if (/^[-*+]\s+/.test(line)) return true
  if (/^\d+[.)]\s+/.test(line)) return true
  return index + 1 < lines.length && line.includes('|') && isTableDivider(lines[index + 1])
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const fence = line.trim().match(/^```([^\s`]*)\s*$/)
    if (fence) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push({ kind: 'code', language: fence[1] || undefined, value: code.join('\n') })
      continue
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      blocks.push({
        kind: 'heading',
        level: heading[1].length as 1 | 2 | 3 | 4,
        value: heading[2].trim(),
      })
      index += 1
      continue
    }

    if (index + 1 < lines.length && line.includes('|') && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line)
      const rows: string[][] = []
      index += 2
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(tableCells(lines[index]))
        index += 1
      }
      blocks.push({ kind: 'table', headers, rows })
      continue
    }

    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length) {
        const match = lines[index].match(/^[-*+]\s+(.+)$/)
        if (!match) break
        items.push(match[1])
        index += 1
      }
      blocks.push({ kind: 'unordered-list', items })
      continue
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length) {
        const match = lines[index].match(/^\d+[.)]\s+(.+)$/)
        if (!match) break
        items.push(match[1])
        index += 1
      }
      blocks.push({ kind: 'ordered-list', items })
      continue
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = []
      while (index < lines.length) {
        const match = lines[index].match(/^>\s?(.*)$/)
        if (!match) break
        quote.push(match[1])
        index += 1
      }
      blocks.push({ kind: 'quote', value: quote.join(' ') })
      continue
    }

    const paragraph: string[] = [line.trim()]
    index += 1
    while (index < lines.length && !isBlockStart(lines, index)) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push({ kind: 'paragraph', value: paragraph.join(' ') })
  }

  return blocks
}

function safeHref(value: string) {
  const href = value.trim()
  if (/^(https?:|mailto:)/i.test(href)) return href
  if (/^(\/|#|\.\.?\/)/.test(href)) return href
  return undefined
}

function InlineMarkdown({ value }: { value: string }) {
  const tokens = value.split(/(`[^`]*`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)

  return (
    <>
      {tokens.map((token, index) => {
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code key={`${token}-${index}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
              {token.slice(1, -1)}
            </code>
          )
        }
        if (token.startsWith('**') && token.endsWith('**')) {
          return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>
        }
        const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const href = safeHref(link[2])
          return href ? (
            <a
              key={`${token}-${index}`}
              href={href}
              className="font-medium text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {link[1]}
            </a>
          ) : (
            <span key={`${token}-${index}`}>{link[1]}</span>
          )
        }
        return token
      })}
    </>
  )
}

function MarkdownHeading({ level, children }: { level: 1 | 2 | 3 | 4; children: ReactNode }) {
  const className = cn(
    'font-sans font-semibold text-foreground',
    level === 1 && 'mt-10 text-3xl first:mt-0',
    level === 2 && 'mt-9 text-2xl first:mt-0',
    level === 3 && 'mt-7 text-xl first:mt-0',
    level === 4 && 'mt-6 text-base first:mt-0',
  )

  if (level === 1) return <h2 className={className}>{children}</h2>
  if (level === 2) return <h3 className={className}>{children}</h3>
  if (level === 3) return <h4 className={className}>{children}</h4>
  return <h5 className={className}>{children}</h5>
}

export interface SafeMarkdownProps {
  markdown: string
  className?: string
  emptyFallback?: ReactNode
}

/**
 * A deliberately small Markdown renderer for trusted handoff prose.
 * Raw HTML is always emitted as text; this component never injects HTML.
 */
export function SafeMarkdown({ markdown, className, emptyFallback = null }: SafeMarkdownProps) {
  const blocks = parseMarkdown(markdown)
  if (blocks.length === 0) return <>{emptyFallback}</>

  return (
    <div className={cn('max-w-none font-sans text-sm leading-7 text-foreground', className)}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`
        if (block.kind === 'heading') {
          return (
            <MarkdownHeading key={key} level={block.level}>
              <InlineMarkdown value={block.value} />
            </MarkdownHeading>
          )
        }
        if (block.kind === 'paragraph') {
          return (
            <p key={key} className="mt-4 text-muted-foreground first:mt-0">
              <InlineMarkdown value={block.value} />
            </p>
          )
        }
        if (block.kind === 'unordered-list' || block.kind === 'ordered-list') {
          const List = block.kind === 'unordered-list' ? 'ul' : 'ol'
          return (
            <List
              key={key}
              className={cn(
                'mt-4 space-y-1.5 pl-6 text-muted-foreground marker:text-foreground',
                block.kind === 'unordered-list' ? 'list-disc' : 'list-decimal',
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>
                  <InlineMarkdown value={item} />
                </li>
              ))}
            </List>
          )
        }
        if (block.kind === 'quote') {
          return (
            <blockquote key={key} className="mt-5 border-l-4 border-primary/35 pl-4 italic text-muted-foreground">
              <InlineMarkdown value={block.value} />
            </blockquote>
          )
        }
        if (block.kind === 'code') {
          return (
            <div key={key} className="mt-5 overflow-hidden rounded-lg border border-border bg-muted/40 text-foreground">
              {block.language ? (
                <div className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
                  {block.language}
                </div>
              ) : null}
              <pre className="overflow-x-auto p-4 font-mono text-xs leading-6" tabIndex={0}>
                <code>{block.value}</code>
              </pre>
            </div>
          )
        }
        return (
          <div key={key} className="mt-5 overflow-x-auto rounded-lg border border-border" tabIndex={0}>
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={`${header}-${headerIndex}`} scope="col" className="border-b border-border px-4 py-3 font-semibold text-foreground">
                      <InlineMarkdown value={header} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="border-b border-border last:border-b-0">
                    {block.headers.map((_, cellIndex) => (
                      <td key={`cell-${cellIndex}`} className="px-4 py-3 align-top text-muted-foreground">
                        <InlineMarkdown value={row[cellIndex] ?? ''} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
