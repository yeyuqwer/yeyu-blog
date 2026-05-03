'use client'

import { useEffect } from 'react'

export function AboutPageEffects() {
  useEffect(() => {
    document.documentElement.classList.add('snap-y', 'snap-mandatory')

    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory')
    }
  }, [])

  return null
}
