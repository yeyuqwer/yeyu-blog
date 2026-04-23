'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { useStartupStore } from '@/store/use-startup-store'

// TODO: 感觉客户端组件还是太多了，后续得想办法再优化一下
export default function HomeContent({
  avatarSlot,
  bioSlot,
  echoSlot,
  techSlot,
}: {
  avatarSlot: ReactNode
  bioSlot: ReactNode
  echoSlot: ReactNode
  techSlot: ReactNode
}) {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const avatarVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  }

  const bioVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  }

  const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <motion.main
      className="flex w-full flex-col items-center justify-center gap-4 pt-16 pb-4"
      initial="hidden"
      animate={isAnimationComplete ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={avatarVariants} className="flex w-full justify-center">
        {avatarSlot}
      </motion.div>

      <motion.div variants={bioVariants} className="flex w-full justify-center">
        {bioSlot}
      </motion.div>

      <motion.div variants={fadeVariants} className="flex w-full justify-center">
        {echoSlot}
      </motion.div>

      <motion.div variants={fadeVariants} className="flex w-full justify-center">
        {techSlot}
      </motion.div>
    </motion.main>
  )
}
