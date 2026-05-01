'use client'

import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useState } from 'react'
import { useStartupStore } from '@/store/use-startup-store'

const initialWelcomeText = '业余'
const smoothEase: [number, number, number, number] = [0.76, 0, 0.24, 1]
const lineDuration = 1.56
const panelDelay = 1.28
const panelDuration = 0.68
const contentRevealDelay = 1180
const welcomeTextChars = initialWelcomeText.split('')

export default function StartUpMotion() {
  const setAnimationComplete = useStartupStore(s => s.setAnimationComplete)
  const [isVisible, setIsVisible] = useState(true)
  const scaleY = useMotionValue(0)

  const toLeft = useMotionValue('0%')
  const toRight = useMotionValue('0%')

  useEffect(() => {
    const lineAnimation = animate(scaleY, [0, 1, 0.72, 0], {
      duration: lineDuration,
      times: [0, 0.46, 0.64, 1],
      ease: smoothEase,
    })

    const leftPanelAnimation = animate(toLeft, '-100%', {
      duration: panelDuration,
      ease: smoothEase,
      delay: panelDelay,
    })

    const rightPanelAnimation = animate(toRight, '100%', {
      duration: panelDuration,
      ease: smoothEase,
      delay: panelDelay,
      onComplete: () => {
        setIsVisible(false)
      },
    })

    const contentRevealTimer = window.setTimeout(() => {
      setAnimationComplete(true)
    }, contentRevealDelay)

    return () => {
      window.clearTimeout(contentRevealTimer)
      lineAnimation.stop()
      leftPanelAnimation.stop()
      rightPanelAnimation.stop()
    }
  }, [scaleY, setAnimationComplete, toLeft, toRight])

  if (!isVisible) {
    return null
  }

  return (
    <>
      <motion.span
        className="pointer-events-none fixed top-2/3 left-1/2 z-110 h-screen w-px -translate-x-1/2 bg-white will-change-transform"
        style={{ scaleY }}
      />
      <motion.span
        className="pointer-events-none fixed bottom-2/3 left-1/2 z-110 h-screen w-px -translate-x-1/2 bg-white will-change-transform"
        style={{ scaleY }}
      />

      <motion.div
        className="pointer-events-none fixed top-1/2 left-1/2 z-110 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-5xl text-purple-200 leading-none will-change-[transform,opacity]"
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [12, 0, 0, -8],
          scale: [0.96, 1, 1, 0.98],
        }}
        transition={{
          duration: 1.86,
          times: [0, 0.09, 0.66, 1],
          ease: smoothEase,
        }}
      >
        {welcomeTextChars.map((char, index) => (
          <motion.span
            key={`${index.toString()}-${char}`}
            className="will-change-[transform,opacity]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -6] }}
            transition={{
              duration: 1.68,
              times: [0, 0.09, 0.72, 1],
              ease: smoothEase,
              delay: index * 0.02,
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <motion.span
        className="pointer-events-none fixed top-0 left-0 z-100 h-dvh w-1/2 bg-linear-to-r from-[#22177A] to-[#000957] will-change-transform [backface-visibility:hidden]"
        style={{ x: toLeft }}
      />
      <motion.span
        className="pointer-events-none fixed top-0 right-0 z-100 h-dvh w-1/2 bg-linear-to-l from-[#22177A] to-[#000957] will-change-transform [backface-visibility:hidden]"
        style={{ x: toRight }}
      />
    </>
  )
}
