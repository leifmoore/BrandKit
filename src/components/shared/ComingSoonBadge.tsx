import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ComingSoonBadge() {
  return (
    <Badge
      variant="outline"
      className="gap-1 text-gold-500 dark:text-gold-300 border-gold-500 dark:border-gold-300"
    >
      <Sparkles className="w-3 h-3" />
      Coming soon
    </Badge>
  )
}
