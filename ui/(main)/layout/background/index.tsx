'use client'

// * thanks https://hypercolor.dev/
import type { FC } from 'react'
import { useTransitionTheme } from '@/hooks/animation'
import { useIsMounted } from '@/hooks/common'
import { cn } from '@/lib/utils/common/shadcn'
// * thanks https://www.mshr.app/mesh/1727202711374
import '@/lib/styles/background-animate.css'
import { ArtPlum } from './art-plum'

export const Background: FC = () => {
  const mounted = useIsMounted()
  const { resolvedTheme } = useTransitionTheme()

  if (!mounted) {
    return <div className="pointer-events-none fixed top-0 left-0 -z-20 min-h-screen w-screen" />
  }

  if (resolvedTheme === 'light') {
    return (
      <>
        <div
          className={cn(
            'pointer-events-none fixed top-0 left-0 -z-20 min-h-screen w-screen',
            'bg-[radial-gradient(ellipse_at_bottom,#38bdf8,#bae6fd)] opacity-45',
            // * 得考虑一下要不要这个动画了，或者再修改一下？
            'animate-background-light',
          )}
        />
        <svg className="pointer-events-none fixed -z-10 size-0">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div
          className={cn(
            'pointer-events-none fixed top-0 left-0 -z-10 min-h-screen w-screen',
            'filter-[url(#grain)] opacity-25',
          )}
        />
      </>
    )
  }

  return (
    <>
      <ArtPlum />
      <div
        className={cn(
          'pointer-events-none fixed top-0 left-0 -z-10 min-h-screen w-screen',
          'filter-[url(#grain)] opacity-25',
        )}
      />
    </>
  )
}
