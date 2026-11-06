"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

import { cn } from "@/lib/utils/common/shadcn"
import {
  type ScrollContainerSnapshot,
  subscribeScrollContainer,
} from "@/lib/utils/common/scroll-container-store"

export type ScrollProgressSection = { id: string; label: string; level: number }

const easeInOut = [0.65, 0, 0.35, 1] as const
const layerFade = { duration: 0.24, ease: easeInOut } as const

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

type Size = { width: number; height: number }

const getSectionPaddingLeft = (level: number, rootLevel: number) =>
  `${Math.max(level - rootLevel, 0)}rem`

const findActiveSectionId = (
  headingPositions: { id: string; top: number }[],
  anchorPosition: number,
  initialId: string | undefined
) => {
  let activeId = initialId
  let lowerIndex = 0
  let upperIndex = headingPositions.length - 1

  while (lowerIndex <= upperIndex) {
    const middleIndex = Math.floor((lowerIndex + upperIndex) / 2)
    const heading = headingPositions[middleIndex]

    if (heading === undefined || heading.top > anchorPosition) {
      upperIndex = middleIndex - 1
      continue
    }

    activeId = heading.id
    lowerIndex = middleIndex + 1
  }

  return activeId
}

export type ScrollProgressProps = React.ComponentProps<"div"> & {
  sections?: ScrollProgressSection[]
  containerRef?: React.RefObject<HTMLElement | null>
  offset?: number
}

const ScrollProgress = ({
  className,
  sections = [],
  containerRef,
  offset = 120,
  ...props
}: ScrollProgressProps) => {
  const reduceMotion = useReducedMotion()

  const scrollYProgress = useMotionValue(0)
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  const [activeId, setActiveId] = React.useState<string | undefined>(sections[0]?.id)
  const [open, setOpen] = React.useState(false)

  const activeIdRef = React.useRef(activeId)
  const scrollLock = React.useRef(false)
  const scrollLockTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollOverflow = React.useRef<string | null>(null)

  React.useEffect(() => {
    const scroller = containerRef?.current
    if (scroller == null) return

    let headingPositions: { id: string; top: number }[] = []
    let latestSnapshot: ScrollContainerSnapshot | null = null
    let layoutVersion = -1
    let measurementFrame: number | null = null

    const updateActiveSection = (snapshot: ScrollContainerSnapshot) => {
      if (scrollLock.current || headingPositions.length === 0) return

      const nextActiveId = findActiveSectionId(
        headingPositions,
        snapshot.scrollTop + offset,
        sections[0]?.id
      )

      if (activeIdRef.current === nextActiveId) return

      activeIdRef.current = nextActiveId
      setActiveId(nextActiveId)
    }
    const measureHeadingPositions = () => {
      measurementFrame = null
      if (latestSnapshot == null) return

      const containerTop = scroller.getBoundingClientRect().top
      const scrollTop = latestSnapshot.scrollTop

      headingPositions = sections.flatMap(({ id }) => {
        const heading = document.getElementById(id)
        if (heading == null) return []

        return [
          {
            id,
            top: heading.getBoundingClientRect().top - containerTop + scrollTop,
          },
        ]
      })

      if (latestSnapshot != null) updateActiveSection(latestSnapshot)
    }
    const scheduleHeadingMeasurement = () => {
      if (measurementFrame != null) return
      measurementFrame = requestAnimationFrame(measureHeadingPositions)
    }

    const unsubscribe = subscribeScrollContainer(scroller, snapshot => {
      latestSnapshot = snapshot

      const scrollRange = snapshot.scrollHeight - snapshot.clientHeight
      scrollYProgress.set(
        scrollRange > 0 ? Math.min(snapshot.scrollTop / scrollRange, 1) : 0
      )

      if (layoutVersion !== snapshot.layoutVersion) {
        layoutVersion = snapshot.layoutVersion
        scheduleHeadingMeasurement()
      }

      updateActiveSection(snapshot)
    })

    scheduleHeadingMeasurement()

    return () => {
      unsubscribe()
      if (measurementFrame != null) cancelAnimationFrame(measurementFrame)
    }
  }, [sections, containerRef, offset, scrollYProgress])

  const label = sections.find((s) => s.id === activeId)?.label
  const activeIndex = Math.max(
    sections.findIndex(({ id }) => id === activeId),
    0
  )
  const rootLevel =
    sections.length === 0
      ? 1
      : Math.min(...sections.map(({ level }) => level))

  const collapsedRef = React.useRef<HTMLDivElement>(null)
  const openRef = React.useRef<HTMLDivElement>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const [collapsedSize, setCollapsedSize] = React.useState<Size>()
  const [openSize, setOpenSize] = React.useState<Size>()

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (collapsedRef.current) {
        setCollapsedSize({
          width: collapsedRef.current.offsetWidth,
          height: collapsedRef.current.offsetHeight,
        })
      }
      if (openRef.current) {
        setOpenSize({
          width: openRef.current.offsetWidth,
          height: openRef.current.offsetHeight,
        })
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (collapsedRef.current) ro.observe(collapsedRef.current)
    if (openRef.current) ro.observe(openRef.current)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => ro.disconnect()
  }, [sections])

  React.useEffect(() => {
    if (!open) return
    const scroller = containerRef?.current
    const previousOverflow = scroller == null ? "" : scroller.style.overflow
    scrollOverflow.current = previousOverflow
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (scroller != null) scroller.style.overflow = "hidden"
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      if (scroller != null) scroller.style.overflow = previousOverflow
      scrollOverflow.current = null
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [containerRef, open])

  React.useEffect(() => () => clearTimeout(scrollLockTimer.current), [])

  const selectSection = (id: string) => {
    const scroller = containerRef?.current
    scrollLock.current = true
    clearTimeout(scrollLockTimer.current)
    scrollLockTimer.current = setTimeout(
      () => {
        scrollLock.current = false
      },
      reduceMotion ? 0 : 700
    )

    activeIdRef.current = id
    setActiveId(id)
    setOpen(false)
    if (scroller != null && scrollOverflow.current != null) {
      scroller.style.overflow = scrollOverflow.current
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
  }

  const size = open ? openSize : collapsedSize
  const radius = 30

  const scrollProgressContent = (
    <div
      ref={rootRef}
      data-slot="scroll-progress"
      data-open={open}
      className={cn(
        "fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transition-[translate] duration-300 motion-reduce:transition-none",
        open ? "translate-y-0" : "translate-y-5",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none invisible absolute" aria-hidden>
        <div
          ref={collapsedRef}
          className="flex h-10 w-[min(18.75rem,calc(100vw-2rem))] items-center justify-between gap-3 px-2"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="h-6 w-6 shrink-0" />
            <span className="truncate text-base font-medium leading-5">
              {label}
            </span>
          </span>
          <span className="h-6 w-6 shrink-0" />
        </div>
        <div
          ref={openRef}
          className="max-h-[calc(100dvh-6rem)] w-[min(31.25rem,calc(100vw-2rem))] overflow-hidden px-5 pt-5 pb-14"
          style={{ height: 100 + 26.57 * sections.length }}
        >
          {sections.map((s) => (
            <div
              key={s.id}
              className="flex h-5 items-center pr-3 text-base font-medium leading-5"
              style={{ paddingLeft: getSectionPaddingLeft(s.level, rootLevel) }}
            >
              <span className="whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {size && (
        <motion.div
          data-slot="scroll-progress-surface"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden rounded-[30px] bg-[#09090b] shadow-xl dark:bg-[#2e2e2e]"
          initial={false}
          animate={{
            width: size.width,
            height: size.height,
            borderRadius: radius,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  visualDuration: 0.3,
                  bounce: open ? 0.25 : 0.15,
                }
          }
        >
          <AnimatePresence initial={false} mode="popLayout">
            {open && (
              <motion.ul
                key="list"
                className="absolute inset-x-0 top-0 bottom-10 flex flex-col gap-2 overflow-y-scroll px-5 pt-5 pb-8 [scrollbar-color:rgba(255,255,255,0.5)_rgba(255,255,255,0.1)] [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/50 [&::-webkit-scrollbar-track]:bg-white/10"
                initial={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                transition={layerFade}
              >
                {sections.map((s, i) => {
                  const isActive = s.id === activeId
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => selectSection(s.id)}
                        className={cn(
                          "flex h-5 min-w-0 w-full items-center pr-3 text-left text-base font-medium leading-5 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                        )}
                        style={{ paddingLeft: getSectionPaddingLeft(s.level, rootLevel) }}
                        aria-current={isActive ? "location" : undefined}
                      >
                        <motion.span
                          className="block min-w-0 truncate"
                          initial={
                            reduceMotion
                              ? undefined
                              : { opacity: 0, y: 4, filter: "blur(3px)" }
                          }
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{
                            duration: 0.3,
                            ease: easeInOut,
                            delay: reduceMotion ? 0 : 0.04 + i * 0.03,
                          }}
                        >
                          {s.label}
                        </motion.span>
                      </button>
                    </li>
                  )
                })}
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-label={open ? "Hide sections" : "Show sections"}
            className={cn(
              "absolute inset-x-0 z-10 flex h-10 items-center justify-between gap-3",
              open ? "bottom-1" : "bottom-0",
              open ? "px-5" : "px-2"
            )}
            initial={false}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-bl from-[#6fd9fe] via-[#5ac9f3] to-[#d5f7fb]"
                aria-hidden
              />

              <span className="relative h-10 min-w-0 flex-1 overflow-hidden">
                <motion.ul
                  data-slot="scroll-progress-label"
                  className="pointer-events-none absolute top-2.5 left-0 flex w-full flex-col gap-5 text-base font-medium leading-5 text-white"
                  initial={false}
                  animate={{ y: -40 * activeIndex }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 30 }
                  }
                >
                  {sections.map(({ id, label: sectionLabel }) => (
                    <li key={id} className="h-5 w-full truncate">
                      {sectionLabel}
                    </li>
                  ))}
                </motion.ul>
              </span>
            </span>

            <span className="h-6 w-6 shrink-0">
              <svg
                viewBox="0 0 36 36"
                className="h-full w-full -rotate-90"
                aria-hidden
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  strokeWidth="4"
                  className="stroke-white/50"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="stroke-white"
                  style={{ pathLength: progress }}
                />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  )

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.button
            key="backdrop"
            data-slot="scroll-progress-backdrop"
            type="button"
            aria-label="Hide sections"
            className="fixed inset-0 z-40 cursor-default bg-transparent"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : layerFade}
          />
        )}
      </AnimatePresence>

      {scrollProgressContent}
    </>
  )
}

export { ScrollProgress }
export default ScrollProgress
