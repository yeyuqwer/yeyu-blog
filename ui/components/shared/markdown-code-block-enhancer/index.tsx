'use client'

import type { ComponentProps, FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CopyButton } from '@/ui/shadcn/copy-button'

type CopyTarget = {
  content: string
  element: HTMLElement
  id: string
}

export const MarkdownCodeBlockEnhancer: FC<
  ComponentProps<'div'> & {
    rootSelector: string
  }
> = ({ rootSelector }) => {
  const [copyTargets, setCopyTargets] = useState<CopyTarget[]>([])
  const nextCopyRootIdRef = useRef(0)
  const signatureRef = useRef('')

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector)
    if (root == null) {
      signatureRef.current = ''
      setCopyTargets([])
      return
    }

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

    const syncCopyTargets = () => {
      const nextTargets = Array.from(
        root.querySelectorAll<HTMLElement>('[data-code-copy-root="true"]'),
      ).map(element => {
        if (element.dataset.codeCopyRootId == null) {
          element.dataset.codeCopyRootId = String(nextCopyRootIdRef.current++)
        }

        const content =
          element.closest('.md-code-block')?.querySelector<HTMLElement>('pre code')?.textContent ??
          ''

        return {
          content,
          element,
          id: element.dataset.codeCopyRootId,
        }
      })

      const nextSignature = nextTargets
        .map(target => `${target.id}:${target.content}`)
        .join('\u0000')
      if (nextSignature === signatureRef.current) return

      signatureRef.current = nextSignature
      setCopyTargets(nextTargets)
    }

    const handleRootClick = (event: MouseEvent) => {
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
      }
    }

    syncCopyTargets()

    const observer = new MutationObserver(() => {
      syncCopyTargets()
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener('click', handleRootClick)

    return () => {
      observer.disconnect()
      root.removeEventListener('click', handleRootClick)
      signatureRef.current = ''
      setCopyTargets([])
    }
  }, [rootSelector])

  return (
    <>
      {copyTargets.map(target =>
        createPortal(
          <CopyButton
            content={target.content}
            variant="outline"
            size="sm"
            delay={1800}
            disabled={target.content.length === 0}
            className="md-code-copy rounded-[var(--md-code-copy-radius)] border-theme-border bg-theme-background/85 text-theme-primary hover:bg-theme-background/95 hover:text-theme-primary dark:border-input dark:bg-input/30 dark:text-inherit dark:hover:bg-input/50"
          />,
          target.element,
          target.id,
        ),
      )}
    </>
  )
}
