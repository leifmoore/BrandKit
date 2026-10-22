import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileJson2,
  FileText,
  Flag,
  RotateCcw,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LivePreview } from '@/features/developer/preview'
import {
  PREVIEW_REVIEW_NOTE_LIMIT,
  clearPreviewReviewRecords,
  createPreviewReviewJson,
  createPreviewReviewMarkdown,
  filterPreviewReviewQueue,
  getPreviewReviewCounts,
  getPreviewReviewStatus,
  previewReviewQueue,
  readPreviewReviewRecords,
  storePreviewReviewRecords,
  updatePreviewReviewRecord,
  type PreviewReviewFilter,
  type PreviewReviewRecords,
  type PreviewReviewStatus,
} from './reviewState'

const queueByKey = new Map(previewReviewQueue.map((entry) => [entry.key, entry]))

const filterOptions: readonly {
  id: PreviewReviewFilter
  label: string
}[] = [
  { id: 'all', label: 'All' },
  { id: 'unreviewed', label: 'Unreviewed' },
  { id: 'flagged', label: 'Flagged' },
]

const statusOptions: readonly {
  id: PreviewReviewStatus
  label: string
  description: string
}[] = [
  {
    id: 'unreviewed',
    label: 'Unreviewed',
    description: 'Leave this preview in the review queue.',
  },
  {
    id: 'pass',
    label: 'Pass',
    description: 'The preview behaves and presents as expected.',
  },
  {
    id: 'flagged',
    label: 'Flagged',
    description: 'Record a visual or interaction issue to revisit.',
  },
]

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function statusBadge(status: PreviewReviewStatus) {
  if (status === 'pass') return <Badge variant="success">Passed</Badge>
  if (status === 'flagged') return <Badge variant="warning">Flagged</Badge>
  return <Badge variant="outline">Unreviewed</Badge>
}

function filterCount(
  filter: PreviewReviewFilter,
  counts: ReturnType<typeof getPreviewReviewCounts>,
) {
  if (filter === 'unreviewed') return counts.unreviewed
  if (filter === 'flagged') return counts.flagged
  return counts.total
}

export default function PreviewReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [records, setRecords] = useState<PreviewReviewRecords>(() => readPreviewReviewRecords())
  const [filter, setFilter] = useState<PreviewReviewFilter>('all')
  const [draftStatus, setDraftStatus] = useState<PreviewReviewStatus>('unreviewed')
  const [draftNote, setDraftNote] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [storageWarning, setStorageWarning] = useState('')

  const counts = useMemo(() => getPreviewReviewCounts(records), [records])
  const visibleEntries = useMemo(
    () => filterPreviewReviewQueue(records, filter),
    [filter, records],
  )
  const requestedEntryKey = searchParams.get('entry')
  const requestedEntry = requestedEntryKey ? queueByKey.get(requestedEntryKey) : undefined
  const currentEntry = requestedEntry && visibleEntries.some((entry) => entry.key === requestedEntry.key)
    ? requestedEntry
    : visibleEntries[0]
  const currentVisibleIndex = currentEntry
    ? visibleEntries.findIndex((entry) => entry.key === currentEntry.key)
    : -1
  const currentQueueIndex = currentEntry
    ? previewReviewQueue.findIndex((entry) => entry.key === currentEntry.key)
    : -1
  const savedStatus = currentEntry
    ? getPreviewReviewStatus(records, currentEntry.key)
    : 'unreviewed'
  const savedNote = currentEntry ? records[currentEntry.key]?.note ?? '' : ''
  const isDirty = draftStatus !== savedStatus
    || (draftStatus === 'flagged' && draftNote.trim() !== savedNote)
  const completionPercent = counts.total > 0
    ? Math.round((counts.reviewed / counts.total) * 100)
    : 0

  const setCurrentEntry = useCallback((key: string, replace = false) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set('entry', key)
      return next
    }, { replace })
  }, [setSearchParams])

  useEffect(() => {
    if (!currentEntry || requestedEntryKey === currentEntry.key) return
    setCurrentEntry(currentEntry.key, true)
  }, [currentEntry, requestedEntryKey, setCurrentEntry])

  useEffect(() => {
    setDraftStatus(savedStatus)
    setDraftNote(savedNote)
    if (currentEntry) {
      setAnnouncement(
        `Reviewing ${currentEntry.title}, item ${currentQueueIndex + 1} of ${previewReviewQueue.length}.`,
      )
    }
  }, [currentEntry, currentQueueIndex, savedNote, savedStatus])

  const navigateTo = (index: number) => {
    const destination = visibleEntries[index]
    if (destination) setCurrentEntry(destination.key)
  }

  const selectFilter = (nextFilter: PreviewReviewFilter) => {
    setFilter(nextFilter)
    const nextEntries = filterPreviewReviewQueue(records, nextFilter)
    const stillVisible = currentEntry
      ? nextEntries.some((entry) => entry.key === currentEntry.key)
      : false
    if (!stillVisible && nextEntries[0]) setCurrentEntry(nextEntries[0].key, true)
  }

  const saveAndAdvance = () => {
    if (!currentEntry) return

    const nextRecords = updatePreviewReviewRecord(
      records,
      currentEntry.key,
      draftStatus,
      draftNote,
    )
    const persisted = storePreviewReviewRecords(nextRecords)
    setRecords(nextRecords)
    setStorageWarning(persisted
      ? ''
      : 'This review was updated for the current session, but browser storage is unavailable.')

    const nextVisibleEntries = filterPreviewReviewQueue(nextRecords, filter)
    const retainedIndex = nextVisibleEntries.findIndex((entry) => entry.key === currentEntry.key)
    const destination = retainedIndex >= 0
      ? nextVisibleEntries[retainedIndex + 1]
      : nextVisibleEntries[currentVisibleIndex] ?? nextVisibleEntries[0]

    if (destination) {
      setCurrentEntry(destination.key)
      setAnnouncement(`Saved ${currentEntry.title}. Next: ${destination.title}.`)
    } else {
      setAnnouncement(`Saved ${currentEntry.title}. There are no more previews in this filter.`)
    }
  }

  const resetReview = () => {
    const cleared = clearPreviewReviewRecords()
    const emptyRecords = Object.freeze({}) as PreviewReviewRecords
    setRecords(emptyRecords)
    setFilter('all')
    setResetOpen(false)
    setStorageWarning(cleared
      ? ''
      : 'The in-memory review was reset, but browser storage could not be cleared.')
    if (previewReviewQueue[0]) setCurrentEntry(previewReviewQueue[0].key, true)
    setAnnouncement('All personal preview review decisions and notes were reset.')
  }

  const exportReview = (format: 'markdown' | 'json') => {
    const basename = `scudamores-ui-preview-review-${format === 'markdown' ? 'findings' : 'data'}`
    if (format === 'markdown') {
      downloadText(`${basename}.md`, createPreviewReviewMarkdown(records), 'text/markdown;charset=utf-8')
      setAnnouncement('Markdown review findings downloaded.')
    } else {
      downloadText(`${basename}.json`, createPreviewReviewJson(records), 'application/json;charset=utf-8')
      setAnnouncement('JSON review data downloaded.')
    }
  }

  return (
    <div className="space-y-8">
      <header className="max-w-4xl space-y-3">
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Release evidence
        </p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Preview review
        </h1>
        <p className="font-sans text-base leading-7 text-muted-foreground sm:text-lg">
          Review one live component or pattern at a time. Decisions and notes stay in this browser unless you export them.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-5" aria-labelledby="review-progress-title">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 id="review-progress-title" className="font-sans text-base font-semibold text-foreground">
                  Review progress
                </h2>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  {counts.reviewed} of {counts.total} reviewed · {counts.passed} passed · {counts.flagged} flagged
                </p>
              </div>
              <span className="font-sans text-sm font-semibold text-foreground">{completionPercent}%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label="Preview review completion"
              aria-valuemin={0}
              aria-valuemax={counts.total}
              aria-valuenow={counts.reviewed}
              aria-valuetext={`${counts.reviewed} of ${counts.total} previews reviewed`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Review data actions">
            <Button variant="outline" size="sm" onClick={() => exportReview('markdown')}>
              <FileText aria-hidden />
              Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReview('json')}>
              <FileJson2 aria-hidden />
              JSON
            </Button>
            <Dialog open={resetOpen} onOpenChange={setResetOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <RotateCcw aria-hidden />
                  Reset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset preview review?</DialogTitle>
                  <DialogDescription>
                    This clears every saved Pass, Flagged status, and review note from this browser. Export first if you need a record.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={resetReview}>Reset review</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="mr-1 font-sans text-sm font-medium text-foreground">Show</span>
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              size="sm"
              variant={filter === option.id ? 'secondary' : 'ghost'}
              aria-pressed={filter === option.id}
              onClick={() => selectFilter(option.id)}
            >
              {option.label}
              <span className="text-muted-foreground">{filterCount(option.id, counts)}</span>
            </Button>
          ))}
        </div>
      </section>

      {storageWarning ? (
        <p className="rounded-lg border border-status-warning/40 bg-status-warning/10 px-4 py-3 font-sans text-sm text-foreground" role="alert">
          {storageWarning}
        </p>
      ) : null}

      {currentEntry ? (
        <>
          <section className="space-y-5" aria-labelledby="current-preview-title">
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {currentEntry.kind === 'component' ? 'Component' : 'Pattern'}
                  </Badge>
                  {statusBadge(savedStatus)}
                  {isDirty ? <Badge variant="outline">Unsaved change</Badge> : null}
                </div>
                <h2 id="current-preview-title" className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
                  {currentEntry.title}
                </h2>
                <p className="mt-1 max-w-3xl font-sans text-sm leading-6 text-muted-foreground">
                  {currentEntry.description}
                </p>
                <p className="mt-2 font-sans text-xs text-muted-foreground">
                  Catalogue item {currentQueueIndex + 1} of {previewReviewQueue.length}
                  {filter !== 'all'
                    ? ` · ${currentVisibleIndex + 1} of ${visibleEntries.length} ${filter}`
                    : ''}
                </p>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link to={currentEntry.route}>
                  Open documentation
                  <ExternalLink aria-hidden />
                </Link>
              </Button>
            </div>

            <LivePreview
              key={currentEntry.key}
              kind={currentEntry.kind}
              entryId={currentEntry.id}
              title={currentEntry.title}
              scenarios={currentEntry.scenarios}
              states={currentEntry.states}
            />
          </section>

          <Card>
            <CardHeader>
              <h2 className="font-sans text-lg font-semibold text-foreground">Record your review</h2>
              <p className="font-sans text-sm leading-6 text-muted-foreground">
                A choice is only stored when you use Save &amp; next.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <fieldset>
                <legend className="font-sans text-sm font-semibold text-foreground">Review decision</legend>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {statusOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer gap-3 rounded-lg border border-border p-4 hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent focus-within:ring-2 focus-within:ring-ring"
                    >
                      <input
                        type="radio"
                        name="preview-review-status"
                        value={option.id}
                        checked={draftStatus === option.id}
                        onChange={() => setDraftStatus(option.id)}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="min-w-0">
                        <span className="block font-sans text-sm font-semibold text-foreground">{option.label}</span>
                        <span className="mt-1 block font-sans text-xs leading-5 text-muted-foreground">{option.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {draftStatus === 'flagged' ? (
                <div className="space-y-2">
                  <label htmlFor="preview-review-note" className="font-sans text-sm font-semibold text-foreground">
                    Flag note <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="preview-review-note"
                    value={draftNote}
                    maxLength={PREVIEW_REVIEW_NOTE_LIMIT}
                    rows={3}
                    onChange={(event) => setDraftNote(event.target.value)}
                    aria-describedby="preview-review-note-help preview-review-note-count"
                    placeholder="Briefly describe what looks or behaves incorrectly."
                    className="w-full resize-y rounded-lg border border-input bg-input-background px-3 py-2 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                  />
                  <div className="flex flex-wrap justify-between gap-2 font-sans text-xs text-muted-foreground">
                    <p id="preview-review-note-help">Stored only in this browser until exported.</p>
                    <p id="preview-review-note-count">{draftNote.length}/{PREVIEW_REVIEW_NOTE_LIMIT}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigateTo(currentVisibleIndex - 1)}
                    disabled={currentVisibleIndex <= 0}
                  >
                    <ArrowLeft aria-hidden />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigateTo(currentVisibleIndex + 1)}
                    disabled={currentVisibleIndex < 0 || currentVisibleIndex >= visibleEntries.length - 1}
                  >
                    Next
                    <ArrowRight aria-hidden />
                  </Button>
                </div>
                <Button onClick={saveAndAdvance}>
                  {draftStatus === 'flagged' ? <Flag aria-hidden /> : <CheckCircle2 aria-hidden />}
                  Save &amp; next
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <section className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center" aria-labelledby="empty-review-filter">
          <CheckCircle2 className="mx-auto size-6 text-muted-foreground" aria-hidden />
          <h2 id="empty-review-filter" className="mt-3 font-sans text-lg font-semibold text-foreground">
            No {filter} previews
          </h2>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Change the filter to continue reviewing or export the current findings.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => selectFilter('all')}>
            Show all previews
          </Button>
        </section>
      )}

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>

      <footer className="flex flex-wrap items-center gap-2 border-t border-border pt-5 font-sans text-xs text-muted-foreground">
        <Download className="size-4" aria-hidden />
        Review data is personal to this browser and does not modify the component catalogue or source files.
      </footer>
    </div>
  )
}
