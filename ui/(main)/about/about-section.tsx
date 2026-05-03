import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import * as motion from 'motion/react-client'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '@/ui/components/shared/max-width-wrapper'

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0] as number[],
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

export function AboutSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className="flex h-[calc(100dvh-100px)] w-full snap-center flex-col items-center justify-center p-4">
      <MaxWidthWrapper>
        <motion.div
          className={cn(
            'flex flex-col items-center justify-center gap-4 text-center md:text-lg',
            className,
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.45, once: true }}
          variants={sectionVariants}
        >
          {children}
        </motion.div>
      </MaxWidthWrapper>
    </section>
  )
}

export function AboutLine({ children }: { children: ReactNode }) {
  return <motion.div variants={lineVariants}>{children}</motion.div>
}
