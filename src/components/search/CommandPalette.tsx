import { lazy, Suspense, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { WORKSPACES, getWorkspaceForPath } from '@/config/workspaces'
import { ALL_TOKENS } from '@/lib/tokens'

const DesignSystemCommandItems = lazy(
  () => import('./DesignSystemCommandItems'),
)

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const workspaceId = getWorkspaceForPath(location.pathname) ?? 'brand'
  const workspace = WORKSPACES[workspaceId]

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  const go = (path: string, anchor?: string) => {
    onOpenChange(false)
    navigate({ pathname: path, hash: anchor ? `#${anchor}` : '' })
  }

  const sectionItems = workspace.navigation.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.label })),
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        aria-label={`Search ${workspace.label}`}
        placeholder={`Search ${workspace.label.toLowerCase()}…`}
      />
      <CommandList>
        <CommandEmpty>No results found in {workspace.label}.</CommandEmpty>

        <CommandGroup heading={`${workspace.label} sections`}>
          {sectionItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.label} ${item.description} ${item.group}`}
              onSelect={() => go(item.href)}
            >
              <span className="font-medium">{item.label}</span>
              <span className="ml-2 text-xs text-muted-foreground">{item.description}</span>
              <span className="ml-auto text-xs text-muted-foreground">{item.group}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {workspaceId === 'brand' ? (
          <>
            <CommandGroup heading="Page sections">
              {sectionItems.flatMap((item) =>
                (item.subsections ?? []).map((subsection) => (
                  <CommandItem
                    key={`${item.href}#${subsection.anchor}`}
                    value={`${item.label} ${subsection.label}`}
                    onSelect={() => go(item.href, subsection.anchor)}
                  >
                    <span className="text-muted-foreground">{item.label} /</span>
                    <span>{subsection.label}</span>
                  </CommandItem>
                )),
              )}
            </CommandGroup>

            <CommandGroup heading="Identity colours">
              {ALL_TOKENS.map((token) => (
                <CommandItem
                  key={token.alias}
                  value={`${token.name} ${token.hex} ${token.alias}`}
                  onSelect={() => go('/brand/identity/colour')}
                  className="gap-2"
                >
                  <span
                    className="size-4 shrink-0 rounded-sm border border-black/10"
                    style={{ background: token.hex }}
                  />
                  <span className="font-medium">{token.name}</span>
                  <span className="text-xs text-muted-foreground">{token.hex}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{token.alias}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : open ? (
          <Suspense
            fallback={
              <CommandGroup heading="Components and patterns">
                <CommandItem disabled>Loading component catalogue…</CommandItem>
              </CommandGroup>
            }
          >
            <DesignSystemCommandItems onSelect={(path) => go(path)} />
          </Suspense>
        ) : null}
      </CommandList>
    </CommandDialog>
  )
}
