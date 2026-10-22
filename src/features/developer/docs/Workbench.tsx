import { useMemo, useState, type ReactNode } from 'react'
import { Eye, FileCode2, FileJson2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SourceActions } from './SourceActions'
import { SourceViewer } from './SourceViewer'
import { DocumentationSheet, type DocumentationSection } from './DocumentationSheet'
import type { SourceFileViewModel, SourceFramework } from './types'

export type { DocumentationSection } from './DocumentationSheet'

type WorkbenchView = 'preview' | 'react' | 'blade' | 'fixture'

const WORKBENCH_VIEW_KEY = 'scudamores.design-system.workbench-view.v1'
const workbenchViews = new Set<WorkbenchView>(['preview', 'react', 'blade', 'fixture'])

function readStoredView(): WorkbenchView {
  try {
    const stored = window.localStorage.getItem(WORKBENCH_VIEW_KEY)
    return stored && workbenchViews.has(stored as WorkbenchView)
      ? stored as WorkbenchView
      : 'preview'
  } catch {
    return 'preview'
  }
}

function storeView(view: WorkbenchView) {
  try {
    window.localStorage.setItem(WORKBENCH_VIEW_KEY, view)
  } catch {
    // A first-party preference is optional when storage is unavailable.
  }
}

function parseView(value: string | null): WorkbenchView | undefined {
  return value && workbenchViews.has(value as WorkbenchView)
    ? value as WorkbenchView
    : undefined
}

function usageRank(file: SourceFileViewModel) {
  if (file.kind === 'example' || /\/examples?\//.test(file.path)) return 0
  if (/Recipe\.(tsx|ts)$/.test(file.path) || file.kind === 'implementation') return 1
  if (file.kind === 'data') return 2
  return 3
}

function frameworkSources(files: readonly SourceFileViewModel[], framework: SourceFramework) {
  return files
    .filter((file) => file.framework === framework)
    .slice()
    .sort((left, right) => usageRank(left) - usageRank(right))
}

export interface WorkbenchProps {
  title: string
  preview?: ReactNode
  sources: readonly SourceFileViewModel[]
  documentation: readonly DocumentationSection[]
}

export function Workbench({ title, preview, sources, documentation }: WorkbenchProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [storedView, setStoredView] = useState<WorkbenchView>(readStoredView)
  const reactSources = useMemo(() => frameworkSources(sources, 'react'), [sources])
  const bladeSources = useMemo(() => frameworkSources(sources, 'blade'), [sources])
  const fixtureSources = useMemo(
    () => sources.filter((file) => file.kind === 'fixture'),
    [sources],
  )
  const requestedView = parseView(searchParams.get('view')) ?? storedView
  const activeView = requestedView === 'fixture' && fixtureSources.length === 0
    ? 'preview'
    : requestedView

  const changeView = (value: string) => {
    const view = parseView(value)
    if (!view) return
    setStoredView(view)
    storeView(view)
    const next = new URLSearchParams(searchParams)
    next.set('view', view)
    setSearchParams(next, { replace: true })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card" aria-label={`${title} workbench`}>
      <Tabs value={activeView} onValueChange={changeView} className="gap-0">
        <div className="flex flex-col gap-3 border-b border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList aria-label="Workbench view" className="w-full justify-start sm:w-auto">
            <TabsTrigger value="preview">
              <Eye aria-hidden="true" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="react">
              <FileCode2 aria-hidden="true" />
              React
            </TabsTrigger>
            <TabsTrigger value="blade">
              <FileCode2 aria-hidden="true" />
              Blade
            </TabsTrigger>
            {fixtureSources.length > 0 ? (
              <TabsTrigger value="fixture">
                <FileJson2 aria-hidden="true" />
                Fixture / example
              </TabsTrigger>
            ) : null}
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <SourceActions files={sources} />
            <DocumentationSheet title={title} sections={documentation} />
          </div>
        </div>

        <TabsContent value="preview" className="m-0 p-2 sm:p-4">
          {preview ?? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground" role="status">
              A live preview is not available for this entry. Its source and contracts remain available.
            </div>
          )}
        </TabsContent>
        <TabsContent value="react" className="m-0 p-3 sm:p-4">
          <p className="mb-3 text-xs leading-5 text-muted-foreground">Usage examples appear before implementation files. Source is displayed exactly as supplied.</p>
          <SourceViewer files={reactSources} allowActions={false} />
        </TabsContent>
        <TabsContent value="blade" className="m-0 p-3 sm:p-4">
          <p className="mb-3 text-xs leading-5 text-muted-foreground">Usage examples appear before implementation files. Source is displayed exactly as supplied.</p>
          <SourceViewer files={bladeSources} allowActions={false} />
        </TabsContent>
        {fixtureSources.length > 0 ? (
          <TabsContent value="fixture" className="m-0 p-3 sm:p-4">
            <p className="mb-3 text-xs leading-5 text-muted-foreground">
              Scenario fixtures are displayed exactly from the files declared by the pattern manifest.
            </p>
            <SourceViewer files={fixtureSources} allowActions={false} />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  )
}
