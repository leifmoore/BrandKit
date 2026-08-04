import { lazy, Suspense } from 'react'
import { Link, Navigate, createBrowserRouter, useLocation } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import {
  DesignSystemResourcesPage,
} from '@/components/workspaces/DesignSystemUtilityPages'
import { FoundationOverview } from '@/components/workspaces/FoundationOverview'
import { canonicalizeDeveloperPath } from '@/config/workspaces'
import { getRememberedEntryRoute } from '@/hooks/useWorkspaceMemory'
import { Applications } from '@/pages/Applications'
import { BrandPlayground } from '@/pages/BrandPlayground'
import { Charts } from '@/pages/Charts'
import { Colour } from '@/pages/Colour'
import { Downloads } from '@/pages/Downloads'
import { Graphics } from '@/pages/Graphics'
import { Logo } from '@/pages/Logo'
import { Overview } from '@/pages/Overview'
import { Photography } from '@/pages/Photography'
import { QuickReference } from '@/pages/QuickReference'
import { Typography } from '@/pages/Typography'
import { Voice } from '@/pages/Voice'

const DeveloperApp = lazy(() => import('@/features/developer/DeveloperApp'))
const PreviewReviewPage = lazy(() => import('@/features/review/PreviewReviewPage'))

function DesignSystemFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <p className="font-sans text-sm text-muted-foreground">Loading Design System…</p>
    </div>
  )
}

function DesignSystemApp() {
  return (
    <Suspense fallback={<DesignSystemFallback />}>
      <DeveloperApp />
    </Suspense>
  )
}

function WorkspaceRootRedirect() {
  return <Navigate to={getRememberedEntryRoute()} replace />
}

function LegacyDeveloperRedirect() {
  const location = useLocation()
  const destination = canonicalizeDeveloperPath(location.pathname)
  return <Navigate to={{ pathname: destination, search: location.search, hash: location.hash }} replace />
}

function ReplaceRedirect({ to }: { to: string }) {
  const location = useLocation()
  return <Navigate to={{ pathname: to, search: location.search, hash: location.hash }} replace />
}

function WorkspaceNotFound() {
  return (
    <div className="mx-auto max-w-2xl space-y-5 py-16 text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted-foreground">Page not found</p>
      <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">That library page does not exist.</h1>
      <p className="font-sans text-base leading-7 text-muted-foreground">
        Choose a workspace overview to continue exploring the Brand Kit.
      </p>
      <div className="flex flex-wrap justify-center gap-3 font-sans text-sm">
        <Link
          to="/brand"
          className="rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Brand overview
        </Link>
        <Link
          to="/design-system"
          className="rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Design System overview
        </Link>
      </div>
    </div>
  )
}

const legacyBrandRedirects = [
  { path: '/colour', to: '/brand/identity/colour' },
  { path: '/logo', to: '/brand/identity/logo' },
  { path: '/typography', to: '/brand/identity/typography' },
  { path: '/voice', to: '/brand/expression/voice' },
  { path: '/photography', to: '/brand/expression/photography' },
  { path: '/graphics', to: '/brand/expression/graphics' },
  { path: '/applications', to: '/brand/applications' },
  { path: '/downloads', to: '/brand/resources' },
  { path: '/quick-reference', to: '/brand/quick-reference' },
  { path: '/charts', to: '/design-system/foundations/data-visualisation' },
] as const

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <WorkspaceRootRedirect /> },

      { path: '/brand', element: <Overview /> },
      { path: '/brand/quick-reference', element: <QuickReference /> },
      { path: '/brand/identity/logo', element: <Logo /> },
      { path: '/brand/identity/colour', element: <Colour /> },
      { path: '/brand/identity/typography', element: <Typography /> },
      { path: '/brand/expression/voice', element: <Voice /> },
      { path: '/brand/expression/photography', element: <Photography /> },
      { path: '/brand/expression/graphics', element: <Graphics /> },
      { path: '/brand/expression/playground', element: <BrandPlayground /> },
      { path: '/brand/applications', element: <Applications /> },
      { path: '/brand/resources', element: <Downloads /> },

      {
        path: '/design-system/foundations/accessibility',
        element: <FoundationOverview kind="accessibility" />,
      },
      {
        path: '/design-system/foundations/data-visualisation',
        element: <Charts />,
      },
      {
        path: '/design-system/foundations/brands',
        element: <ReplaceRedirect to="/design-system/foundations/themes" />,
      },
      {
        path: '/design-system/resources',
        element: <DesignSystemResourcesPage />,
      },
      {
        path: '/design-system/review/previews',
        element: (
          <Suspense fallback={<DesignSystemFallback />}>
            <PreviewReviewPage />
          </Suspense>
        ),
      },
      { path: '/design-system/*', element: <DesignSystemApp /> },

      ...legacyBrandRedirects.map(({ path, to }) => ({
        path,
        element: <ReplaceRedirect to={to} />,
      })),
      { path: '/developer/*', element: <LegacyDeveloperRedirect /> },
      { path: '*', element: <WorkspaceNotFound /> },
    ],
  },
])
