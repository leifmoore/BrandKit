import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ClipboardCopy, FileCode2, PackageOpen } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const resourceCards = [
  {
    title: 'Component source',
    description: 'Browse consumer-ready React and Blade files, runnable examples, dependencies, and parity notes.',
    href: '/design-system/components',
    label: 'Browse components',
    icon: FileCode2,
  },
  {
    title: 'Semantic tokens',
    description: 'Use the canonical interface roles and theme assets that underpin component behaviour.',
    href: '/design-system/foundations/tokens',
    label: 'Explore tokens',
    icon: PackageOpen,
  },
  {
    title: 'Reusable patterns',
    description: 'Copy fixture-driven compositions built from supported Design System primitives.',
    href: '/design-system/patterns',
    label: 'Browse patterns',
    icon: ClipboardCopy,
  },
] as const

export function DesignSystemResourcesPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Design System resources</p>
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Build from the canonical source.</h1>
        <p className="font-sans text-base leading-7 text-muted-foreground sm:text-lg">
          Scudamore’s UI 0.1.0 is a copy-only handoff. Choose an implementation, review its contract and dependencies, then copy or download the exact source files you need.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Design System resources">
        <h2 className="sr-only">Resource collections</h2>
        {resourceCards.map((resource) => {
          const Icon = resource.icon
          return (
            <Card key={resource.title}>
              <CardHeader className="space-y-3">
                <Icon className="size-5 text-muted-foreground" aria-hidden />
                <h3 className="font-sans text-base font-semibold leading-none">{resource.title}</h3>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <p className="flex-1 font-sans text-sm leading-6 text-muted-foreground">{resource.description}</p>
                <Link
                  to={resource.href}
                  className="inline-flex items-center gap-2 self-start rounded-sm font-sans text-sm font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {resource.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="rounded-lg border border-border bg-muted/40 p-5" aria-labelledby="distribution-boundary">
        <h2 id="distribution-boundary" className="font-sans text-base font-semibold text-foreground">Distribution boundary</h2>
        <ul className="mt-3 space-y-2 font-sans text-sm leading-6 text-muted-foreground">
          <li className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden />The library performs no install or registry action; consumers review each entry’s declared dependencies before copying it.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden />Only files present in the handoff may be presented as canonical copyable source.</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden />Missing framework source remains unavailable until its original implementation and behaviour are reviewed.</li>
        </ul>
      </section>
    </div>
  )
}
