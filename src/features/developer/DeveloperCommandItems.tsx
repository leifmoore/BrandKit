import { CommandGroup, CommandItem } from '@/components/ui/command'
import { searchDocuments } from './catalog'

export interface DeveloperCommandItemsProps {
  onSelect: (path: string) => void
}

export default function DeveloperCommandItems({ onSelect }: DeveloperCommandItemsProps) {
  return (
    <CommandGroup heading="Developer library">
      {searchDocuments
        .filter((document) => document.kind !== 'utility')
        .map((document) => (
          <CommandItem
            key={document.id}
            value={document.searchableText}
            onSelect={() => onSelect(document.route)}
          >
            <span className="font-medium">{document.title}</span>
            <span className="ml-2 text-xs capitalize text-muted-foreground">{document.kind}</span>
            <span className="ml-auto text-xs text-muted-foreground">{document.category}</span>
          </CommandItem>
        ))}
    </CommandGroup>
  )
}
