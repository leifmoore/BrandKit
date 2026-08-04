import { useEffect } from 'react'
import {
  WORKSPACES,
  getWorkspaceForPath,
  isValidWorkspacePath,
  type WorkspaceId,
} from '@/config/workspaces'

const STORAGE_KEY = 'scud-workspace-state-v1'
const STORAGE_VERSION = 1

interface WorkspaceMemory {
  version: typeof STORAGE_VERSION
  lastWorkspace: WorkspaceId
  routes: Record<WorkspaceId, string>
}

const defaultMemory: WorkspaceMemory = {
  version: STORAGE_VERSION,
  lastWorkspace: 'brand',
  routes: {
    brand: WORKSPACES.brand.home,
    'design-system': WORKSPACES['design-system'].home,
  },
}

function isWorkspaceId(value: unknown): value is WorkspaceId {
  return value === 'brand' || value === 'design-system'
}

function safeStoredRoute(value: unknown, workspace: WorkspaceId): string {
  return typeof value === 'string'
    && getWorkspaceForPath(value) === workspace
    && isValidWorkspacePath(value)
    ? value
    : WORKSPACES[workspace].home
}

export function readWorkspaceMemory(): WorkspaceMemory {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultMemory

    const parsed = JSON.parse(raw) as Partial<WorkspaceMemory>
    if (parsed.version !== STORAGE_VERSION || !isWorkspaceId(parsed.lastWorkspace)) {
      return defaultMemory
    }

    return {
      version: STORAGE_VERSION,
      lastWorkspace: parsed.lastWorkspace,
      routes: {
        brand: safeStoredRoute(parsed.routes?.brand, 'brand'),
        'design-system': safeStoredRoute(parsed.routes?.['design-system'], 'design-system'),
      },
    }
  } catch {
    return defaultMemory
  }
}

export function getRememberedWorkspaceRoute(workspace: WorkspaceId): string {
  return readWorkspaceMemory().routes[workspace]
}

export function getRememberedEntryRoute(): string {
  const memory = readWorkspaceMemory()
  return memory.routes[memory.lastWorkspace]
}

export function rememberWorkspaceRoute(pathname: string): void {
  const workspace = getWorkspaceForPath(pathname)
  if (!workspace || !isValidWorkspacePath(pathname)) return

  const memory = readWorkspaceMemory()
  const nextMemory: WorkspaceMemory = {
    ...memory,
    lastWorkspace: workspace,
    routes: {
      ...memory.routes,
      [workspace]: pathname,
    },
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMemory))
  } catch {
    // Persistence is an enhancement. Navigation must still work when storage
    // is unavailable, full, or blocked by the browser.
  }
}

export function useWorkspaceMemory(pathname: string): void {
  useEffect(() => {
    rememberWorkspaceRoute(pathname)
  }, [pathname])
}
