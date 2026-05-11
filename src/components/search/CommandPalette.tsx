import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { NAV_ITEMS, ALL_TOKENS } from '@/lib/tokens'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()

  // Wire ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  const go = (path: string, anchor?: string) => {
    onOpenChange(false)
    navigate(path)
    if (anchor) {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search brand kit…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Sections">
          {NAV_ITEMS.map(item => (
            <CommandItem key={item.path} onSelect={() => go(item.path)}>
              <span className="font-medium">{item.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">{item.description}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Subsections">
          {NAV_ITEMS.flatMap(item =>
            (item.subsections ?? []).map(sub => (
              <CommandItem
                key={`${item.path}#${sub.anchor}`}
                onSelect={() => go(item.path, sub.anchor)}
              >
                <span className="text-muted-foreground mr-1">{item.label} /</span>
                {sub.label}
              </CommandItem>
            )),
          )}
        </CommandGroup>

        <CommandGroup heading="Colours">
          {ALL_TOKENS.map(token => (
            <CommandItem
              key={token.alias}
              onSelect={() => go('/colour')}
              className="gap-2"
            >
              <span
                className="w-4 h-4 rounded-sm border border-black/10 shrink-0"
                style={{ background: token.hex }}
              />
              <span className="font-medium">{token.name}</span>
              <span className="text-xs text-muted-foreground">{token.hex}</span>
              <span className="text-xs text-muted-foreground ml-auto">{token.alias}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
