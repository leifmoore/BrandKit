import { useEffect, useState } from 'react'
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
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="flex flex-wrap gap-1 mb-8 p-1 bg-cream-200 dark:bg-navy-700 rounded-lg">
      {items.map(item => (
        <button
          key={item.anchor}
          onClick={() => scrollTo(item.anchor)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors',
            active === item.anchor
              ? 'bg-navy-900 dark:bg-navy-900 text-cream-50'
              : 'text-navy-700 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-navy-900',
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
