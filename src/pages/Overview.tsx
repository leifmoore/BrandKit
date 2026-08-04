import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { WORKSPACES } from '@/config/workspaces'

function NavIcon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className="size-5" aria-hidden="true" />
}

const CORE_VALUES = [
  {
    title: 'Accessibility',
    description: 'Make the pleasure of being on water accessible to everybody. Inclusive by design — the river is for everyone.',
  },
  {
    title: 'Community',
    description: 'The place where Cambridge comes to enjoy the river. We\'re as much for locals as we are for visitors.',
  },
  {
    title: 'Hospitality',
    description: 'Act as ambassadors for Cambridge. Welcoming hosts, courteous and attentive, sharing what we love.',
  },
]

export function Overview() {
  const sections = WORKSPACES.brand.navigation
    .flatMap((group) => group.items)
    .filter((item) => item.href !== WORKSPACES.brand.home)

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Brand workspace"
        title="Scudamore’s Brand"
        description="Identity, expression, applications, and approved assets for work that looks, sounds, and feels unmistakably Scudamore’s."
      />

      <section aria-labelledby="brand-statement-heading">
        <h2 id="brand-statement-heading" className="sr-only">Brand statement</h2>
        <div className="overflow-hidden rounded-lg border border-[#14284b] bg-[#14284b] text-[#fefefd]">
          <div className="max-w-2xl p-6 sm:p-8">
            <img src="/logos/logo-white.svg" alt="Scudamore’s" className="mb-7 h-12 w-auto sm:h-14" />
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-caps text-navy-100">Est. 1910</p>
            <p className="font-display text-4xl font-bold leading-none tracking-display sm:text-5xl">
              Where Cambridge<br />goes punting.
            </p>
            <p className="mt-5 max-w-xl font-sans text-base leading-7 text-navy-100">
              Cambridge's oldest punting company, family-run since 1910. We make the river welcoming, memorable, and unmistakably Cambridge.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section aria-labelledby="core-values-heading">
        <h2 id="core-values-heading" className="mb-4 font-sans text-lg font-semibold text-foreground">Core values</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CORE_VALUES.map(value => (
            <Card key={value.title}>
              <CardHeader>
                <h3 className="font-sans text-base font-semibold text-foreground">{value.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="font-sans text-sm leading-6 text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Brand purpose */}
      <section className="rounded-lg bg-[#14284b] p-6 text-[#fefefd] sm:p-8" aria-labelledby="mission-heading">
        <div className="max-w-xl">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-caps text-cream-300">Mission</p>
          <h2 id="mission-heading" className="mb-4 font-display text-2xl font-bold leading-snug">
            To create timeless Cambridge memories.
          </h2>
          <div className="space-y-2 font-sans text-sm text-navy-100">
            <p>For locals: <span className="font-medium text-[#fefefd]">“Where Cambridge goes punting.”</span></p>
            <p>For visitors: <span className="font-medium text-[#fefefd]">“Where Britain goes punting.”</span></p>
          </div>
        </div>
      </section>

      {/* Section cards */}
      <section aria-labelledby="brand-sections-heading">
        <h2 id="brand-sections-heading" className="mb-4 font-sans text-lg font-semibold text-foreground">Explore the Brand workspace</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="h-full gap-0 transition-colors group-hover:bg-accent">
                <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <NavIcon name={item.icon} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-sans text-sm font-semibold text-foreground">{item.label}</h3>
                    <p className="mt-1 font-sans text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
