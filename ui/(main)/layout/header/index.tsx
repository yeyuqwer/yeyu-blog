'use client'

import type { NavGroup, RouteItem } from './constant'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIndicatorPosition } from '@/hooks/animation'
import { useIsMounted } from '@/hooks/common'
import { cn } from '@/lib/utils/common/shadcn'
import { useModalStore } from '@/store/use-modal-store'
import { MaxWidthWrapper } from '../../../components/shared/max-width-wrapper'
import { type NavRoute, navigationConfig } from './constant'
import { HoverBackground } from './hover-background'
import { NavItem } from './nav-item'
import { useScrollVisibility } from './use-scroll-visibility'

const flatNavRoutes = navigationConfig.flatMap(route =>
  'group' in route && route.group != null ? route.group.items : [route as NavRoute],
)

const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction < 0 ? 20 : -20,
    opacity: 0,
  }),
}

export default function Header() {
  const pathname = usePathname()
  const activeUrl = flatNavRoutes.find(route => route.pattern.test(pathname))?.path ?? pathname
  const { modalType, onModalClose } = useModalStore()
  const refs = useRef(new Map<string, HTMLElement>())
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isHeaderVisible = useScrollVisibility()
  const mounted = useIsMounted()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <TEMP TODO>
  useEffect(() => {
    onModalClose()
  }, [pathname, onModalClose])

  const effectiveActiveUrl = useMemo(() => {
    if (modalType != null) {
      const modalRoute = flatNavRoutes.find(route => route.modal === modalType)

      if (modalRoute != null) return modalRoute.path
    }
    return activeUrl
  }, [activeUrl, modalType])

  const [groupLastActivePaths, setGroupLastActivePaths] = useState<Record<string, string>>({})
  const [prevActiveUrl, setPrevActiveUrl] = useState(effectiveActiveUrl)

  if (effectiveActiveUrl !== prevActiveUrl) {
    setPrevActiveUrl(effectiveActiveUrl)

    const activeRoute = navigationConfig.find(
      route =>
        'group' in route &&
        route.group != null &&
        route.group.items.some(item => item.path === effectiveActiveUrl),
    )

    if (activeRoute != null && 'group' in activeRoute && activeRoute.group != null) {
      setGroupLastActivePaths(prev => ({
        ...prev,
        [activeRoute.group!.key]: effectiveActiveUrl,
      }))
    }
  }

  const activeKey = useMemo(() => {
    const activeRoute = navigationConfig.find(route => {
      if ('group' in route && route.group != null) {
        return route.group.items.some(item => item.path === effectiveActiveUrl)
      }
      return (route as NavRoute).path === effectiveActiveUrl
    })

    if (activeRoute != null && 'group' in activeRoute && activeRoute.group != null) {
      return activeRoute.group.key
    }
    return (activeRoute as NavRoute)?.path ?? effectiveActiveUrl
  }, [effectiveActiveUrl])

  const isSubmenuOpen = useMemo(() => {
    return navigationConfig.some(
      route => 'group' in route && route.group != null && route.group.key === hoveredPath,
    )
  }, [hoveredPath])

  const indicatorStyle = useIndicatorPosition(activeKey, refs)

  const handleMouseEnter = (path: string) => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const newIndex = navigationConfig.findIndex(r => 'group' in r && r.group?.key === path)
    const oldIndex = navigationConfig.findIndex(r => 'group' in r && r.group?.key === hoveredPath)

    if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
      setDirection(newIndex > oldIndex ? 1 : -1)
    }

    setHoveredPath(path)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredPath(null)
      setDirection(0)
    }, 150)
  }

  const activeGroupRoute = useMemo(() => {
    return navigationConfig.find(
      route => 'group' in route && route.group != null && route.group.key === hoveredPath,
    ) as (RouteItem & { group: NavGroup }) | undefined
  }, [hoveredPath])

  const shouldShowHeader = isHeaderVisible || isSubmenuOpen

  return (
    <motion.header
      className={cn(
        'sticky top-3 z-20 mx-auto mb-4 flex h-9 w-3/4 items-center justify-center will-change-transform md:h-12 md:w-1/2 lg:w-5/12',
        !shouldShowHeader && 'pointer-events-none',
      )}
      initial={false}
      animate={{
        y: shouldShowHeader ? 0 : '-140%',
        opacity: shouldShowHeader ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isSubmenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-10 bg-black/5 backdrop-blur-xs dark:bg-black/20"
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
      <MaxWidthWrapper
        className={cn(
          // TODO: config other colors
          'h-full rounded-full bg-clear-sky-background/80 backdrop-blur-sm dark:bg-black/70',
          'px-2.5 py-1 md:px-3 md:py-2',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0px_4px_10px_0px_#0000001A]',
          'w-full',
        )}
      >
        <nav className="flex h-full items-center justify-between text-nowrap text-sm md:text-xl dark:text-neutral-400">
          {navigationConfig.map(route => {
            if ('group' in route && route.group != null) {
              const isGroupActive = route.group.key === activeKey
              const isGroupHovered = hoveredPath === route.group.key

              const lastActivePath = groupLastActivePaths[route.group.key]
              const mainPath = route.group.mainPath ?? route.group.items[0].path

              const effectivePath =
                route.group.items.find(item => item.path === effectiveActiveUrl)?.path ??
                (lastActivePath != null && route.group.items.some(i => i.path === lastActivePath)
                  ? lastActivePath
                  : null) ??
                mainPath

              const currentItem =
                route.group.items.find(item => item.path === effectivePath) ?? route.group.items[0]
              const currentPathName = currentItem.pathName

              return (
                <div
                  key={route.group.key}
                  ref={el => {
                    if (el != null) refs.current.set(route.group.key, el)
                  }}
                  className="z-10"
                  onMouseEnter={() => handleMouseEnter(route.group.key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <NavItem
                    item={currentItem}
                    className={cn(
                      'block cursor-pointer transition-colors',
                      isGroupActive
                        ? 'font-bold text-clear-sky-active-text dark:text-black'
                        : 'dark:hover:text-neutral-200',
                    )}
                  >
                    <div className="relative px-2 md:px-4">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                          key={currentPathName}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                        >
                          {currentPathName}
                        </motion.h2>
                      </AnimatePresence>
                      <HoverBackground isVisible={!isGroupActive && isGroupHovered} />
                    </div>
                  </NavItem>
                </div>
              )
            }

            const path = route.path
            const pathName = route.pathName

            return (
              <NavItem
                key={path}
                item={route}
                elRef={el => {
                  if (el != null) refs.current.set(path, el)
                }}
                className={cn(
                  'relative z-10 block transition-colors',
                  path === activeKey
                    ? 'font-bold text-clear-sky-active-text dark:text-black'
                    : 'dark:hover:text-neutral-200',
                )}
                onMouseEnter={() => handleMouseEnter(path)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative px-2 md:px-4">
                  <h2>{pathName}</h2>
                  <HoverBackground isVisible={hoveredPath !== activeKey && hoveredPath === path} />
                </div>
              </NavItem>
            )
          })}

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-clear-sky-indicator shadow-md dark:bg-white"
            animate={indicatorStyle}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />

          {/* Submenu */}
          <AnimatePresence>
            {isSubmenuOpen && activeGroupRoute != null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'absolute top-[116%] left-0 w-full overflow-hidden rounded-3xl py-1 backdrop-blur-sm md:py-2',
                  'bg-clear-sky-background/80 dark:bg-black/70',
                  'border border-[#00000011] dark:border-white/10',
                  'shadow-[0px_4px_10px_0px_#0000001A]',
                )}
                onMouseEnter={() => {
                  if (timeoutRef.current != null) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                  }
                }}
                onMouseLeave={handleMouseLeave}
              >
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={activeGroupRoute.group.key}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="flex justify-around px-8 md:px-12"
                  >
                    {activeGroupRoute.group.items.map(item => (
                      <NavItem
                        key={item.path}
                        item={{
                          ...item,
                          disabled:
                            (activeGroupRoute.group.disabled ?? false) || (item.disabled ?? false),
                        }}
                        className={cn(
                          'rounded-lg px-4 py-2 transition-colors',
                          'hover:underline',
                          item.path === effectiveActiveUrl
                            ? 'font-bold text-primary'
                            : 'text-neutral-600 dark:text-neutral-400',
                        )}
                      >
                        {item.pathName}
                      </NavItem>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </MaxWidthWrapper>
    </motion.header>
  )
}
