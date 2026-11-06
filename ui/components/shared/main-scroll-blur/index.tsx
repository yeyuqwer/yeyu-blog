'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const subscribePortal = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalSnapshot = () => document.querySelector<HTMLElement>('[data-main-scroll-overlay]')
const getServerPortalSnapshot = () => null

export function MainScrollBlur() {
  const [hasContentBelow, setHasContentBelow] = useState(false)
  const [isScrollProgressOpen, setIsScrollProgressOpen] = useState(false)
  const portal = useSyncExternalStore(subscribePortal, getPortalSnapshot, getServerPortalSnapshot)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('[data-main-scroll-container]')
    const scrollEnd = scrollContainer?.querySelector('[data-main-scroll-end]')

    if (scrollContainer == null || scrollEnd == null) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry != null) setHasContentBelow(!entry.isIntersecting)
      },
      { root: scrollContainer },
    )
    observer.observe(scrollEnd)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateScrollProgressState = () => {
      setIsScrollProgressOpen(
        document.querySelector('[data-slot="scroll-progress"][data-open="true"]') != null,
      )
    }

    updateScrollProgressState()

    const observer = new MutationObserver(updateScrollProgressState)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-open'],
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  if (portal == null) return null

  return createPortal(
    <>
      {isScrollProgressOpen && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 bg-transparent backdrop-blur-[1px] select-none"
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-[linear-gradient(transparent,rgba(255,255,255,0.9))] [mask-image:linear-gradient(to_top,black_40%,transparent)] backdrop-blur-[10px] transition-opacity duration-300 select-none [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent)] motion-reduce:transition-none dark:bg-[linear-gradient(transparent,rgba(0,0,0,0.85))] ${hasContentBelow ? 'opacity-100' : 'opacity-0'}`}
      />
    </>,
    portal,
  )
}
