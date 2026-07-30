import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '@/lib/tokens'
import * as Icons from 'lucide-react'

function NavIcon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className="w-6 h-6" />
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
  const sections = NAV_ITEMS.filter(item => item.path !== '/')

  return (
    <div>
      {/* Hero */}
      <div className="mb-14">
        <img src="/logos/logo-navy.svg" alt="Scudamore's" className="h-14 w-auto mb-8 dark:hidden" />
        <img src="/logos/logo-white.svg" alt="Scudamore's" className="h-14 w-auto mb-8 hidden dark:block" />
        <p className="font-sans text-xs font-medium uppercase tracking-caps text-navy-700 dark:text-gold-300 mb-4 accent-line">
          Est. 1910
        </p>
        <h1 className="font-display font-bold text-5xl md:text-6xl text-navy-900 dark:text-cream-50 tracking-display leading-none mb-6">
          Where Cambridge<br />goes punting.
        </h1>
        <p className="font-sans text-lg text-navy-700 dark:text-cream-300 max-w-xl leading-relaxed">
          Cambridge's oldest punting company, family-run since 1910. This brand kit contains everything needed to create work that looks, sounds, and feels like Scudamore's — for designers, developers, writers, and the whole team.
        </p>
      </div>

      {/* Core values */}
      <div className="mb-14">
        <h2 className="font-sans font-semibold text-xs uppercase tracking-caps text-muted-foreground mb-6">Core values</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {CORE_VALUES.map(value => (
            <div key={value.title} className="rounded-xl border border-border bg-card p-5">
              <div className="w-1 h-8 bg-gold-500 dark:bg-gold-300 rounded-full mb-4" />
              <h3 className="font-display font-bold text-lg text-navy-900 dark:text-cream-50 mb-2">{value.title}</h3>
              <p className="font-sans text-sm text-navy-700 dark:text-cream-300">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand purpose */}
      <div className="rounded-xl bg-navy-900 dark:bg-navy-1000 p-8 mb-14">
        <div className="max-w-xl">
          <p className="font-sans text-xs uppercase tracking-caps text-cream-300 mb-4">Mission</p>
          <p className="font-display font-bold text-2xl text-cream-50 mb-4 leading-snug">
            To create timeless Cambridge memories.
          </p>
          <div className="space-y-2 text-navy-100 font-sans text-sm">
            <p>For locals: <span className="text-cream-50 font-medium">"Where Cambridge goes punting."</span></p>
            <p>For visitors: <span className="text-cream-50 font-medium">"Where Britain goes punting."</span></p>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div>
        <h2 className="font-sans font-semibold text-xs uppercase tracking-caps text-muted-foreground mb-6">Brand kit sections</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card hover:border-navy-500 dark:hover:border-cream-200 hover:shadow-sm p-5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-900 dark:bg-cream-50 text-cream-50 dark:text-navy-900 flex items-center justify-center shrink-0 group-hover:bg-navy-700 dark:group-hover:bg-cream-200 transition-colors">
                <NavIcon name={item.icon} />
              </div>
              <div>
                <p className="font-sans font-semibold text-sm text-foreground transition-colors">{item.label}</p>
                <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
