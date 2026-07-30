import { useEffect, useRef, type ComponentType } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Moon, Search, Sun } from 'lucide-react'
import * as Icons from 'lucide-react'
import {
  WORKSPACES,
  WORKSPACE_ORDER,
  getWorkspaceForPath,
  isWorkspaceNavItemActive,
} from '@/config/workspaces'
import { getRememberedWorkspaceRoute } from '@/hooks/useWorkspaceMemory'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onSearch?: () => void
  onClose?: () => void
}

function NavIcon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className="size-4 shrink-0" aria-hidden />
}

export function Sidebar({ onSearch, onClose }: SidebarProps) {
  const { isDark, toggle } = useDarkMode()
  const location = useLocation()
  const workspaceId = getWorkspaceForPath(location.pathname) ?? 'brand'
  const workspace = WORKSPACES[workspaceId]
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = sidebarRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (!viewport) return

    viewport.setAttribute('role', 'region')
    viewport.setAttribute('aria-label', `${workspace.label} sections`)
    return () => {
      viewport.removeAttribute('role')
      viewport.removeAttribute('aria-label')
    }
  }, [workspace.label])

  return (
    <div ref={sidebarRef} className="flex h-full flex-col bg-card text-card-foreground">
      <div className="px-4 pb-3 pt-5">
        <Link
          to="/brand"
          onClick={onClose}
          className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img src="/logos/logo-navy.svg" alt="Scudamore's" className="h-9 w-auto dark:hidden" />
          <img src="/logos/logo-white.svg" alt="Scudamore's" className="hidden h-9 w-auto dark:block" />
        </Link>
        <p className="mt-2 font-sans text-xs text-muted-foreground">Brand Kit</p>
      </div>

      <div className="px-3 pb-3">
        <div
          role="group"
          className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/50 p-1"
          aria-label="Workspace"
        >
          {WORKSPACE_ORDER.map((id) => {
            const item = WORKSPACES[id]
            const isCurrent = id === workspaceId
            return (
              <Link
                key={id}
                to={getRememberedWorkspaceRoute(id)}
                onClick={onClose}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2 py-1.5 text-center font-sans text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isCurrent
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                )}
              >
                <span className="sm:hidden lg:inline xl:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline lg:hidden xl:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <Separator />

      <div className="px-3 py-3">
        <button
          type="button"
          onClick={onSearch}
          aria-label={`Search ${workspace.label}`}
          className="flex w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 font-sans text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search {workspace.shortLabel}</span>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[0.625rem] text-muted-foreground">
            <span className="sr-only">Command or Control plus </span>K
          </kbd>
        </button>
      </div>

      <ScrollArea className="min-h-0 flex-1 overflow-hidden px-3 pb-4">
        <nav aria-label={`${workspace.label} navigation`} className="space-y-5">
          {workspace.navigation.map((group) => (
            <div key={group.label} aria-labelledby={`${workspace.id}-${group.label.toLowerCase().replace(/\s+/g, '-')}-nav`}>
              <h2
                id={`${workspace.id}-${group.label.toLowerCase().replace(/\s+/g, '-')}-nav`}
                className="mb-1.5 px-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {group.label}
              </h2>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = isWorkspaceNavItemActive(location.pathname, item)
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={!item.matchPrefix}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-2.5 rounded-md px-2.5 py-2 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-accent font-medium text-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <NavIcon name={item.icon} />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-sans text-[0.6875rem] uppercase tracking-wide text-muted-foreground">Est. 1910</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="size-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  )
}
