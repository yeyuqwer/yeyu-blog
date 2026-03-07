'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useEffect } from 'react'
import { useHomeEchoStore } from '@/store/use-home-echo-store'

export type EchoCardViewData = {
  id: number
  content: string
  reference: string
} | null

export default function EchoCardContent({ echo }: { echo: EchoCardViewData }) {
  const shouldReduceMotion = useReducedMotion()
  const initialEcho = useHomeEchoStore(state => state.initialEcho)
  const setInitialEcho = useHomeEchoStore(state => state.setInitialEcho)
  const displayEcho = initialEcho === undefined ? echo : initialEcho

  useEffect(() => {
    if (initialEcho === undefined) {
      setInitialEcho(echo)
    }
  }, [echo, initialEcho, setInitialEcho])

  const contentVariants: Variants = {
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

  const lineVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.18 : 0.28, ease: 'easeOut' },
    },
  }

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
          suppressHydrationWarning
          variants={lineVariants}
          className="underline drop-shadow-[0_0_0.75rem_#1babbb] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        >
          {displayEcho?.content ?? '虚无。'}
        </motion.p>
        <motion.footer
          suppressHydrationWarning
          variants={lineVariants}
          className="ml-auto font-thin text-pink-600 text-sm drop-shadow-[0_0_0.75rem_#1babbb] dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        >
          「{displayEcho?.reference ?? '无名。'}」
        </motion.footer>
      </motion.blockquote>
    </motion.section>
  )
}
