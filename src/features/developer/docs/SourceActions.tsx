import { useState } from 'react'
import { Check, ChevronDown, Copy, Download, FileCode2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { SourceFileViewModel } from './types'

function basename(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? 'source.txt'
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

export async function copySourceText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  fallbackCopy(value)
}

export function downloadSourceFile(file: SourceFileViewModel) {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = file.downloadName ?? basename(file.path)
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
}

function fileLabel(file: SourceFileViewModel) {
  const framework = file.framework === 'shared'
    ? 'Shared'
    : file.framework === 'react'
      ? 'React'
      : 'Blade'
  return `${framework} · ${file.path}`
}

export function SourceActions({ files }: { files: readonly SourceFileViewModel[] }) {
  const actionableFiles = files.filter((file) => file.copyable !== false)
  const [copyOpen, setCopyOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [copiedPath, setCopiedPath] = useState<string>()
  const [copyError, setCopyError] = useState<string>()
  const [downloadError, setDownloadError] = useState<string>()

  const copy = async (file: SourceFileViewModel) => {
    try {
      await copySourceText(file.content)
      setCopyError(undefined)
      setCopiedPath(file.path)
      setCopyOpen(false)
    } catch {
      setCopiedPath(undefined)
      setCopyError(file.path)
    }
  }

  const download = (file: SourceFileViewModel) => {
    try {
      downloadSourceFile(file)
      setDownloadError(undefined)
      setDownloadOpen(false)
    } catch {
      setDownloadError(file.path)
    }
  }

  const copyErrorFile = actionableFiles.find((file) => file.path === copyError)

  if (actionableFiles.length === 0) return null

  return (
    <div className="flex items-center gap-2" aria-label="Source file actions">
      <Popover
        open={copyOpen}
        onOpenChange={(open) => {
          setCopyOpen(open)
          if (open) setDownloadOpen(false)
        }}
      >
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Copy aria-hidden="true" />
            Copy
            <ChevronDown aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(28rem,calc(100vw-2rem))] p-1.5">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Copy an exact handoff file</p>
          <div className="max-h-72 overflow-y-auto">
            {actionableFiles.map((file) => (
              <button
                key={`copy-${file.path}`}
                type="button"
                className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-xs text-foreground outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => void copy(file)}
              >
                {copiedPath === file.path ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <FileCode2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
                <span className="min-w-0 break-all font-mono">{fileLabel(file)}</span>
              </button>
            ))}
          </div>
          {copyError ? (
            <div className="m-1 space-y-2 rounded-md bg-destructive/10 p-2" role="alert">
              <p className="text-xs text-destructive">Copy was blocked. Select the exact source below and copy it manually.</p>
              {copyErrorFile ? (
                <textarea
                  readOnly
                  value={copyErrorFile.content}
                  aria-label={`${copyErrorFile.path} source for manual copying`}
                  className="h-28 w-full resize-y rounded-md border border-border bg-background p-2 font-mono text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onFocus={(event) => event.currentTarget.select()}
                />
              ) : null}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>

      <Popover
        open={downloadOpen}
        onOpenChange={(open) => {
          setDownloadOpen(open)
          if (open) setCopyOpen(false)
        }}
      >
        <PopoverTrigger asChild>
          <Button type="button" size="sm" variant="outline">
            <Download aria-hidden="true" />
            Download
            <ChevronDown aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(28rem,calc(100vw-2rem))] p-1.5">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Download an exact handoff file</p>
          <div className="max-h-72 overflow-y-auto">
            {actionableFiles.map((file) => (
              <button
                key={`download-${file.path}`}
                type="button"
                className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-xs text-foreground outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => download(file)}
              >
                <Download className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 break-all font-mono">{fileLabel(file)}</span>
              </button>
            ))}
          </div>
          {downloadError ? (
            <p className="m-1 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive" role="alert">
              The browser could not download {downloadError}. Its source remains available from the Copy menu.
            </p>
          ) : null}
        </PopoverContent>
      </Popover>

      <span className="sr-only" aria-live="polite">
        {copiedPath ? `${copiedPath} copied to the clipboard.` : copyError ? `Could not copy ${copyError}. Select its source manually.` : ''}
      </span>
    </div>
  )
}
