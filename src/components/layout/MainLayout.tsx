import { useState, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-cream-300 dark:border-navy-700">
        <Sidebar onSearch={openSearch} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-navy-300 hover:text-cream-50 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar onSearch={openSearch} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-cream-300 dark:border-navy-700 bg-navy-900">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-cream-50 hover:text-gold-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src="/logos/logo-white.svg" alt="Scudamore's" className="h-7 w-auto" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          {children}
        </div>
      </main>

      {/* ── Command palette ── */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />

      <Toaster richColors position="bottom-right" />
    </div>
  )
}
