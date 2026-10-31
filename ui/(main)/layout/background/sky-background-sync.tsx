'use client'

import { useEffect } from 'react'
import {
  useIsSkyBackgroundInitialized,
  useIsUsingRealTime,
  useSkyBackgroundActions,
} from '@/store/use-sky-background-store'
import { getMinutesOfDay } from './sky-background-time'

const millisecondsPerMinute = 60_000

export function SkyBackgroundSync() {
  const isInitialized = useIsSkyBackgroundInitialized()
  const isUsingRealTime = useIsUsingRealTime()
  const { initializeSkyBackground, setRealTimeMinutesOfDay } = useSkyBackgroundActions()

  useEffect(() => {
    const now = new Date()

    initializeSkyBackground(getMinutesOfDay(now))
  }, [initializeSkyBackground])

  useEffect(() => {
    if (!isInitialized || !isUsingRealTime) return

    let timeoutId = 0
    const scheduleNextSync = () => {
      const now = new Date()

      timeoutId = window.setTimeout(
        () => {
          setRealTimeMinutesOfDay(getMinutesOfDay(new Date()))
          scheduleNextSync()
        },
        millisecondsPerMinute - now.getSeconds() * 1000 - now.getMilliseconds(),
      )
    }

    scheduleNextSync()

    return () => window.clearTimeout(timeoutId)
  }, [isInitialized, isUsingRealTime, setRealTimeMinutesOfDay])

  return null
}
