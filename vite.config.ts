import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@comp-lib': path.resolve(__dirname, './_comp-lib'),
      '@scudamores/ui': path.resolve(__dirname, './_comp-lib/react'),
      '@scudamores/patterns': path.resolve(__dirname, './_pattern-lib'),
      'pattern-preview-registry-runtime': path.resolve(
        __dirname,
        './_pattern-lib/react/preview-registry.tsx',
      ),
    },
  },
})
