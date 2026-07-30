import { PageHeader } from './PageHeader'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <PageHeader eyebrow={eyebrow} title={title} description={description} className={className} />
  )
}
