'use client'

import { useEffect } from 'react'

const COPY_RESET_MS = 1800

export default function MarkdownCodeBlockEnhancer({ rootSelector }: { rootSelector: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) return

    const timers = new Map<HTMLButtonElement, number>()

    const resetButtonState = (button: HTMLButtonElement) => {
      button.dataset.copied = 'false'
      const label = button.querySelector<HTMLElement>('[data-copy-label]')
      if (label != null) label.textContent = 'Copy'
    }

    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const button = target.closest<HTMLButtonElement>('button[data-code-copy]')
      if (button == null || !root.contains(button)) return

      event.preventDefault()
      const codeElement = button.closest('.md-code-block')?.querySelector<HTMLElement>('pre code')
      if (codeElement == null) return

      const codeText = codeElement.textContent ?? ''
      if (codeText.length === 0) return

      try {
        await navigator.clipboard.writeText(codeText)

        button.dataset.copied = 'true'
        const label = button.querySelector<HTMLElement>('[data-copy-label]')
        if (label != null) label.textContent = 'Copied'

        const previousTimer = timers.get(button)
        if (previousTimer != null) window.clearTimeout(previousTimer)

        const timer = window.setTimeout(() => {
          resetButtonState(button)
          timers.delete(button)
        }, COPY_RESET_MS)
        timers.set(button, timer)
      } catch {
        resetButtonState(button)
      }
    }

    root.addEventListener('click', handleCopyClick)
    return () => {
      root.removeEventListener('click', handleCopyClick)
      for (const timer of timers.values()) {
        window.clearTimeout(timer)
      }
      timers.clear()
    }
  }, [rootSelector])

  return null
}
