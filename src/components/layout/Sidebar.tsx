import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Moon, Sun, Search } from 'lucide-react'
import * as Icons from 'lucide-react'
import { NAV_ITEMS } from '@/lib/tokens'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onSearch?: () => void
  onClose?: () => void
}

// Dynamically resolve lucide icon by name
function NavIcon({ name }: { name: string }) {
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className="w-4 h-4 shrink-0" />
}

export function Sidebar({ onSearch, onClose }: SidebarProps) {
  const { isDark, toggle } = useDarkMode()
  const location = useLocation()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = sidebarRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (!viewport) return

    viewport.setAttribute('role', 'region')
    viewport.setAttribute('aria-label', 'Brand Kit sections')
    return () => {
      viewport.removeAttribute('role')
      viewport.removeAttribute('aria-label')
    }
  }, [])

  return (
    <div ref={sidebarRef} className="flex flex-col h-full bg-navy-900 dark:bg-navy-1000 text-cream-50">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <img
          src="/logos/logo-white.svg"
          alt="Scudamore's"
          className="h-10 w-auto"
        />
        <p className="font-sans text-xs text-navy-300 mt-2 tracking-wide">Brand Kit</p>
      </div>

      <Separator className="bg-navy-700" />

      {/* Search trigger */}
      <div className="px-3 py-3">
        <button
          type="button"
          onClick={onSearch}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sans text-navy-300 hover:text-cream-50 hover:bg-navy-700 transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-xs bg-navy-700 text-navy-100 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Nav items */}
      <ScrollArea className="min-h-0 flex-1 overflow-hidden px-3 pb-4">
        <nav aria-label="Brand Kit sections" className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/developer'
              ? location.pathname.startsWith('/developer')
              : location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-sans transition-colors',
                  item.path === '/developer' && 'mt-4 border-t border-navy-700 pt-4',
                  isActive
                    ? 'bg-navy-700 text-cream-50 font-medium border-l-2 border-cream-50 pl-[10px] pr-3'
                    : 'text-navy-100 hover:text-cream-50 hover:bg-navy-700',
                )}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-navy-700" />

      {/* Dark mode toggle + est */}
      <div className="px-4 py-4 flex items-center justify-between">
        <span className="font-sans text-xs text-navy-300 tracking-caps uppercase">Est. 1910</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 text-navy-300 hover:text-cream-50 hover:bg-navy-700 dark:hover:bg-navy-700"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  )
}
