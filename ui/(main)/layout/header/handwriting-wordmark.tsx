'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'

const handwritingPath =
  'M2 5C5 9 9 14 13 16C16 18 19 13 22 8C24 5 27 3 29 5C26 10 24 17 24 21C24 24 26 25 29 24C31 23 32 19 33 16C32 20 32 24 35 25C39 26 42 18 43 14C42 19 42 24 45 25C49 26 52 18 53 14C52 19 52 24 55 25C59 26 62 18 64 16C66 14 68 14 69 16C70 18 68 21 66 22C64 23 65 25 68 25C73 25 77 17 79 15C78 19 78 24 81 25C85 26 88 19 89 14C88 19 89 24 92 25M89 8C90 6 93 6 94 8C95 10 93 11 91 10'

export function HandwritingWordmark({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.svg
      aria-hidden="true"
      className={cn('h-5 w-16 translate-y-px -skew-x-3 sm:h-7 sm:w-[5.5rem]', className)}
      fill="none"
      focusable="false"
      viewBox="0 0 100 32"
    >
      <motion.path
        d={handwritingPath}
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        pathLength={1}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 1.1, ease: [0.4, 0, 0.2, 1] }
        }
      />
    </motion.svg>
  )
}
