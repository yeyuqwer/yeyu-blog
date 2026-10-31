'use client'

import dynamic from 'next/dynamic'
import { startTransition, useEffect, useState } from 'react'
import { useIsBackgroundOnly } from '@/store/use-sky-background-store'
import './background/background.css'

const Background = dynamic(() => import('./background').then(module => module.Background), {
  ssr: false,
})

const DraggableFloatingMenu = dynamic(
  () => import('./draggable-floating-menu').then(module => module.DraggableFloatingMenu),
  { ssr: false },
)

export function MainStage({ children }: { children: React.ReactNode }) {
  const isBackgroundOnly = useIsBackgroundOnly()
  const [areEffectsReady, setAreEffectsReady] = useState(false)
  const [isBackgroundReady, setIsBackgroundReady] = useState(false)

  useEffect(() => {
    let timeoutId = 0
    const scheduleBackground = () => {
      // CSS entrance animations can paint before background code is downloaded.
      timeoutId = window.setTimeout(() => {
        startTransition(() => setIsBackgroundReady(true))
      }, 1_000)
    }

    if (document.readyState === 'complete') {
      scheduleBackground()
    } else {
      window.addEventListener('load', scheduleBackground, { once: true })
    }

    return () => {
      window.removeEventListener('load', scheduleBackground)
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    // Let the page paint before downloading and mounting decorative effects.
    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        startTransition(() => setAreEffectsReady(true))
      })
    })

    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <div
      data-background-only={isBackgroundOnly ? '' : undefined}
      className="site-main-stage relative isolate flex h-dvh max-w-screen overflow-hidden p-3 text-black transition-colors duration-300 ease-out sm:p-5 dark:text-white"
    >
      {children}
      {isBackgroundReady && <Background />}
      {areEffectsReady && <DraggableFloatingMenu />}
    </div>
  )
}
