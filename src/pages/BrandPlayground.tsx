import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Download, FlaskConical, RotateCcw, Save, Trash2 } from 'lucide-react'
import { SectionSubNav } from '@/components/layout/SectionSubNav'
import { CopyButton } from '@/components/shared/CopyButton'
import { PageHeader } from '@/components/shared/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { BrandPreview } from '@/features/brand-playground/BrandPreview'
import {
  LOCKED_BRAND_COLOURS,
  PLAYGROUND_ACCENTS,
  getAccent,
} from '@/features/brand-playground/palette'
import {
  DEFAULT_BRAND_PLAYGROUND_CONFIG,
  createBrandPlaygroundCss,
  createBrandPlaygroundJson,
  createSavedBrandCandidate,
  getDerivedBrandPlaygroundTokens,
  readBrandPlaygroundDraft,
  readSavedBrandCandidates,
  sanitizeBrandPlaygroundConfig,
  storeBrandPlaygroundDraft,
  storeSavedBrandCandidates,
  type BrandPlaygroundConfig,
  type SavedBrandCandidate,
} from '@/features/brand-playground/playgroundState'
import { checkContrast, hexToRgb } from '@/lib/wcag'
import { cn } from '@/lib/utils'

const SUB_NAV = [
  { label: 'Workbench', anchor: 'workbench' },
  { label: 'Saved candidates', anchor: 'saved-candidates' },
  { label: 'Export', anchor: 'playground-export' },
]

interface RangeControlProps {
  readonly id: string
  readonly label: string
  readonly value: number
  readonly minimum: number
  readonly maximum: number
  readonly suffix?: string
  readonly description: string
  readonly onChange: (value: number) => void
}

function RangeControl({
  id,
  label,
  value,
  minimum,
  maximum,
  suffix = '%',
  description,
  onChange,
}: RangeControlProps) {
  const descriptionId = `${id}-description`
  const labelId = `${id}-label`
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label id={labelId}>{label}</Label>
        <output htmlFor={id} className="font-mono text-xs text-muted-foreground">
          {value}{suffix}
        </output>
      </div>
      <Slider
        id={id}
        min={minimum}
        max={maximum}
        step={1}
        value={[value]}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onValueChange={(values) => onChange(values[0] ?? value)}
      />
      <p id={descriptionId} className="font-sans text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function ToggleGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-sans text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function BrandPlayground() {
  const [config, setConfig] = useState<BrandPlaygroundConfig>(() => readBrandPlaygroundDraft())
  const [candidateName, setCandidateName] = useState('Warm river glass')
  const [savedCandidates, setSavedCandidates] = useState<readonly SavedBrandCandidate[]>(() => readSavedBrandCandidates())
  const [announcement, setAnnouncement] = useState('')
  const [storageWarning, setStorageWarning] = useState('')

  const accent = getAccent(config.accentId)
  const tokens = useMemo(() => getDerivedBrandPlaygroundTokens(config), [config])
  const accentOnNavy = checkContrast(hexToRgb(tokens.accent), hexToRgb(tokens.navy))
  const navyOnAccent = checkContrast(hexToRgb(tokens.navy), hexToRgb(tokens.accent))
  const cssExport = useMemo(
    () => createBrandPlaygroundCss(candidateName, config),
    [candidateName, config],
  )
  const jsonExport = useMemo(
    () => createBrandPlaygroundJson(candidateName, config),
    [candidateName, config],
  )

  useEffect(() => {
    const persisted = storeBrandPlaygroundDraft(config)
    setStorageWarning(persisted
      ? ''
      : 'Draft settings are available for this session, but browser storage is unavailable.')
  }, [config])

  const updateConfig = <Key extends keyof BrandPlaygroundConfig>(
    key: Key,
    value: BrandPlaygroundConfig[Key],
  ) => {
    setConfig((current) => sanitizeBrandPlaygroundConfig({ ...current, [key]: value }))
  }

  const resetDraft = () => {
    setConfig(DEFAULT_BRAND_PLAYGROUND_CONFIG)
    setAnnouncement('Playground settings reset to the warm river glass starting point.')
  }

  const saveCandidate = () => {
    const candidate = createSavedBrandCandidate(candidateName, config)
    const next = [candidate, ...savedCandidates].slice(0, 12)
    setSavedCandidates(next)
    setStorageWarning(storeSavedBrandCandidates(next)
      ? ''
      : 'The candidate is available for this session, but browser storage is unavailable.')
    setAnnouncement(`${candidate.name} saved as an experimental candidate.`)
  }

  const loadCandidate = (candidate: SavedBrandCandidate) => {
    setConfig(candidate.config)
    setCandidateName(candidate.name)
    setAnnouncement(`${candidate.name} loaded into the playground.`)
  }

  const deleteCandidate = (candidate: SavedBrandCandidate) => {
    const next = savedCandidates.filter((item) => item.id !== candidate.id)
    setSavedCandidates(next)
    setStorageWarning(storeSavedBrandCandidates(next)
      ? ''
      : 'The candidate was removed for this session, but browser storage is unavailable.')
    setAnnouncement(`${candidate.name} deleted.`)
  }

  const exportCandidate = (format: 'css' | 'json') => {
    const slug = (candidateName.trim() || 'brand-playground-draft')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    if (format === 'css') {
      downloadText(`${slug}.css`, cssExport, 'text/css;charset=utf-8')
      setAnnouncement('Experimental CSS tokens downloaded.')
    } else {
      downloadText(`${slug}.json`, jsonExport, 'application/json;charset=utf-8')
      setAnnouncement('Experimental JSON candidate downloaded.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Brand digital expression"
        title="Brand Playground"
        description="Workshop future website expression against real Scudamore’s photography. Adjust, compare, save, and export experiments without changing the software Design System or approving new Brand tokens."
        badges={(
          <>
            <Badge variant="warning" dot>Experimental</Badge>
            <Badge variant="outline">Local drafts</Badge>
          </>
        )}
      />

      <SectionSubNav items={SUB_NAV} />

      <aside className="mb-8 rounded-lg border border-border bg-muted/30 p-4" aria-labelledby="playground-boundary-heading">
        <h2 id="playground-boundary-heading" className="font-sans text-sm font-semibold text-foreground">
          Exploration boundary
        </h2>
        <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
          Deep Navy and Off-White are locked identity anchors. Everything else on this page is experimental website expression. Saving or exporting a candidate does not modify Brand guidance, canonical components, semantic application tokens, or the immutable handoff.
        </p>
      </aside>

      <section id="workbench" className="scroll-mt-6" aria-labelledby="workbench-heading">
        <div className="mb-5">
          <h2 id="workbench-heading" className="font-sans text-2xl font-semibold text-foreground">Live workbench</h2>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            The preview swaps between dedicated landscape and portrait photography when you change its viewport.
          </p>
        </div>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <Card className="h-fit gap-0">
            <CardHeader className="border-b border-border pb-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-foreground">Expression controls</h3>
                  <p className="mt-1 font-sans text-xs leading-5 text-muted-foreground">Draft changes save automatically in this browser.</p>
                </div>
                <FlaskConical className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent className="space-y-7 pt-6">
              <ToggleGroup label="Preview pattern">
                {[
                  { id: 'booking-hero', label: 'Booking hero' },
                  { id: 'product-feature', label: 'Product feature' },
                ].map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={config.pattern === option.id ? 'default' : 'outline'}
                    aria-pressed={config.pattern === option.id}
                    onClick={() => updateConfig('pattern', option.id as BrandPlaygroundConfig['pattern'])}
                  >
                    {option.label}
                  </Button>
                ))}
              </ToggleGroup>

              <ToggleGroup label="Preview viewport">
                {[
                  { id: 'desktop', label: 'Landscape' },
                  { id: 'mobile', label: 'Portrait' },
                ].map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={config.viewport === option.id ? 'default' : 'outline'}
                    aria-pressed={config.viewport === option.id}
                    onClick={() => updateConfig('viewport', option.id as BrandPlaygroundConfig['viewport'])}
                  >
                    {option.label}
                  </Button>
                ))}
              </ToggleGroup>

              <ToggleGroup label="Frosted card">
                {[
                  { id: 'navy', label: 'Navy glass' },
                  { id: 'white', label: 'White glass' },
                ].map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={config.glassTone === option.id ? 'default' : 'outline'}
                    aria-pressed={config.glassTone === option.id}
                    onClick={() => updateConfig('glassTone', option.id as BrandPlaygroundConfig['glassTone'])}
                  >
                    {option.label}
                  </Button>
                ))}
              </ToggleGroup>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">Preview across Brand workspace</p>
                    <p className="mt-1 font-sans text-xs leading-5 text-muted-foreground">
                      Applies this draft to Brand primary actions and authored accent cues. Design System and semantic status colours remain unchanged.
                    </p>
                  </div>
                  <Badge variant={config.applyToBrandWorkspace ? 'success' : 'outline'}>
                    {config.applyToBrandWorkspace ? 'On' : 'Off'}
                  </Badge>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={config.applyToBrandWorkspace ? 'default' : 'outline'}
                  className="mt-3 w-full"
                  aria-pressed={config.applyToBrandWorkspace}
                  onClick={() => updateConfig('applyToBrandWorkspace', !config.applyToBrandWorkspace)}
                >
                  {config.applyToBrandWorkspace ? 'Stop workspace preview' : 'Apply draft to Brand'}
                </Button>
              </div>

              <fieldset>
                <legend className="font-sans text-sm font-medium text-foreground">Locked anchors</legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { name: 'Deep Navy', value: LOCKED_BRAND_COLOURS.navy },
                    { name: 'Off-White', value: LOCKED_BRAND_COLOURS.white },
                  ].map((colour) => (
                    <div key={colour.name} className="rounded-lg border border-border p-2">
                      <span className="block h-9 rounded-md border border-black/10" style={{ backgroundColor: colour.value }} />
                      <p className="mt-2 font-sans text-xs font-medium text-foreground">{colour.name}</p>
                      <p className="font-mono text-[0.6875rem] text-muted-foreground">{colour.value}</p>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-sans text-sm font-medium text-foreground">Experimental accent</legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {PLAYGROUND_ACCENTS.map((option) => {
                    const selected = config.accentId === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-label={`${option.name}, ${option.sourceHex}`}
                        aria-pressed={selected}
                        title={`${option.name} · ${option.sourceHex}`}
                        onClick={() => updateConfig('accentId', option.id)}
                        className={cn(
                          'rounded-lg border p-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          selected ? 'border-foreground bg-accent' : 'border-border bg-card hover:bg-muted',
                        )}
                      >
                        <span className="block h-9 rounded-md border border-black/10" style={{ backgroundColor: option.sourceHex }} />
                        <span className="mt-1.5 block truncate font-sans text-[0.6875rem] text-foreground">{option.name}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 font-sans text-xs leading-5 text-muted-foreground">
                  {accent.note} · sampled source {accent.sourceHex}
                </p>
              </fieldset>

              <ToggleGroup label="Accent treatment">
                {[
                  { id: 'solid', label: 'Solid' },
                  { id: 'grainy-gradient', label: 'Grainy gradient' },
                ].map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="sm"
                    variant={config.accentTreatment === option.id ? 'default' : 'outline'}
                    aria-pressed={config.accentTreatment === option.id}
                    onClick={() => updateConfig('accentTreatment', option.id as BrandPlaygroundConfig['accentTreatment'])}
                  >
                    {option.label}
                  </Button>
                ))}
              </ToggleGroup>

              {config.accentTreatment === 'grainy-gradient' ? (
                <div className="space-y-7 rounded-lg border border-border bg-muted/30 p-4">
                  <RangeControl
                    id="accent-gradient-spread"
                    label="Gradient range"
                    value={config.accentGradientSpread}
                    minimum={0}
                    maximum={100}
                    description="Controls the tonal distance between the selected accent and its lighter endpoint without introducing another hue."
                    onChange={(value) => updateConfig('accentGradientSpread', value)}
                  />
                  <RangeControl
                    id="accent-grain"
                    label="Accent grain"
                    value={config.accentGrain}
                    minimum={0}
                    maximum={40}
                    description="Adds deterministic texture to gradient buttons, labels, and authored accent surfaces."
                    onChange={(value) => updateConfig('accentGrain', value)}
                  />
                </div>
              ) : null}

              <RangeControl
                id="blue-intensity"
                label="Blue depth"
                value={config.blueIntensity}
                minimum={0}
                maximum={100}
                description="Moves the expressive blue between Water Powder and its darker River Dusk bridge without changing Deep Navy."
                onChange={(value) => updateConfig('blueIntensity', value)}
              />
              <RangeControl
                id="accent-intensity"
                label="Accent intensity"
                value={config.accentIntensity}
                minimum={0}
                maximum={100}
                description="Softens the sampled accent toward Off-White while retaining its hue family."
                onChange={(value) => updateConfig('accentIntensity', value)}
              />
              <RangeControl
                id="canvas-warmth"
                label="Canvas warmth"
                value={config.canvasWarmth}
                minimum={0}
                maximum={100}
                description="Moves the preview surround from Off-White toward the existing light Cream."
                onChange={(value) => updateConfig('canvasWarmth', value)}
              />
              <RangeControl
                id="glass-opacity"
                label="Frosted card opacity"
                value={config.glassOpacity}
                minimum={0}
                maximum={100}
                description="Moves from fully transparent at 0% to fully opaque at 100%. Check every low-opacity candidate against its actual photograph before production use."
                onChange={(value) => updateConfig('glassOpacity', value)}
              />
              {config.glassOpacity < 60 ? (
                <p className="-mt-4 rounded-md border border-status-warning/35 bg-status-warning/10 p-3 font-sans text-xs leading-5 text-status-warning-foreground" role="note">
                  Low card opacity can make copy depend on the photograph beneath it. Treat this as visual exploration until contrast is checked against every responsive crop.
                </p>
              ) : null}
              <RangeControl
                id="glass-blur"
                label="Glass blur"
                value={config.glassBlur}
                minimum={0}
                maximum={28}
                suffix="px"
                description="Controls backdrop blur; the tinted opaque fallback remains when blur is unavailable."
                onChange={(value) => updateConfig('glassBlur', value)}
              />
              <RangeControl
                id="gradient-strength"
                label="Image colour wash"
                value={config.gradientStrength}
                minimum={0}
                maximum={60}
                description="Adds the existing restrained accent bloom over photography. This is independent from the accent treatment above."
                onChange={(value) => updateConfig('gradientStrength', value)}
              />
              <RangeControl
                id="grain"
                label="Image grain"
                value={config.grain}
                minimum={0}
                maximum={40}
                description="Adds deterministic SVG noise to the photographic atmosphere; zero removes it and no raster texture is downloaded."
                onChange={(value) => updateConfig('grain', value)}
              />

              <Button type="button" variant="outline" className="w-full" onClick={resetDraft}>
                <RotateCcw aria-hidden="true" /> Reset starting point
              </Button>
            </CardContent>
          </Card>

          <div className="min-w-0 xl:self-stretch">
            <div className="space-y-4 xl:sticky xl:top-4" data-playground-preview-dock>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-foreground">Adaptive preview</h3>
                  <p className="mt-1 font-sans text-xs text-muted-foreground">
                    {config.pattern === 'booking-hero' ? 'Booking hero' : 'Product feature'} · {config.viewport === 'mobile' ? 'portrait' : 'landscape'}
                  </p>
                </div>
                <Badge variant="outline">
                  {accent.name} · {config.accentTreatment === 'grainy-gradient' ? 'grainy gradient' : 'solid'} · {config.glassTone} glass
                </Badge>
              </div>
              <div role="region" aria-label="Brand expression preview" aria-live="polite">
                <BrandPreview config={config} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6" aria-label="Current derived tokens">
          {[
            { label: 'Navy · locked', value: tokens.navy },
            { label: 'White · locked', value: tokens.white },
            { label: 'Expression blue', value: tokens.expressionBlue },
            { label: 'Derived accent', value: tokens.accent },
            {
              label: 'Accent surface',
              value: config.accentTreatment === 'grainy-gradient'
                ? `${tokens.accentSurface} → ${tokens.accentGradientEnd}`
                : tokens.accentSurface,
              treatment: true,
            },
            { label: 'Canvas', value: tokens.canvas },
          ].map((token) => (
            <Card key={token.label} className="gap-0">
              <CardContent className="p-3">
                <span
                  className="block h-10 rounded-md border border-black/10"
                  style={token.treatment && config.accentTreatment === 'grainy-gradient'
                    ? {
                        backgroundColor: tokens.accentSurface,
                        backgroundImage: `${tokens.accentGrainTexture}, ${tokens.accentGradient}`,
                        backgroundBlendMode: 'soft-light, normal',
                        backgroundSize: '140px 140px, 100% 100%',
                      }
                    : { backgroundColor: token.value }}
                />
                <p className="mt-2 font-sans text-xs font-medium text-foreground">{token.label}</p>
                <p className="mt-0.5 font-mono text-[0.6875rem] text-muted-foreground">{token.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-4 font-sans text-xs leading-5 text-muted-foreground">
          Contrast reference: Navy on the current accent is {navyOnAccent.ratioDisplay}; the accent on Navy is {accentOnNavy.ratioDisplay}. Preview buttons automatically choose the more readable locked text anchor.
        </p>
      </section>

      <section id="saved-candidates" className="scroll-mt-6 pt-14" aria-labelledby="saved-heading">
        <div className="mb-5">
          <h2 id="saved-heading" className="font-sans text-2xl font-semibold text-foreground">Saved candidates</h2>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            Save up to twelve named snapshots in this browser. Loading a snapshot replaces the current draft controls.
          </p>
        </div>
        <Card className="gap-0">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="candidate-name">Candidate name</Label>
                <Input
                  id="candidate-name"
                  maxLength={60}
                  value={candidateName}
                  onChange={(event) => setCandidateName(event.target.value)}
                />
              </div>
              <Button type="button" onClick={saveCandidate}>
                <Save aria-hidden="true" /> Save snapshot
              </Button>
            </div>

            {savedCandidates.length ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {savedCandidates.map((candidate) => {
                  const savedTokens = getDerivedBrandPlaygroundTokens(candidate.config)
                  return (
                    <li key={candidate.id}>
                      <Card className="h-full gap-0">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-sans text-sm font-semibold text-foreground">{candidate.name}</h3>
                              <p className="mt-1 font-sans text-xs text-muted-foreground">
                                {candidate.config.pattern === 'booking-hero' ? 'Booking hero' : 'Product feature'} · {getAccent(candidate.config.accentId).name}
                              </p>
                            </div>
                            <div className="flex gap-1" aria-hidden="true">
                              {[savedTokens.navy, savedTokens.expressionBlue, savedTokens.accent, savedTokens.canvas].map((colour) => (
                                <span key={colour} className="size-5 rounded-full border border-black/10" style={{ backgroundColor: colour }} />
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => loadCandidate(candidate)}>Load</Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              aria-label={`Delete ${candidate.name}`}
                              onClick={() => deleteCandidate(candidate)}
                            >
                              <Trash2 aria-hidden="true" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-border p-5 text-center font-sans text-sm text-muted-foreground">
                No named candidates yet. The current draft still saves automatically.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section id="playground-export" className="scroll-mt-6 pt-14" aria-labelledby="export-heading">
        <div className="mb-5">
          <h2 id="export-heading" className="font-sans text-2xl font-semibold text-foreground">Export experimental settings</h2>
          <p className="mt-1 font-sans text-sm leading-6 text-muted-foreground">
            JSON preserves the complete playground state. CSS exports only derived custom properties with an explicit experimental warning.
          </p>
        </div>
        <Card className="gap-0">
          <CardContent className="flex flex-wrap items-center gap-3 p-5 sm:p-6">
            <Button type="button" onClick={() => exportCandidate('json')}>
              <Download aria-hidden="true" /> Download JSON
            </Button>
            <Button type="button" variant="outline" onClick={() => exportCandidate('css')}>
              <Download aria-hidden="true" /> Download CSS
            </Button>
            <CopyButton
              value={cssExport}
              label="Copy CSS"
              accessibleLabel="Copy experimental Brand Playground CSS"
              size="md"
            />
          </CardContent>
        </Card>
      </section>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      {storageWarning ? (
        <p className="mt-6 rounded-lg border border-status-warning/40 bg-status-warning/10 p-4 font-sans text-sm text-status-warning-foreground" role="alert">
          {storageWarning}
        </p>
      ) : null}
    </div>
  )
}
