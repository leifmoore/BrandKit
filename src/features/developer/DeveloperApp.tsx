import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  COMPONENT_PREVIEW_IDS,
  LivePreview,
  RECIPE_PREVIEW_IDS,
} from './preview'
import {
  allCatalogEntries,
  assertDeveloperCatalogValid,
  catalogCounts,
  components,
  deferredComponents,
  foundations,
  getComponent,
  getComponentOrDeferred,
  getDeferredComponent,
  getDocumentationSource,
  getEntrySources,
  getFoundation,
  getHandoffSources,
  getRecipe,
  handoffCatalog,
  recipes,
  type ComponentCatalogEntry,
  type FoundationCatalogEntry,
  type HandoffSource,
  type RecipeCatalogEntry,
} from './catalog'
import {
  CatalogOverviewPage,
  CollectionPage,
  ComponentPage,
  DeferredPage,
  FoundationPage,
  RecipePage,
} from './pages'
import { PageState, type CatalogEntryViewModel } from './docs'
import {
  toCatalogEntryViewModel,
  toCatalogOverviewViewModel,
  toComponentViewModel,
  toDeferredViewModel,
  toFoundationViewModel,
  toRecipeViewModel,
  toSourceViewModels,
} from './viewModels'

type DocumentedEntry =
  | ComponentCatalogEntry
  | RecipeCatalogEntry
  | FoundationCatalogEntry

const buttonPreviewStates = getComponent('button')?.manifest.previews[0]?.states ?? ['default']

function assertPreviewRegistryCoverage() {
  const componentIds = new Set(components.map((entry) => entry.id))
  const recipeIds = new Set(recipes.map((entry) => entry.id))
  const registeredComponentIds = new Set(COMPONENT_PREVIEW_IDS)
  const registeredRecipeIds = new Set(RECIPE_PREVIEW_IDS)
  const missing = [
    ...components.filter((entry) => !registeredComponentIds.has(entry.id)).map((entry) => `component:${entry.id}`),
    ...recipes.filter((entry) => !registeredRecipeIds.has(entry.id)).map((entry) => `recipe:${entry.id}`),
  ]
  const unexpected = [
    ...COMPONENT_PREVIEW_IDS.filter((id) => !componentIds.has(id)).map((id) => `component:${id}`),
    ...RECIPE_PREVIEW_IDS.filter((id) => !recipeIds.has(id)).map((id) => `recipe:${id}`),
  ]

  if (missing.length || unexpected.length) {
    throw new Error(
      `Design System preview registry does not match the catalog. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`,
    )
  }
}

assertDeveloperCatalogValid()
assertPreviewRegistryCoverage()

interface EntryResources {
  entryKey: string
  loading: boolean
  documentation?: string
  sources: readonly HandoffSource[]
  error?: Error
}

function useEntryResources(entry: DocumentedEntry): EntryResources {
  const [state, setState] = useState<EntryResources>({
    entryKey: entry.key,
    loading: true,
    sources: [],
  })

  useEffect(() => {
    let active = true
    setState({ entryKey: entry.key, loading: true, sources: [] })

    void Promise.all([
      getDocumentationSource(entry),
      getEntrySources(entry),
    ])
      .then(([documentation, sources]) => {
        if (!active) return
        setState({
          entryKey: entry.key,
          loading: false,
          documentation: documentation.content,
          sources,
        })
      })
      .catch((cause: unknown) => {
        if (!active) return
        setState({
          entryKey: entry.key,
          loading: false,
          sources: [],
          error: cause instanceof Error ? cause : new Error(String(cause)),
        })
      })

    return () => {
      active = false
    }
  }, [entry])

  return state.entryKey === entry.key
    ? state
    : { entryKey: entry.key, loading: true, sources: [] }
}

function ResourceState({
  state,
  children,
}: {
  state: EntryResources
  children: (resources: EntryResources & { loading: false }) => React.ReactNode
}) {
  if (state.loading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading Design System documentation">
        <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="mt-10 h-72 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (state.error) {
    return (
      <PageState
        kind="error"
        title="Documentation could not load"
        description={state.error.message}
        actionLabel="Reload"
        onAction={() => window.location.reload()}
      />
    )
  }

  return <>{children({ ...state, loading: false })}</>
}

function ComponentRoute() {
  const { componentId = '' } = useParams()
  const location = useLocation()
  const entry = getComponentOrDeferred(componentId)

  if (!entry) return <NotFound />
  if (entry.kind === 'deferred') {
    return (
      <Navigate
        to={{ pathname: entry.route, search: location.search, hash: location.hash }}
        replace
      />
    )
  }
  return <SupportedComponentRoute entry={entry} />
}

function DeferredRoute() {
  const { deferredId = '' } = useParams()
  const entry = getDeferredComponent(deferredId)
  return entry ? <DeferredPage item={toDeferredViewModel(entry)} /> : <NotFound />
}

function SupportedComponentRoute({ entry }: { entry: ComponentCatalogEntry }) {
  const resources = useEntryResources(entry)
  return (
    <ResourceState state={resources}>
      {({ documentation, sources }) => (
        <ComponentPage
          component={toComponentViewModel(entry, documentation)}
          preview={
            <LivePreview
              key={entry.key}
              entryId={entry.id}
              title={entry.title}
              states={entry.manifest.previews[0]?.states}
            />
          }
          sources={toSourceViewModels(sources, entry.copyable)}
        />
      )}
    </ResourceState>
  )
}

function RecipeRoute() {
  const { recipeId = '' } = useParams()
  const entry = getRecipe(recipeId)
  if (!entry) return <NotFound />
  return <SupportedRecipeRoute entry={entry} />
}

function SupportedRecipeRoute({ entry }: { entry: RecipeCatalogEntry }) {
  const resources = useEntryResources(entry)
  return (
    <ResourceState state={resources}>
      {({ documentation, sources }) => (
        <RecipePage
          recipe={toRecipeViewModel(entry, documentation)}
          preview={<LivePreview key={entry.key} kind="recipe" entryId={entry.id} title={entry.title} />}
          sources={toSourceViewModels(sources, entry.copyable)}
        />
      )}
    </ResourceState>
  )
}

function FoundationRoute() {
  const { foundationId = '' } = useParams()
  const entry = getFoundation(foundationId === 'themes' ? 'brands' : foundationId)
  if (!entry) return <NotFound />
  return <SupportedFoundationRoute entry={entry} />
}

function SupportedFoundationRoute({ entry }: { entry: FoundationCatalogEntry }) {
  const resources = useEntryResources(entry)
  const themePreview = entry.id === 'tokens' || entry.id === 'brands'
    ? <LivePreview entryId="button" title={entry.title + ' theme preview'} states={buttonPreviewStates} />
    : undefined

  return (
    <ResourceState state={resources}>
      {({ documentation, sources }) => (
        <FoundationPage
          foundation={entry.id === 'brands'
            ? {
                ...toFoundationViewModel(entry, documentation),
                id: 'themes',
                title: 'Themes',
                description: 'Theme modes and accent presets for supported Design System components.',
              }
            : toFoundationViewModel(entry, documentation)}
          preview={themePreview}
          sources={toSourceViewModels(sources, entry.copyable)}
        />
      )}
    </ResourceState>
  )
}

function OverviewRoute() {
  const navigate = useNavigate()
  const [installation, setInstallation] = useState<string>()

  useEffect(() => {
    let active = true
    void getHandoffSources(['START-HERE.md'])
      .then((sources) => {
        if (active) setInstallation(sources[0]?.content)
      })
      .catch(() => {
        // Installation guidance is optional on the overview. Entry routes
        // surface their own source-loading failures explicitly.
        if (active) setInstallation(undefined)
      })
    return () => {
      active = false
    }
  }, [])

  const catalog = toCatalogOverviewViewModel(
    allCatalogEntries,
    catalogCounts,
    handoffCatalog.version,
    handoffCatalog.name,
    installation,
  )

  const go = (entry: CatalogEntryViewModel) => navigate(entry.href)

  return (
    <CatalogOverviewPage
      catalog={catalog}
      onEntryNavigate={go}
      preview={<LivePreview entryId="button" title="Theme playground" states={buttonPreviewStates} />}
    />
  )
}

function CollectionRoute({ kind }: { kind: 'components' | 'patterns' | 'foundations' | 'roadmap' }) {
  const navigate = useNavigate()
  const entries = kind === 'components'
    ? components
    : kind === 'patterns'
      ? recipes
      : kind === 'foundations'
        ? foundations
        : deferredComponents

  const content = {
    components: ['Components', 'Reusable React and Blade primitives with interactive previews and exact source files.'],
    patterns: ['Patterns', 'Fixture-driven compositions built from supported Design System components.'],
    foundations: ['Foundations', 'Tokens, themes, typography, layout, icons, accessibility, and implementation guidance.'],
    roadmap: ['Roadmap', 'Inventoried candidates that remain unavailable until their production and design evidence is complete.'],
  } as const

  return (
    <CollectionPage
      eyebrow={kind === 'roadmap' ? 'Design System roadmap' : 'Design System catalogue'}
      title={content[kind][0]}
      description={content[kind][1]}
      entries={entries.map(toCatalogEntryViewModel)}
      kind={kind}
      onEntryNavigate={(entry) => navigate(entry.href)}
    />
  )
}

function NotFound() {
  return (
    <PageState
      kind="empty"
      title="Design System page not found"
      description="This route does not match a supported component, pattern, foundation, or deferred inventory record."
    />
  )
}

function ManageDeveloperRouteFocus({ contentRef }: { contentRef: RefObject<HTMLDivElement> }) {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) document.querySelector('main')?.scrollTo({ top: 0 })

    let focusedTarget: HTMLElement | null = null
    let previousTabIndex: string | null = null
    const focusDestination = () => {
      const anchor = hash.startsWith('#') ? hash.slice(1) : ''
      const candidateAnchorTarget = anchor ? document.getElementById(anchor) : null
      const anchorTarget = candidateAnchorTarget && contentRef.current?.contains(candidateAnchorTarget)
        ? candidateAnchorTarget
        : null
      const target = anchorTarget ?? contentRef.current?.querySelector<HTMLElement>('h1')
      if (!target) return false

      focusedTarget = target
      previousTabIndex = target.getAttribute('tabindex')
      target.setAttribute('data-route-focus', '')
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: Boolean(anchorTarget) })
      anchorTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }

    const observer = new MutationObserver(() => {
      if (focusDestination()) observer.disconnect()
    })
    const frame = window.requestAnimationFrame(() => {
      if (!focusDestination() && contentRef.current) {
        observer.observe(contentRef.current, { childList: true, subtree: true })
      }
    })

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      if (focusedTarget?.isConnected) {
        focusedTarget.removeAttribute('data-route-focus')
        if (previousTabIndex === null) focusedTarget.removeAttribute('tabindex')
        else focusedTarget.setAttribute('tabindex', previousTabIndex)
      }
    }
  }, [contentRef, hash, pathname])

  return null
}

export default function DeveloperApp() {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <ManageDeveloperRouteFocus contentRef={contentRef} />
      <div ref={contentRef} className="min-w-0" data-developer-route-content>
        <Routes>
          <Route index element={<OverviewRoute />} />
          <Route path="components/:componentId" element={<ComponentRoute />} />
          <Route path="patterns/:recipeId" element={<RecipeRoute />} />
          <Route path="foundations/:foundationId" element={<FoundationRoute />} />
          <Route path="roadmap/:deferredId" element={<DeferredRoute />} />
          <Route path="components" element={<CollectionRoute kind="components" />} />
          <Route path="patterns" element={<CollectionRoute kind="patterns" />} />
          <Route path="foundations" element={<CollectionRoute kind="foundations" />} />
          <Route path="roadmap" element={<CollectionRoute kind="roadmap" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="mt-12 border-t border-border pt-6 font-sans text-xs text-muted-foreground">
          <Link to="/design-system" className="font-medium text-foreground hover:underline">Scudamore&apos;s UI {handoffCatalog.version}</Link>
          {' · '}Copy-only distribution · React previews · Blade source
        </footer>
      </div>
    </div>
  )
}
