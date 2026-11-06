'use client'

import type { ScrollProgressSection } from '@/ui/shadcn/scroll-progress'
import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ScrollProgress } from '@/ui/shadcn/scroll-progress'

const emptyScrollProgressState: {
  container: HTMLElement | null
  portal: HTMLElement | null
} = {
  container: null,
  portal: null,
}

let scrollProgressStateSnapshot = emptyScrollProgressState

const subscribeScrollProgressState = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getScrollProgressStateSnapshot = () => {
  const container = document.querySelector<HTMLElement>('[data-main-scroll-container]')
  const portal = document.body

  if (
    scrollProgressStateSnapshot.container === container &&
    scrollProgressStateSnapshot.portal === portal
  ) {
    return scrollProgressStateSnapshot
  }

  scrollProgressStateSnapshot = { container, portal }
  return scrollProgressStateSnapshot
}

const getServerScrollProgressStateSnapshot = () => emptyScrollProgressState

export function ArticleScrollProgress({ sections }: { sections: ScrollProgressSection[] }) {
  const { container, portal } = useSyncExternalStore(
    subscribeScrollProgressState,
    getScrollProgressStateSnapshot,
    getServerScrollProgressStateSnapshot,
  )
  const containerRef = { current: container }

  if (sections.length === 0 || container == null || portal == null) return null

  return createPortal(
    <ScrollProgress className="bottom-14" containerRef={containerRef} sections={sections} />,
    portal,
  )
}
