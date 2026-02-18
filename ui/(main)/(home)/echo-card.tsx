'use client'

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { usePublicEchoQuery } from '@/hooks/api/echo'
import Loading from '@/ui/components/shared/loading'

export default function EchoCard() {
  const { data, isPending } = usePublicEchoQuery()
  const echo = data
  const shouldReduceMotion = useReducedMotion()

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

  const loadingKey = 'echo-loading'
  const contentKey = `${echo?.id ?? 'empty'}-${echo?.createdAt ?? ''}-${echo?.content ?? ''}-${echo?.reference ?? ''}`

  return (
    <motion.section layout className="mt-4 flex w-2/3 flex-col">
      <AnimatePresence mode="wait" initial={false}>
        {isPending ? (
          <motion.div
            key={loadingKey}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full"
          >
            <Loading />
          </motion.div>
        ) : (
          <motion.blockquote
            key={contentKey}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="flex flex-col"
          >
            <motion.p
              suppressHydrationWarning
              variants={lineVariants}
              className="underline drop-shadow-[0_0_0.75rem_#1babbb] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            >
              {echo?.content ?? '虚无。'}
            </motion.p>
            <motion.footer
              suppressHydrationWarning
              variants={lineVariants}
              className="ml-auto font-thin text-pink-600 text-sm drop-shadow-[0_0_0.75rem_#1babbb] dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            >
              「{echo?.reference ?? '无名。'}」
            </motion.footer>
          </motion.blockquote>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
