'use client'

import type { PublicEchoCardData } from '@/lib/api/echo/type'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useMemo } from 'react'

type EchoCardData = NonNullable<PublicEchoCardData>

function getContentVariants(shouldReduceMotion: ReturnType<typeof useReducedMotion>): Variants {
  return {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(2px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
    exit: shouldReduceMotion
      ? { opacity: 0, transition: { duration: 0.15 } }
      : {
          opacity: 0,
          y: -8,
          filter: 'blur(2px)',
          transition: { duration: 0.2, ease: 'easeIn' },
        },
  }
}

function getLineVariants(shouldReduceMotion: ReturnType<typeof useReducedMotion>): Variants {
  return {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.18 : 0.28, ease: 'easeOut' },
    },
  }
}

export default function EchoCardContent({ echo }: { echo: EchoCardData }) {
  const shouldReduceMotion = useReducedMotion()
  const contentVariants = useMemo(
    () => getContentVariants(shouldReduceMotion),
    [shouldReduceMotion],
  )
  const lineVariants = useMemo(() => getLineVariants(shouldReduceMotion), [shouldReduceMotion])

  return (
    <motion.section layout className="mt-4 flex w-2/3 flex-col">
      <motion.blockquote
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="flex flex-col"
      >
        <motion.p
          variants={lineVariants}
          className="underline decoration-black drop-shadow-[0_0_0.75rem_var(--theme-indicator)] dark:decoration-white dark:drop-shadow-[0_0_10px_var(--theme-400)]"
        >
          {echo.content}
        </motion.p>
        <motion.footer
          variants={lineVariants}
          className="ml-auto text-sm text-theme-primary drop-shadow-[0_0_0.75rem_var(--theme-indicator)] dark:text-theme-400 dark:drop-shadow-[0_0_10px_var(--theme-400)]"
        >
          「{echo.reference}」
        </motion.footer>
      </motion.blockquote>
    </motion.section>
  )
}
