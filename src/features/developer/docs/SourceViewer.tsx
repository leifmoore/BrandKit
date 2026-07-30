import { useMemo, useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { PageState } from './PageScaffold'
import type { SourceFileViewModel, SourceFramework } from './types'

export interface SourceViewerProps {
  files: readonly SourceFileViewModel[]
  className?: string
  /** Use false for evidence-only records that must not expose copy/install actions. */
  allowActions?: boolean
  emptyMessage?: string
}

interface SourceGroup {
  framework: SourceFramework
  files: (SourceFileViewModel & { tabId: string })[]
}

const frameworkOrder: readonly SourceFramework[] = ['react', 'blade', 'shared']

function frameworkLabel(framework: SourceFramework) {
  if (framework === 'react') return 'React'
  if (framework === 'blade') return 'Blade'
  return 'Shared'
}

function basename(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? 'source.txt'
}

function sourceTabLabel(
  file: SourceFileViewModel,
  siblings: readonly SourceFileViewModel[],
) {
  if (file.label) return file.label
  const name = basename(file.path)
  const duplicate = siblings.some(
    (candidate) => candidate.path !== file.path && basename(candidate.path) === name,
  )
  if (!duplicate) return name

  const segments = file.path.split('/').filter(Boolean)
  return segments.slice(-2).join('/')
}

function fallbackCopy(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('The browser did not copy the source.')
}

async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  fallbackCopy(value)
}

function downloadSource(file: SourceFileViewModel) {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = file.downloadName ?? basename(file.path)
  anchor.click()
  URL.revokeObjectURL(objectUrl)
}

function SourceFilePanel({
  file,
  allowActions,
}: {
  file: SourceFileViewModel
  allowActions: boolean
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const actionsEnabled = allowActions && file.copyable !== false

  const copy = async () => {
    try {
      await writeClipboard(file.content)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex min-h-12 flex-col gap-2 border-b border-border bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs text-foreground" title={file.path}>
            {file.path}
          </p>
          {file.kind ? (
            <p className="mt-0.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-caps text-muted-foreground">
              {file.kind}
            </p>
          ) : null}
        </div>
        {actionsEnabled ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label={`${copyState === 'copied' ? 'Copied' : 'Copy'} ${basename(file.path)}`}
              onClick={copy}
            >
              {copyState === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              aria-label={`Download ${basename(file.path)}`}
              onClick={() => downloadSource(file)}
            >
              <Download aria-hidden="true" />
              Download
            </Button>
            <span className="sr-only" aria-live="polite">
              {copyState === 'copied'
                ? `${basename(file.path)} copied to the clipboard.`
                : copyState === 'error'
                  ? `Could not copy ${basename(file.path)}. Select the source manually.`
                  : ''}
            </span>
          </div>
        ) : null}
      </div>
      {copyState === 'error' ? (
        <p className="border-b border-destructive/20 bg-destructive/10 px-4 py-2 font-sans text-xs text-destructive" role="alert">
          Copy was blocked by the browser. Select the source below and copy it manually.
        </p>
      ) : null}
      <pre
        className="max-h-[42rem] overflow-auto bg-navy-900 p-4 font-mono text-xs leading-6 text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-300"
        tabIndex={0}
        role="region"
        aria-label={`${basename(file.path)} source code`}
      >
        <code data-language={file.language}>{file.content}</code>
      </pre>
    </div>
  )
}

function SourceGroupTabs({ group, allowActions }: { group: SourceGroup; allowActions: boolean }) {
  const firstFile = group.files[0]
  if (!firstFile) return null

  if (group.files.length === 1) {
    return <SourceFilePanel file={firstFile} allowActions={allowActions} />
  }

  return (
    <Tabs defaultValue={firstFile.tabId} className="w-full gap-0">
      <div className="mb-3 overflow-x-auto pb-1">
        <TabsList className="h-auto min-w-max justify-start bg-muted p-1" aria-label={`${frameworkLabel(group.framework)} source files`}>
          {group.files.map((file) => (
            <TabsTrigger
              key={file.tabId}
              value={file.tabId}
              className="max-w-56 truncate focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title={file.path}
            >
              {sourceTabLabel(file, group.files)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {group.files.map((file) => (
        <TabsContent key={file.tabId} value={file.tabId} className="mt-0">
          <SourceFilePanel file={file} allowActions={allowActions} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export function SourceViewer({
  files,
  className,
  allowActions = true,
  emptyMessage = 'No source files are available for this entry.',
}: SourceViewerProps) {
  const groups = useMemo<SourceGroup[]>(() => {
    return frameworkOrder.flatMap((framework) => {
      const matches = files
        .filter((file) => file.framework === framework)
        .map((file, index) => ({
          ...file,
          tabId: file.id ?? `${framework}-${index}-${file.path}`,
        }))
      return matches.length > 0 ? [{ framework, files: matches }] : []
    })
  }, [files])

  const firstGroup = groups[0]
  if (!firstGroup) {
    return (
      <PageState
        kind="empty"
        title="Source unavailable"
        description={emptyMessage}
        className={className}
      />
    )
  }

  if (groups.length === 1) {
    return (
      <div className={className}>
        <SourceGroupTabs group={firstGroup} allowActions={allowActions} />
      </div>
    )
  }

  return (
    <Tabs defaultValue={firstGroup.framework} className={cn('w-full gap-0', className)}>
      <TabsList className="mb-4 h-auto w-full justify-start overflow-x-auto bg-muted p-1 sm:w-auto" aria-label="Source framework">
        {groups.map((group) => (
          <TabsTrigger
            key={group.framework}
            value={group.framework}
            className="min-w-24 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {frameworkLabel(group.framework)}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsContent key={group.framework} value={group.framework} className="mt-0">
          <SourceGroupTabs group={group} allowActions={allowActions} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
