'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  useCloudSpeed,
  useIsCloudAnimationRunning,
  useIsSkyBackgroundInitialized,
  useSkyBackgroundTimeState,
} from '@/store/use-sky-background-store'
import { SkyBackgroundCanvas } from './sky-background-canvas'
import { SkyBackgroundSync } from './sky-background-sync'

export function Background() {
  const cloudSpeed = useCloudSpeed()
  const isCloudAnimationRunning = useIsCloudAnimationRunning()
  const isInitialized = useIsSkyBackgroundInitialized()
  const [isPageVisible, setIsPageVisible] = useState(true)
  const { timeState } = useSkyBackgroundTimeState()
  const colors = useMemo(
    () => [
      timeState.skyTop,
      timeState.skyUpper,
      timeState.skyMiddle,
      timeState.skyLower,
      timeState.skyBottom,
    ],
    [
      timeState.skyTop,
      timeState.skyUpper,
      timeState.skyMiddle,
      timeState.skyLower,
      timeState.skyBottom,
    ],
  )
  const backgroundStyle = {
    '--site-sky-sky-bottom': timeState.skyBottom,
    '--site-sky-sky-lower': timeState.skyLower,
    '--site-sky-sky-middle': timeState.skyMiddle,
    '--site-sky-sky-top': timeState.skyTop,
    '--site-sky-sky-upper': timeState.skyUpper,
    '--site-sky-star-play-state': timeState.starOpacity > 0 && isPageVisible ? 'running' : 'paused',
    '--site-sky-upper-glow-opacity': timeState.upperGlowOpacity,
    '--site-sky-upper-glow-rgb': timeState.upperGlowRgb,
    '--site-sky-upper-glow-soft-opacity': timeState.upperGlowOpacity * 0.64,
    '--site-sky-warm-glow-opacity': timeState.warmGlowOpacity,
    '--site-sky-warm-glow-rgb': timeState.warmGlowRgb,
    '--site-sky-warm-glow-soft-opacity': timeState.warmGlowOpacity * 0.32,
    '--site-sky-warm-glow-strong-opacity': timeState.warmGlowOpacity * 0.7,
  } as CSSProperties

  useEffect(() => {
    const syncPageVisibility = () => {
      setIsPageVisible(document.visibilityState === 'visible')
    }

    syncPageVisibility()
    document.addEventListener('visibilitychange', syncPageVisibility)

    return () => document.removeEventListener('visibilitychange', syncPageVisibility)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="site-background pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      data-initialized={isInitialized ? '' : undefined}
      style={backgroundStyle}
    >
      <SkyBackgroundSync />
      <div className="site-sky-stars" style={{ opacity: timeState.starOpacity }} />
      {isInitialized && (
        <SkyBackgroundCanvas
          colors={colors}
          isAnimationRunning={isCloudAnimationRunning && isPageVisible}
          speed={cloudSpeed}
        />
      )}
    </div>
  )
}
