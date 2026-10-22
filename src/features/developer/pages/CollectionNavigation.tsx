import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export interface CollectionNavigationTarget {
  href: string
  title: string
}

export interface CollectionNavigationViewModel {
  label: string
  backHref: string
  backLabel: string
  previous: CollectionNavigationTarget
  next: CollectionNavigationTarget
}

export function CollectionNavigation({
  navigation,
}: {
  navigation: CollectionNavigationViewModel
}) {
  return (
    <nav
      aria-label={navigation.label}
      className="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <Button asChild variant="ghost" size="sm" className="self-start px-2">
        <Link to={navigation.backHref}>
          <ArrowLeft aria-hidden="true" />
          {navigation.backLabel}
        </Link>
      </Button>

      <div className="grid grid-cols-2 gap-2 sm:flex" aria-label="Previous and next entries">
        <Button asChild variant="outline" size="sm" className="min-w-0 justify-start sm:max-w-56">
          <Link to={navigation.previous.href} aria-label={`Previous: ${navigation.previous.title}`}>
            <ChevronLeft aria-hidden="true" />
            <span className="truncate">{navigation.previous.title}</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="min-w-0 justify-end sm:max-w-56">
          <Link to={navigation.next.href} aria-label={`Next: ${navigation.next.title}`}>
            <span className="truncate">{navigation.next.title}</span>
            <ChevronRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </nav>
  )
}
