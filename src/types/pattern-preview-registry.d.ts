declare module 'pattern-preview-registry-runtime' {
  import type { ComponentType } from 'react'

  export interface PatternPreviewRegistration {
    Component: ComponentType<Record<string, unknown>>
    scenarios: Record<string, { title: string; fixture: unknown }>
  }

  export const patternPreviewRegistry: Record<string, PatternPreviewRegistration>
  export type PatternPreviewId = string
}
