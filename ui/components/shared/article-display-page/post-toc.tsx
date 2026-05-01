'use client'

import type { Heading } from './utils'
import { ChevronDown, TextAlignJustify } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { type FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/common/shadcn'
import { useStartupStore } from '@/store/use-startup-store'

const variants = {
  enter: (direction: number) => ({
    y: direction * 20,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction * -20,
    opacity: 0,
  }),
}

const tocProgressRadius = 34
const tocProgressStrokeWidth = 10

const ArticleBottomShadow = ({
  container,
  visible,
}: {
  container: HTMLElement
  visible: boolean
}) => {
  const ref = useRef(container)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.84, 0.96, 1], [0.95, 0.95, 0.3, 0])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-24 select-none bg-[linear-gradient(transparent,rgb(249,250,250))] backdrop-blur-[16px] [-webkit-mask-image:linear-gradient(to_top,rgb(249,250,250)_50%,transparent)] [mask-image:linear-gradient(to_top,rgb(249,250,250)_50%,transparent)] dark:bg-[linear-gradient(transparent,rgb(9,9,11))] dark:[-webkit-mask-image:linear-gradient(to_top,rgb(9,9,11)_50%,transparent)] dark:[mask-image:linear-gradient(to_top,rgb(9,9,11)_50%,transparent)]"
      style={{ opacity: shadowOpacity }}
    />
  )
}

const TocProgressCircle = ({ container }: { container: HTMLElement }) => {
  const ref = useRef(container)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <motion.circle
      cx="50"
      cy="50"
      r={tocProgressRadius}
      pathLength="1"
      className="fill-none stroke-black/70 dark:stroke-white/70"
      strokeWidth={tocProgressStrokeWidth}
      strokeLinecap="round"
      style={{
        pathLength: scrollYProgress,
      }}
    />
  )
}

export const PostToc: FC<{
  headings: Heading[]
}> = ({ headings }) => {
  const isAnimationComplete = useStartupStore(s => s.isAnimationComplete)
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [articleContent, setArticleContent] = useState<HTMLElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolledRef = useRef(false)

  const prevActiveIdRef = useRef(activeId)
  const directionRef = useRef(1)

  if (activeId !== prevActiveIdRef.current) {
    const currentIndex = headings.findIndex(h => h.id === activeId)
    const prevIndex = headings.findIndex(h => h.id === prevActiveIdRef.current)
    if (prevIndex !== -1 && currentIndex !== -1) {
      directionRef.current = currentIndex > prevIndex ? 1 : -1
    }
    prevActiveIdRef.current = activeId
  }

  useEffect(() => {
    if (isExpanded) {
      if (!hasScrolledRef.current && scrollContainerRef.current && activeId) {
        const activeLink = scrollContainerRef.current.querySelector<HTMLAnchorElement>(
          `a[href="#${activeId}"]`,
        )
        if (activeLink) {
          const container = scrollContainerRef.current
          const top = activeLink.offsetTop
          const linkHeight = activeLink.clientHeight
          const containerHeight = Math.min(container.scrollHeight, window.innerHeight * 0.6)

          container.scrollTo({
            top: top - containerHeight / 2 + linkHeight / 2,
            behavior: 'instant',
          })
          hasScrolledRef.current = true
        }
      }
    } else {
      hasScrolledRef.current = false
    }
  }, [isExpanded, activeId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setArticleContent(document.getElementById('article-content'))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-10% 0px -80% 0px' },
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element != null) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings, mounted])

  if (headings.length === 0) return null
  if (!mounted) return null

  const activeHeading = headings.find(h => h.id === activeId) ?? headings[0]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()

    const element = document.getElementById(id)
    if (element != null) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      setActiveId(id)
      setIsExpanded(false)
    }
  }

  return createPortal(
    <>
      {articleContent != null ? (
        <ArticleBottomShadow container={articleContent} visible={isAnimationComplete} />
      ) : null}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={cn(
          'fixed bottom-8 left-1/2 z-50 -translate-x-1/2',
          'bg-theme-background/80 backdrop-blur-sm dark:bg-black/70',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0_16px_46px_color-mix(in_srgb,var(--theme-400)_34%,transparent)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.58)]',
          'overflow-hidden',
          'max-w-[90vw]',
          isExpanded ? 'rounded-2xl' : 'rounded-full',
        )}
        initial={{ width: 300, y: 100, opacity: 0 }}
        animate={
          isAnimationComplete
            ? {
                width: isExpanded ? 360 : 300,
                y: 0,
                opacity: 1,
              }
            : {
                width: 300,
                y: 100,
                opacity: 0,
                transition: { duration: 0 },
              }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div layout="position" className="flex flex-col">
          <div
            className={cn(
              'flex cursor-pointer items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5',
              'px-2 py-1',
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div className="relative flex max-w-75 items-center justify-between gap-1 truncate font-medium text-sm">
              <figure className="flex items-center justify-center">
                <svg height={28} width={28} viewBox="0 0 100 100" className="-rotate-90">
                  {/* background */}
                  <circle
                    cx="50"
                    cy="50"
                    r={tocProgressRadius}
                    pathLength="1"
                    className="fill-none stroke-black/10 dark:stroke-white/10"
                    strokeWidth={tocProgressStrokeWidth}
                  />

                  {/* progress */}
                  {articleContent != null ? (
                    <TocProgressCircle container={articleContent} />
                  ) : (
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={tocProgressRadius}
                      pathLength="1"
                      className="fill-none stroke-black/70 dark:stroke-white/70"
                      strokeWidth={tocProgressStrokeWidth}
                      strokeLinecap="round"
                      style={{ pathLength: 0 }}
                    />
                  )}
                </svg>
              </figure>
              <AnimatePresence mode="popLayout" initial={false} custom={directionRef.current}>
                <motion.span
                  key={activeHeading?.id}
                  custom={directionRef.current}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="block truncate"
                >
                  {activeHeading?.text ?? '目录'}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <motion.div
              layout="position"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="ml-2 text-muted-foreground"
            >
              {isExpanded ? (
                <TextAlignJustify className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </motion.div>
          </div>

          {/* expanded list */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                ref={scrollContainerRef}
                className="relative max-h-[60vh] overflow-y-auto overflow-x-hidden overscroll-contain border-black/5 border-t dark:border-white/5 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <ul className="flex flex-col gap-1 p-2">
                  {headings.map(heading => (
                    <li
                      key={heading.id}
                      style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                    >
                      <a
                        href={`#${heading.id}`}
                        onClick={e => handleLinkClick(e, heading.id)}
                        className={cn(
                          'block truncate rounded-md px-2 py-1.5 text-sm transition-colors',
                          activeId === heading.id
                            ? 'bg-black/5 font-medium text-foreground dark:bg-white/10'
                            : 'text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5',
                        )}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>,
    document.body,
  )
}
