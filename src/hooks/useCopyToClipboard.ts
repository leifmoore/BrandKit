import { useState, useCallback } from 'react'

export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
      return true
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      try {
        el.select()
        const fallbackCopied = document.execCommand('copy')
        if (!fallbackCopied) return false
        setCopied(true)
        setTimeout(() => setCopied(false), resetMs)
        return true
      } catch {
        return false
      } finally {
        document.body.removeChild(el)
      }
    }
  }, [resetMs])

  return { copied, copy }
}
