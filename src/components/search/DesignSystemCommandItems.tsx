import { CommandGroup, CommandItem } from '@/components/ui/command'
import { canonicalizeDeveloperPath } from '@/config/workspaces'
import { searchDocuments } from '@/features/developer/catalog'

export interface DesignSystemCommandItemsProps {
  onSelect: (path: string) => void
}

export default function DesignSystemCommandItems({ onSelect }: DesignSystemCommandItemsProps) {
  return (
    <CommandGroup heading="Components and patterns">
      {searchDocuments
        .filter((document) => document.kind !== 'utility')
        .map((document) => (
          <CommandItem
            key={document.id}
            value={document.searchableText}
            onSelect={() => onSelect(canonicalizeDeveloperPath(document.route))}
          >
            <span className="font-medium">{document.title}</span>
            <span className="ml-2 text-xs capitalize text-muted-foreground">{document.kind}</span>
            <span className="ml-auto text-xs text-muted-foreground">{document.category}</span>
          </CommandItem>
        ))}
    </CommandGroup>
  )
}
