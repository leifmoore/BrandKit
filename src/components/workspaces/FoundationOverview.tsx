import { Link } from 'react-router-dom'
import {
  Accessibility,
  ArrowRight,
  Component,
  Keyboard,
  Palette,
  ScanEye,
  SunMoon,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Principle {
  readonly title: string
  readonly description: string
  readonly icon: LucideIcon
}

const themePrinciples: readonly Principle[] = [
  {
    title: 'Semantic first',
    description: 'Components consume semantic roles so light and dark modes preserve the same hierarchy and intent.',
    icon: Palette,
  },
  {
    title: 'One shared mode',
    description: 'The application shell owns the persisted light or dark preference; previews may isolate a mode locally.',
    icon: SunMoon,
  },
  {
    title: 'Brand stays authored',
    description: 'Official identity colours and authored assets remain separate from the neutral software theme.',
    icon: Component,
  },
]

const accessibilityPrinciples: readonly Principle[] = [
  {
    title: 'Keyboard complete',
    description: 'Every action must be reachable, operable, and dismissible without a pointer, with predictable focus movement.',
    icon: Keyboard,
  },
  {
    title: 'Perceivable states',
    description: 'Meaning, status, and focus cannot depend on colour alone; contrast is verified in every supported mode.',
    icon: ScanEye,
  },
  {
    title: 'Evidence with parity',
    description: 'React and Blade guidance records accessibility evidence separately when their underlying behaviour differs.',
    icon: Accessibility,
  },
]

export function FoundationOverview({ kind }: { kind: 'themes' | 'accessibility' }) {
  const isThemes = kind === 'themes'
  const principles = isThemes ? themePrinciples : accessibilityPrinciples
  const title = isThemes ? 'Themes' : 'Accessibility'
  const description = isThemes
    ? 'Theme modes belong to the Design System. They provide a neutral software canvas while Brand identity remains explicit, authored content.'
    : 'Accessibility is a release requirement shared by foundations, components, patterns, documentation, and framework implementations.'

  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Design System foundation</p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="font-sans text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
      </header>

      <section aria-labelledby={`${kind}-principles`}>
        <h2 id={`${kind}-principles`} className="mb-4 font-sans text-lg font-semibold text-foreground">Core principles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon
            return (
              <Card key={principle.title}>
                <CardHeader className="space-y-3">
                  <Icon className="size-5 text-muted-foreground" aria-hidden />
                  <h3 className="font-sans text-base font-semibold leading-none">{principle.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="font-sans text-sm leading-6 text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6 font-sans text-sm">
        <Link
          to={isThemes ? '/design-system/foundations/tokens' : '/design-system/components'}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isThemes ? 'Explore semantic tokens' : 'Review components'}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          to="/design-system/review/previews"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Preview review
        </Link>
      </div>
    </div>
  )
}
