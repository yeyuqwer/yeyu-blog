'use client'

import type { ComponentProps, FC } from 'react'
import { useEffect } from 'react'

const copyResetMS = 1800

export const MarkdownCodeBlockEnhancer: FC<
  ComponentProps<'div'> & {
    rootSelector: string
  }
> = ({ rootSelector }) => {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) return

    const timers = new Map<HTMLButtonElement, number>()

    const scrollToHeading = (anchor: HTMLAnchorElement) => {
      const href = anchor.getAttribute('href') ?? ''
      if (!href.startsWith('#') || href.length <= 1) return

      const headingId = decodeURIComponent(href.slice(1))
      const heading = document.getElementById(headingId)
      if (heading == null) return

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      heading.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })

      window.history.pushState(null, '', `#${headingId}`)
    }

    const resetButtonState = (button: HTMLButtonElement) => {
      button.dataset.copied = 'false'
      const label = button.querySelector<HTMLElement>('[data-copy-label]')
      if (label != null) label.textContent = 'Copy'
    }

    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const headingAnchor = target.closest<HTMLAnchorElement>('a.md-heading-anchor[href^="#"]')
      if (
        headingAnchor != null &&
        root.contains(headingAnchor) &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault()
        scrollToHeading(headingAnchor)
        return
      }

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
        }, copyResetMS)
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
