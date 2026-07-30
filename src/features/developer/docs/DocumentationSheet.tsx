import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type DocumentationSectionId =
  | 'guidance'
  | 'api'
  | 'dependencies'
  | 'accessibility'
  | 'parity'

export interface DocumentationSection {
  id: DocumentationSectionId
  label: string
  description: string
  content: ReactNode
}

const documentationSectionIds = new Set<DocumentationSectionId>([
  'guidance',
  'api',
  'dependencies',
  'accessibility',
  'parity',
])

function parseDocumentationSection(value: string | null): DocumentationSectionId | undefined {
  return value && documentationSectionIds.has(value as DocumentationSectionId)
    ? value as DocumentationSectionId
    : undefined
}

export function DocumentationSheet({
  title,
  sections,
}: {
  title: string
  sections: readonly DocumentationSection[]
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = parseDocumentationSection(searchParams.get('docs'))
  const fallbackSection = sections.find((section) => section.id === 'api') ?? sections[0]
  const activeSection = sections.find((section) => section.id === requestedSection) ?? fallbackSection
  const open = requestedSection !== undefined && activeSection !== undefined

  const setSection = (section: DocumentationSectionId, replace = true) => {
    const next = new URLSearchParams(searchParams)
    next.set('docs', section)
    setSearchParams(next, { replace })
  }

  const setOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      if (activeSection) setSection(activeSection.id, false)
      return
    }
    const next = new URLSearchParams(searchParams)
    next.delete('docs')
    setSearchParams(next, { replace: true })
  }

  if (!activeSection) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <BookOpen aria-hidden="true" />
          Documentation
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed inset-y-0 left-auto right-0 top-0 grid h-dvh w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-none border-y-0 border-r-0 p-0 shadow-xl sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-5 py-5 pr-14 sm:px-6">
          <DialogTitle>{title} documentation</DialogTitle>
          <DialogDescription>
            Detailed guidance, contracts, dependencies, accessibility, and framework parity.
          </DialogDescription>
        </DialogHeader>
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 sm:px-5" aria-label="Documentation sections">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring ${section.id === activeSection.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              aria-current={section.id === activeSection.id ? 'page' : undefined}
              onClick={() => setSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <section className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6" aria-labelledby={`documentation-${activeSection.id}-heading`}>
          <h2 id={`documentation-${activeSection.id}-heading`} className="font-sans text-2xl font-semibold text-foreground">
            {activeSection.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeSection.description}</p>
          <div className="mt-6">{activeSection.content}</div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
