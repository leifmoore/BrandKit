import { defineConfig } from '@playwright/test'
import baseConfig from './playwright.config'

export default defineConfig({
  ...baseConfig,
  outputDir: './artifacts/brand-visual-audit',
  testMatch: 'brand.visual-audit.spec.ts',
  workers: 1,
  reporter: [['list']],
  projects: (baseConfig.projects ?? []).map((project) => ({
    ...project,
    metadata: {
      ...project.metadata,
      captureBrandAudit: true,
    },
  })),
})
