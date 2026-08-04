import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SubNavItem {
  label: string
  anchor: string
}

interface SectionSubNavProps {
  items: SubNavItem[]
}

export function SectionSubNav({ items }: SectionSubNavProps) {
  const [active, setActive] = useState(items[0]?.anchor ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )

    items.forEach(item => {
      const el = document.getElementById(item.anchor)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const scrollTo = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav aria-label="On this page" className="mb-8 overflow-x-auto rounded-xl border border-border bg-muted p-[3px]">
      <div className="flex w-max min-w-full gap-1">
        {items.map(item => {
          const isActive = active === item.anchor

          return (
            <Button
              key={item.anchor}
              variant="ghost"
              size="sm"
              aria-current={isActive ? 'location' : undefined}
              aria-controls={item.anchor}
              onClick={() => scrollTo(item.anchor)}
              className={cn(
                'flex-none rounded-lg px-3 font-sans text-xs',
                isActive && 'bg-card text-foreground shadow-sm hover:bg-card dark:bg-input/30 dark:hover:bg-input/30',
              )}
            >
              {item.label}
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
