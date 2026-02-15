'use client'

import { useEffect, useRef, useState } from 'react'

type UseScrollVisibilityOptions = {
  velocityThreshold?: number
  velocitySmoothing?: number
  topShowOffset?: number
}

const defaultVelocityThreshold = 0.45
const defaultVelocitySmoothing = 0.25
const defaultTopShowOffset = 24

export const useScrollVisibility = (options: UseScrollVisibilityOptions = {}) => {
  const {
    velocityThreshold = defaultVelocityThreshold,
    velocitySmoothing = defaultVelocitySmoothing,
    topShowOffset = defaultTopShowOffset,
  } = options
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const lastTimestampRef = useRef(0)
  const smoothedVelocityRef = useRef(0)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY
    lastTimestampRef.current = performance.now()
    smoothedVelocityRef.current = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const now = performance.now()
      const delta = currentScrollY - lastScrollYRef.current
      const elapsed = now - lastTimestampRef.current

      if (currentScrollY <= topShowOffset) {
        setIsVisible(prev => (prev ? prev : true))
        smoothedVelocityRef.current = 0
        lastScrollYRef.current = currentScrollY
        lastTimestampRef.current = now
        return
      }

      if (elapsed <= 0) {
        lastScrollYRef.current = currentScrollY
        lastTimestampRef.current = now
        return
      }

      const instantVelocity = delta / elapsed
      smoothedVelocityRef.current =
        smoothedVelocityRef.current * (1 - velocitySmoothing) + instantVelocity * velocitySmoothing

      if (Math.abs(smoothedVelocityRef.current) >= velocityThreshold) {
        const nextVisible = smoothedVelocityRef.current < 0
        setIsVisible(prev => (prev === nextVisible ? prev : nextVisible))
      }

      lastScrollYRef.current = currentScrollY
      lastTimestampRef.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [topShowOffset, velocitySmoothing, velocityThreshold])

  return isVisible
}
