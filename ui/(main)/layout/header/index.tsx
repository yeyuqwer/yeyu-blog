'use client'

import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@/hooks/common'
import { cn } from '@/lib/utils/common/shadcn'
import { MaxWidthWrapper } from '../../../components/shared/max-width-wrapper'
import { isNavGroupRoute, navigationConfig } from './constant'
import { HeaderRouteItem } from './header-route-item'
import { HeaderSubmenu } from './header-submenu'
import { useHeaderActiveRoute } from './hooks/use-header-active-route'
import { useHeaderIndicator } from './hooks/use-header-indicator'
import { useHeaderSubmenu } from './hooks/use-header-submenu'
import { useScrollVisibility } from './hooks/use-scroll-visibility'

export default function Header() {
  const isHeaderVisible = useScrollVisibility()
  const mounted = useIsMounted()
  const activeRoute = useHeaderActiveRoute()
  const submenu = useHeaderSubmenu()
  const indicator = useHeaderIndicator(activeRoute.activeKey)

  const shouldShowHeader = isHeaderVisible || submenu.state.isOpen

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
            {submenu.state.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-10 bg-black/5 backdrop-blur-xs dark:bg-black/20"
                onClick={submenu.close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
      <MaxWidthWrapper
        className={cn(
          // TODO: config other colors
          'h-full rounded-full bg-theme-background/80 backdrop-blur-sm dark:bg-black/70',
          'px-2.5 py-1 md:px-3 md:py-2',
          'border border-[#00000011] dark:border-white/10',
          'shadow-[0px_4px_10px_0px_#0000001A]',
          'w-full',
        )}
      >
        <nav className="flex h-full items-center justify-between text-nowrap text-sm md:text-xl dark:text-neutral-400">
          {navigationConfig.map(route => (
            <HeaderRouteItem
              key={isNavGroupRoute(route) ? route.group.key : route.path}
              activeRoute={activeRoute}
              indicator={indicator}
              route={route}
              submenu={submenu}
            />
          ))}

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-theme-indicator shadow-md dark:bg-white"
            animate={indicator.style}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 16,
            }}
          />

          <HeaderSubmenu activeRoute={activeRoute} submenu={submenu} />
        </nav>
      </MaxWidthWrapper>
    </motion.header>
  )
}
