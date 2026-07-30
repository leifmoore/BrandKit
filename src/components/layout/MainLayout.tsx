import { useState, useCallback, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Toaster } from '@/components/ui/sonner'
import { WORKSPACES, getWorkspaceForPath } from '@/config/workspaces'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useWorkspaceMemory } from '@/hooks/useWorkspaceMemory'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children?: React.ReactNode
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
  const workspaceId = getWorkspaceForPath(location.pathname) ?? 'brand'
  const workspace = WORKSPACES[workspaceId]
  const isDesignSystem = workspaceId === 'design-system'
  const isHostDesignSystemPage = [
    '/design-system/foundations/accessibility',
    '/design-system/foundations/data-visualisation',
    '/design-system/resources',
    '/design-system/review/previews',
  ].includes(location.pathname)

  useWorkspaceMemory(location.pathname)

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
    if (isDesignSystem && !isHostDesignSystemPage) return

    const main = mainRef.current
    if (!main) return

    let focusedTarget: HTMLElement | null = null
    let observer: MutationObserver | undefined

    const focusDestination = () => {
      const anchor = location.hash.startsWith('#') ? location.hash.slice(1) : ''
      const candidateAnchorTarget = anchor ? document.getElementById(anchor) : null
      const anchorTarget = candidateAnchorTarget && main.contains(candidateAnchorTarget)
        ? candidateAnchorTarget
        : null
      const target = anchorTarget ?? main.querySelector<HTMLElement>('h1')
      if (!target) return false

      focusedTarget = target
      target.setAttribute('data-route-focus', '')
      const addedTabIndex = !target.hasAttribute('tabindex')
      if (addedTabIndex) target.setAttribute('tabindex', '-1')
      target.addEventListener('blur', () => {
        target.removeAttribute('data-route-focus')
        if (addedTabIndex) target.removeAttribute('tabindex')
      }, { once: true })

      target.focus({ preventScroll: Boolean(anchorTarget) })
      if (anchorTarget) {
        anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return true
    }

    const focusFrame = window.requestAnimationFrame(() => {
      if (!focusDestination()) {
        observer = new MutationObserver(() => {
          if (focusDestination()) observer?.disconnect()
        })
        observer.observe(main, { childList: true, subtree: true })
      }
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      observer?.disconnect()
      focusedTarget?.removeAttribute('data-route-focus')
      if (focusedTarget && document.activeElement === focusedTarget) focusedTarget.blur()
    }
  }, [isDesignSystem, isHostDesignSystemPage, location.hash, location.key])

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex"
        aria-label={`${workspace.label} workspace`}
      >
        <Sidebar onSearch={openSearch} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => closeDrawer()}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        id="mobile-navigation-drawer"
        role="dialog"
        aria-label={`${workspace.label} navigation`}
        aria-hidden={!drawerOpen}
        aria-modal={drawerOpen || undefined}
        ref={(element) => {
          drawerRef.current = element
          if (element) element.inert = !drawerOpen
        }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 lg:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            ref={drawerCloseButtonRef}
            type="button"
            aria-label="Close navigation"
            onClick={() => closeDrawer()}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <Sidebar onSearch={openMobileSearch} onClose={() => closeDrawer(false)} />
      </aside>

      {/* ── Main content ── */}
      <main id="main-content" ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <button
            ref={drawerTriggerRef}
            type="button"
            aria-label="Open navigation"
            aria-controls="mobile-navigation-drawer"
            aria-expanded={drawerOpen}
            onClick={openDrawer}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <img src="/logos/logo-navy.svg" alt="Scudamore's" className="h-7 w-auto dark:hidden" />
          <img src="/logos/logo-white.svg" alt="Scudamore's" className="hidden h-7 w-auto dark:block" />
          <span className="ml-auto font-sans text-xs font-medium text-muted-foreground">{workspace.label}</span>
        </div>

        <div
          className={cn(
            'mx-auto min-w-0 px-4 py-10 sm:px-8',
            isDesignSystem ? 'max-w-[1600px]' : 'max-w-5xl',
          )}
        >
          {children ?? <Outlet />}
        </div>
      </main>

      {/* ── Command palette ── */}
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />

      {!isDesignSystem ? (
        <Toaster
          theme={isDark ? 'dark' : 'light'}
          richColors
          position="bottom-right"
        />
      ) : null}
    </div>
  )
}
