'use client'

import type { FC } from 'react'
import { ReactLenis } from 'lenis/react'

const LenisScrollProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default LenisScrollProvider
