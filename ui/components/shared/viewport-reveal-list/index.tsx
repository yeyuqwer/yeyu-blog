'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useLanguage } from '@/ui/components/provider/main/language-provider'

const revealInterval = 100
const revealAmount = 0.2

export function ViewportRevealList({
  children,
  interval = revealInterval,
}: {
  children: ReactNode
  interval?: number
}) {
  const scope = useRef<HTMLDivElement>(null)
  const { isLanguageChanging } = useLanguage()

  useEffect(() => {
    const container = scope.current
    if (!container) return

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('[data-viewport-reveal-item]'),
      (element, index) => ({
        element,
        content: element.firstElementChild as HTMLElement,
        index,
      }),
    )
    if (items.length === 0) return

    const scrollContainer = container.closest('[data-main-scroll-container]')
    if (!scrollContainer) return

    const viewport = scrollContainer.getBoundingClientRect()
    const itemsByElement = new Map<Element, (typeof items)[number]>(
      items.map(item => [item.element, item]),
    )

    // Keep server-rendered content visible; only hide items outside the first viewport.
    for (const item of items) {
      if (item.content.dataset.revealed !== undefined) continue

      if (isLanguageChanging) {
        delete item.content.dataset.revealPending
        continue
      }

      const bounds = item.element.getBoundingClientRect()
      if (bounds.bottom <= viewport.top || bounds.top >= viewport.bottom) {
        item.content.dataset.revealPending = ''
      }
    }
    if (isLanguageChanging) return

    const observer = new IntersectionObserver(
      entries => {
        const visibleItems = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio >= revealAmount)
          .map(entry => itemsByElement.get(entry.target))
          .filter(item => item !== undefined)
          .sort((first, second) => first.index - second.index)

        visibleItems.forEach((item, index) => {
          item.content.style.animationDelay = `${index * interval}ms`
          item.content.style.setProperty('--viewport-reveal-delay', `${index * interval}ms`)
          delete item.content.dataset.revealPending
          item.content.dataset.revealed = ''
          observer.unobserve(item.element)
        })
      },
      { root: scrollContainer, threshold: revealAmount },
    )

    for (const item of items) {
      if (item.content.dataset.revealed === undefined) observer.observe(item.element)
    }

    return () => {
      observer.disconnect()
      for (const item of items) delete item.content.dataset.revealPending
    }
  }, [interval, isLanguageChanging])

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  )
}

export function ViewportRevealItem({
  as,
  children,
  className,
  animation = 'bounce',
}: {
  as: 'div' | 'h3' | 'li'
  children: ReactNode
  className?: string
  animation?: 'bounce' | 'blur' | 'blueprint'
}) {
  const Component = as
  const Content = as === 'h3' ? 'span' : 'div'

  return (
    <Component data-viewport-reveal-item className={className}>
      <Content
        className={cn(
          'block w-full [--viewport-reveal-delay:0ms] motion-safe:data-[reveal-pending]:pointer-events-none motion-safe:data-[reveal-pending]:opacity-0',
          animation === 'blueprint'
            ? 'group/viewport-reveal motion-safe:data-[revealed]:animate-blueprint-rise relative motion-safe:data-[reveal-pending]:translate-y-5'
            : animation === 'blur'
              ? 'motion-safe:data-[revealed]:animate-entry-blur motion-safe:data-[reveal-pending]:translate-y-3 motion-safe:data-[reveal-pending]:blur-[8px]'
              : 'motion-safe:data-[revealed]:animate-entry-bounce [--site-entry-overshoot:-8px] motion-safe:data-[reveal-pending]:translate-y-10',
        )}
      >
        {children}
      </Content>
    </Component>
  )
}
