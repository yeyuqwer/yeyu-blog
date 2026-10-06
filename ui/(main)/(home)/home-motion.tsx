'use client'

import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '@/ui/components/provider/main/language-provider'

const homeVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const textVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
}

const avatarVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9, rotate: -3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
  },
}

export function HomeMotion({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()
  const { isLanguageChanging } = useLanguage()

  return (
    <motion.div
      className="contents"
      initial={shouldReduceMotion || isLanguageChanging ? false : 'hidden'}
      animate="visible"
      variants={homeVariants}
    >
      {children}
    </motion.div>
  )
}

export function HomeTextMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { isLanguageChanging, language } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const languageOffset = language === 'en' ? '100%' : '-100%'
  const languageEntryOffset = isLanguageChanging ? 0 : languageOffset
  const contentRefs = useRef(new Map<string, HTMLDivElement>())
  const [contentHeight, setContentHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const content = contentRefs.current.get(language)
    if (!content) return

    const updateContentHeight = () => {
      setContentHeight(content.offsetHeight)
    }

    updateContentHeight()

    const resizeObserver = new ResizeObserver(updateContentHeight)
    resizeObserver.observe(content)

    return () => resizeObserver.disconnect()
  }, [language])

  return (
    <motion.div className={className} variants={textVariants}>
      <motion.div
        animate={contentHeight === null ? undefined : { height: contentHeight }}
        className="overflow-hidden"
        transition={
          shouldReduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 0.2, 1] }
        }
      >
        <div className="grid items-start overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              ref={content => {
                if (content) {
                  contentRefs.current.set(language, content)
                } else {
                  contentRefs.current.delete(language)
                }
              }}
              key={language}
              className="col-start-1 row-start-1 min-w-0"
              initial={shouldReduceMotion ? false : { opacity: 0, y: languageEntryOffset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 0,
                transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
              }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HomeAvatarMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.figure className={className} variants={avatarVariants}>
      {children}
    </motion.figure>
  )
}
