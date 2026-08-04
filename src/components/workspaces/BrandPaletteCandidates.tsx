import type { CSSProperties } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface PaletteCandidate {
  readonly id: string
  readonly title: string
  readonly status: string
  readonly surface: string
  readonly panel: string
  readonly marker: string
  readonly treatment: string
  readonly boundary: string
}

const candidates: readonly PaletteCandidate[] = [
  {
    id: 'neutral',
    title: 'Neutral boundary',
    status: 'Current baseline',
    surface: '#ffffff',
    panel: '#f3f4f6',
    marker: '#d1d5db',
    treatment: 'Neutral software surfaces throughout the workspace.',
    boundary: 'Navy and White appear only in authored identity examples and assets.',
  },
  {
    id: 'cream',
    title: 'Cream canvas',
    status: 'Candidate · unapproved',
    surface: '#f8f3e3',
    panel: '#fefefd',
    marker: '#d1d5db',
    treatment: 'Cream 100 warms the Brand content canvas while cards stay near-white.',
    boundary: 'Shell, controls, focus, status, and component semantics remain neutral.',
  },
  {
    id: 'gold',
    title: 'Gold editorial cue',
    status: 'Candidate · unapproved',
    surface: '#ffffff',
    panel: '#f3f4f6',
    marker: '#c9a24a',
    treatment: 'Lantern Gold marks short rules, dividers, or small authored highlights.',
    boundary: 'Gold is not body text, a focus colour, a status colour, or a control fill.',
  },
  {
    id: 'cream-gold',
    title: 'Cream + gold expression',
    status: 'Candidate · unapproved',
    surface: '#f8f3e3',
    panel: '#fefefd',
    marker: '#c9a24a',
    treatment: 'Cream provides the editorial canvas and Gold adds restrained page cues.',
    boundary: 'Both roles stop at the Brand content boundary; software chrome stays neutral.',
  },
]

function CandidatePreview({ candidate }: { candidate: PaletteCandidate }) {
  const style = {
    '--candidate-surface': candidate.surface,
    '--candidate-panel': candidate.panel,
    '--candidate-marker': candidate.marker,
  } as CSSProperties

  return (
    <Card className="overflow-hidden" style={style}>
      <CardHeader className="gap-3 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{candidate.id}</p>
            <h3 className="mt-1 font-sans text-lg font-semibold text-foreground">{candidate.title}</h3>
          </div>
          <Badge variant={candidate.id === 'neutral' ? 'secondary' : 'outline'}>{candidate.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-[var(--candidate-surface)] p-5">
          <div className="rounded-lg border border-black/10 bg-[var(--candidate-panel)] p-5 shadow-xs">
            <div className="h-8 w-1 rounded-full bg-[var(--candidate-marker)]" aria-hidden="true" />
            <p className="mt-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-wide text-[#14284b]">
              Brand guidance
            </p>
            <p className="mt-2 font-display text-2xl font-bold leading-tight text-[#14284b]">
              Where Cambridge goes punting.
            </p>
            <p className="mt-2 max-w-sm font-sans text-sm leading-6 text-[#26467d]">
              Authored Brand expression sits inside a stable, reusable software frame.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link to="/brand">Open guidance</Link>
            </Button>
          </div>
        </div>
        <dl className="space-y-3 border-t border-border p-5 font-sans text-sm leading-6">
          <div>
            <dt className="font-semibold text-foreground">Applied treatment</dt>
            <dd className="text-muted-foreground">{candidate.treatment}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Guardrail</dt>
            <dd className="text-muted-foreground">{candidate.boundary}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

export function BrandPaletteCandidates() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        {candidates.map((candidate) => (
          <CandidatePreview key={candidate.id} candidate={candidate} />
        ))}
      </div>
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-3">
          <p className="font-sans text-sm leading-6 text-muted-foreground">
            These four comparisons record the original review gate; they are not approved tokens. The Brand Playground now supports broader blue intensity, sampled accent, gradient, grain, and frosted-glass exploration without changing component semantics or the shared shell.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/brand/expression/playground">Open Brand Playground</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
