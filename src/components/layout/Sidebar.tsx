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
  const LucideIcon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className="w-4 h-4 shrink-0" />
}

export function Sidebar({ onSearch, onClose }: SidebarProps) {
  const { isDark, toggle } = useDarkMode()
  const location = useLocation()

  return (
    <div className="flex flex-col h-full bg-navy-900 dark:bg-navy-1000 text-cream-50">
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
          onClick={onSearch}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-sans text-navy-300 hover:text-cream-50 hover:bg-navy-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-xs bg-navy-700 text-navy-300 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      {/* Nav items */}
      <ScrollArea className="flex-1 px-3 pb-4">
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-sans transition-colors',
                  isActive
                    ? 'bg-gold-500 text-navy-900 font-medium'
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
          className="h-8 w-8 text-navy-300 hover:text-cream-50 hover:bg-navy-700"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
