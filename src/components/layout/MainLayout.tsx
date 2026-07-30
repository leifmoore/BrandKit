import { useState, useCallback, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Toaster } from '@/components/ui/sonner'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
}

const DRAWER_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getDrawerFocusableElements(drawer: HTMLElement) {
  return Array.from(drawer.querySelectorAll<HTMLElement>(DRAWER_FOCUSABLE_SELECTOR))
    .filter((element) => element.getAttribute('aria-hidden') !== 'true')
}

export function MainLayout({ children }: MainLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const drawerRef = useRef<HTMLElement | null>(null)
  const drawerCloseButtonRef = useRef<HTMLButtonElement>(null)
  const drawerTriggerRef = useRef<HTMLButtonElement>(null)
  const drawerRestoreTargetRef = useRef<HTMLElement | null>(null)
  const shouldRestoreDrawerFocusRef = useRef(true)
  const mainRef = useRef<HTMLElement>(null)
  const { isDark } = useDarkMode()
  const location = useLocation()
  const isDeveloper = location.pathname.startsWith('/developer')

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const openDrawer = useCallback(() => {
    drawerRestoreTargetRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : drawerTriggerRef.current
    shouldRestoreDrawerFocusRef.current = true
    setDrawerOpen(true)
  }, [])
  const closeDrawer = useCallback((restoreFocus = true) => {
    shouldRestoreDrawerFocusRef.current = restoreFocus
    setDrawerOpen(false)
  }, [])
  const openMobileSearch = useCallback(() => {
    shouldRestoreDrawerFocusRef.current = false
    setDrawerOpen(false)
    setSearchOpen(true)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return

    const drawer = drawerRef.current
    if (!drawer) return

    const entryFrame = window.requestAnimationFrame(() => {
      const entryTarget = drawerCloseButtonRef.current ?? getDrawerFocusableElements(drawer)[0]
      entryTarget?.focus()
    })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDrawer()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = getDrawerFocusableElements(drawer)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (!firstElement || !lastElement) {
        event.preventDefault()
        return
      }

      const activeElement = document.activeElement
      if (!drawer.contains(activeElement)) {
        event.preventDefault()
        firstElement.focus()
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const restoreTarget = drawerRestoreTargetRef.current

    return () => {
      window.cancelAnimationFrame(entryFrame)
      document.removeEventListener('keydown', handleKeyDown)
      if (shouldRestoreDrawerFocusRef.current && restoreTarget?.isConnected) {
        window.requestAnimationFrame(() => restoreTarget.focus())
      }
    }
  }, [closeDrawer, drawerOpen])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.inert = drawerOpen
    return () => {
      main.inert = false
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return

    const desktopBreakpoint = window.matchMedia('(min-width: 1024px)')
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeDrawer(false)
    }
    if (desktopBreakpoint.matches) {
      closeDrawer(false)
      return
    }

    desktopBreakpoint.addEventListener('change', handleBreakpointChange)
    return () => desktopBreakpoint.removeEventListener('change', handleBreakpointChange)
  }, [closeDrawer, drawerOpen])

  useEffect(() => {
    if (isDeveloper) return

    const focusFrame = window.requestAnimationFrame(() => {
      const main = mainRef.current
      if (!main) return

      const anchor = location.hash.startsWith('#') ? location.hash.slice(1) : ''
      const candidateAnchorTarget = anchor ? document.getElementById(anchor) : null
      const anchorTarget = candidateAnchorTarget && main.contains(candidateAnchorTarget)
        ? candidateAnchorTarget
        : null
      const target = anchorTarget ?? main.querySelector<HTMLElement>('h1')
      if (!target) return

      const addedTabIndex = !target.hasAttribute('tabindex')
      if (addedTabIndex) target.setAttribute('tabindex', '-1')
      if (addedTabIndex) {
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
      }

      target.focus({ preventScroll: Boolean(anchorTarget) })
      if (anchorTarget) {
        anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [isDeveloper, location.hash, location.key])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-cream-300 dark:border-navy-700">
        <Sidebar onSearch={openSearch} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-40 bg-navy-900/60 backdrop-blur-sm"
          onClick={() => closeDrawer()}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-label="Brand Kit navigation"
        aria-hidden={!drawerOpen}
        aria-modal={drawerOpen || undefined}
        ref={(element) => {
          drawerRef.current = element
          if (element) element.inert = !drawerOpen
        }}
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            ref={drawerCloseButtonRef}
            type="button"
            aria-label="Close navigation"
            onClick={() => closeDrawer()}
            className="text-navy-300 hover:text-cream-50 p-1"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <Sidebar onSearch={openMobileSearch} onClose={() => closeDrawer(false)} />
      </aside>

      {/* ── Main content ── */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-cream-300 dark:border-navy-700 bg-navy-900">
          <button
            ref={drawerTriggerRef}
            type="button"
            aria-label="Open navigation"
            aria-controls="mobile-navigation-drawer"
            aria-expanded={drawerOpen}
            onClick={openDrawer}
            className="text-cream-50 hover:text-gold-300"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <img src="/logos/logo-white.svg" alt="Scudamore's" className="h-7 w-auto" />
        </div>

        <div
          className={cn(
            'mx-auto px-4 py-10 sm:px-8',
            isDeveloper ? 'max-w-[1600px]' : 'max-w-5xl',
          )}
        >
          {children}
        </div>
      </main>

      {/* ── Command palette ── */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />

      {!isDeveloper ? (
        <Toaster
          theme={isDark ? 'dark' : 'light'}
          richColors
          position="bottom-right"
        />
      ) : null}
    </div>
  )
}
