import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Overview } from '@/pages/Overview'
import { Colour } from '@/pages/Colour'
import { Logo } from '@/pages/Logo'
import { Typography } from '@/pages/Typography'
import { Voice } from '@/pages/Voice'
import { Photography } from '@/pages/Photography'
import { Graphics } from '@/pages/Graphics'
import { Charts } from '@/pages/Charts'
import { Applications } from '@/pages/Applications'
import { QuickReference } from '@/pages/QuickReference'
import { Downloads } from '@/pages/Downloads'

function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Overview /></Layout>,
  },
  {
    path: '/colour',
    element: <Layout><Colour /></Layout>,
  },
  {
    path: '/logo',
    element: <Layout><Logo /></Layout>,
  },
  {
    path: '/typography',
    element: <Layout><Typography /></Layout>,
  },
  {
    path: '/voice',
    element: <Layout><Voice /></Layout>,
  },
  {
    path: '/photography',
    element: <Layout><Photography /></Layout>,
  },
  {
    path: '/graphics',
    element: <Layout><Graphics /></Layout>,
  },
  {
    path: '/charts',
    element: <Layout><Charts /></Layout>,
  },
  {
    path: '/applications',
    element: <Layout><Applications /></Layout>,
  },
  {
    path: '/quick-reference',
    element: <Layout><QuickReference /></Layout>,
  },
  {
    path: '/downloads',
    element: <Layout><Downloads /></Layout>,
  },
])
