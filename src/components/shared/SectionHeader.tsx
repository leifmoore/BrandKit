import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-10', className)}>
      {eyebrow && (
        <p className="font-sans font-medium text-xs uppercase tracking-caps text-gold-500 dark:text-gold-300 mb-3 accent-line">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display font-bold text-4xl md:text-5xl tracking-display text-navy-900 dark:text-cream-50 leading-none mb-4">
        {title}
      </h1>
      {description && (
        <p className="font-sans text-lg text-navy-700 dark:text-cream-300 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
