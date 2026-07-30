import { useCallback, useEffect, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'scud-dark-mode'
const listeners = new Set<() => void>()
let currentMode: boolean | undefined

function readInitialMode() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getSnapshot() {
  currentMode ??= readInitialMode()
  return currentMode
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function applyMode(isDark: boolean) {
  document.documentElement.classList.toggle('app-dark', isDark)
  localStorage.setItem(STORAGE_KEY, String(isDark))
}

function setMode(isDark: boolean) {
  if (isDark === getSnapshot()) return
  currentMode = isDark
  applyMode(isDark)
  for (const listener of listeners) listener()
}

export function useDarkMode() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, () => false)

  useEffect(() => {
    applyMode(isDark)
  }, [isDark])

  const toggle = useCallback(() => setMode(!getSnapshot()), [])

  return { isDark, toggle }
}
