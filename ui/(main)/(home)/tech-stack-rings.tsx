'use client'

import type { CSSProperties, ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'motion/react'

export function TechStackRings({
  outerItems,
  innerItems,
  ringBaseCount,
}: {
  outerItems: { key: string; component: ReactNode }[]
  innerItems: { key: string; component: ReactNode }[]
  ringBaseCount: number
}) {
  const rotation = useMotionValue(0)
  const reverseRotation = useTransform(rotation, value => -value)
  const speed = useSpring(1, { stiffness: 40, damping: 20 })

  useAnimationFrame((_time, delta) => {
    const currentRotation = rotation.get()
    const currentSpeed = speed.get()
    const baseSpeed = 360 / 24000
    rotation.set(currentRotation + baseSpeed * delta * currentSpeed)
  })

  const stopRotation = () => {
    speed.set(0)
  }

  const startRotation = () => {
    speed.set(1)
  }

  return (
    <section
      style={
        {
          '--n': ringBaseCount,
          '--outer-r': `calc(max(var(--min-r), calc((var(--n) * var(--view-w) / ${ringBaseCount > 5 ? 4 : 3}) / 6.28)) * 1.08)`,
          '--inner-r': 'calc(var(--outer-r) * 0.72)',
          width: 'calc(var(--outer-r) * 2)',
          height: 'calc(var(--outer-r) * 2)',
        } as CSSProperties & Record<'--n' | '--outer-r' | '--inner-r', string | number>
      }
      className="relative rounded-full [--min-r:176px] [--s:64px] [--view-w:100vw] md:[--min-r:344px] md:[--s:128px] md:[--view-w:64rem]"
    >
      <motion.div style={{ rotate: rotation }} className="absolute inset-0">
        {outerItems.map((item, i) => (
          <motion.div
            key={`outer-${item.key}-${i}`}
            onHoverStart={stopRotation}
            onHoverEnd={startRotation}
            className="absolute left-1/2 z-10 size-12 -translate-x-1/2 transition md:size-24"
            style={{
              rotate: i * (360 / outerItems.length),
              transformOrigin: 'center var(--outer-r)',
            }}
          >
            {item.component}
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        style={{
          rotate: reverseRotation,
          width: 'calc(var(--inner-r) * 2)',
          height: 'calc(var(--inner-r) * 2)',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {innerItems.map((item, i) => (
          <motion.div
            key={`inner-${item.key}-${i}`}
            onHoverStart={stopRotation}
            onHoverEnd={startRotation}
            className="absolute left-1/2 z-20 size-[2.5rem] -translate-x-1/2 transition md:size-[5rem]"
            style={{
              rotate: i * (360 / innerItems.length),
              transformOrigin: 'center var(--inner-r)',
            }}
          >
            {item.component}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
