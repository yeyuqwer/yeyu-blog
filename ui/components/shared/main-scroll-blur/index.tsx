'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { subscribeScrollContainer } from '@/lib/utils/common/scroll-container-store'

const subscribePortal = (onStoreChange: () => void) => {
  const frame = requestAnimationFrame(onStoreChange)
  return () => cancelAnimationFrame(frame)
}

const getPortalSnapshot = () => document.body
const getServerPortalSnapshot = () => null

export function MainScrollBlur() {
  const [hasContentBelow, setHasContentBelow] = useState(false)
  const [isScrollProgressOpen, setIsScrollProgressOpen] = useState(false)
  const portal = useSyncExternalStore(subscribePortal, getPortalSnapshot, getServerPortalSnapshot)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('[data-main-scroll-container]')

    if (scrollContainer == null) return

    return subscribeScrollContainer(
      scrollContainer,
      ({ clientHeight, scrollHeight, scrollTop }) => {
        const remainingScroll = scrollHeight - scrollTop - clientHeight

        setHasContentBelow(remainingScroll > 1)
      },
    )
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
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-40 bg-transparent backdrop-blur-[1px] transition-opacity duration-300 select-none motion-reduce:transition-none ${isScrollProgressOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-3 bottom-3 z-20 h-16 rounded-b-lg bg-[linear-gradient(transparent,rgba(255,255,255,0.9))] [mask-image:linear-gradient(to_top,black_40%,transparent)] backdrop-blur-[10px] transition-opacity duration-300 select-none [-webkit-mask-image:linear-gradient(to_top,black_40%,transparent)] motion-reduce:transition-none sm:inset-x-5 sm:bottom-5 dark:bg-[linear-gradient(transparent,rgba(0,0,0,0.85))] ${hasContentBelow ? 'opacity-100' : 'opacity-0'}`}
      />
    </>,
    portal,
  )
}
