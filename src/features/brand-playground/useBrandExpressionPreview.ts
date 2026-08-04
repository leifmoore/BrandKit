import { useEffect, useState } from 'react'
import {
  BRAND_PLAYGROUND_CHANGE_EVENT,
  BRAND_PLAYGROUND_DRAFT_KEY,
  readBrandPlaygroundDraft,
  type BrandPlaygroundConfig,
} from './playgroundState'

/**
 * Keeps the Brand shell in sync with the locally persisted Playground draft.
 * The custom event covers changes in this tab; `storage` covers other tabs.
 */
export function useBrandExpressionPreview(): BrandPlaygroundConfig {
  const [config, setConfig] = useState(() => readBrandPlaygroundDraft())

  useEffect(() => {
    const refresh = () => setConfig(readBrandPlaygroundDraft())
    const handleStorage = (event: StorageEvent) => {
      if (event.key === BRAND_PLAYGROUND_DRAFT_KEY) refresh()
    }

    window.addEventListener(BRAND_PLAYGROUND_CHANGE_EVENT, refresh)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(BRAND_PLAYGROUND_CHANGE_EVENT, refresh)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return config
}
