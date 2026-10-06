'use client'

import dynamic from 'next/dynamic'
import { startTransition, useEffect, useState } from 'react'
import { useIsBackgroundOnly } from '@/store/use-sky-background-store'
import { Background } from './background'
import { SkyBackgroundSync } from './background/sky-background-sync'

const DraggableFloatingMenu = dynamic(
  () => import('./draggable-floating-menu').then(module => module.DraggableFloatingMenu),
  { ssr: false },
)

export function MainStage({ children }: { children: React.ReactNode }) {
  const isBackgroundOnly = useIsBackgroundOnly()
  const [areEffectsReady, setAreEffectsReady] = useState(false)

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
      <SkyBackgroundSync />
      {children}
      <Background isCanvasReady={areEffectsReady} />
      {areEffectsReady && <DraggableFloatingMenu />}
    </div>
  )
}
