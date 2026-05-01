import type { useHeaderActiveRoute } from './hooks/use-header-active-route'
import type { useHeaderIndicator } from './hooks/use-header-indicator'
import type { useHeaderSubmenu } from './hooks/use-header-submenu'
import type { RouteItem } from './types'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
import { activeTextShadowClass, inactiveTextShadowClass, isNavGroupRoute } from './constant'
import { HoverBackground } from './hover-background'
import { NavItem } from './nav-item'

export function HeaderRouteItem({
  activeRoute,
  indicator,
  route,
  submenu,
}: {
  activeRoute: ReturnType<typeof useHeaderActiveRoute>
  indicator: ReturnType<typeof useHeaderIndicator>
  route: RouteItem
  submenu: ReturnType<typeof useHeaderSubmenu>
}) {
  if (isNavGroupRoute(route)) {
    const { group } = route
    const currentItem = activeRoute.getGroupCurrentItem(group)
    const isGroupActive = group.key === activeRoute.activeKey
    const isGroupHovered = submenu.state.hoveredPath === group.key

    return (
      <div
        ref={element => indicator.setItemRef(group.key, element)}
        className="z-10"
        {...submenu.getGroupTriggerProps(group.key)}
      >
        <NavItem
          item={currentItem}
          className={cn(
            'block cursor-pointer transition-[color,text-shadow] duration-350 ease-out',
            isGroupActive
              ? cn('text-theme-active-text dark:text-black', activeTextShadowClass)
              : cn('dark:hover:text-neutral-200', inactiveTextShadowClass),
          )}
        >
          <div className="relative px-2 md:px-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={currentItem.pathName}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {currentItem.pathName}
              </motion.h2>
            </AnimatePresence>
            <HoverBackground isVisible={!isGroupActive && isGroupHovered} />
          </div>
        </NavItem>
      </div>
    )
  }

  return (
    <NavItem
      item={route}
      elRef={element => indicator.setItemRef(route.path, element)}
      className={cn(
        'relative z-10 block transition-[color,text-shadow] duration-1000 ease-out',
        route.path === activeRoute.activeKey
          ? cn('text-theme-active-text dark:text-black', activeTextShadowClass)
          : cn('dark:hover:text-neutral-200', inactiveTextShadowClass),
      )}
      {...submenu.getRouteItemProps(route.path)}
    >
      <div className="relative px-2 md:px-4">
        <h2>{route.pathName}</h2>
        <HoverBackground
          isVisible={
            submenu.state.hoveredPath !== activeRoute.activeKey &&
            submenu.state.hoveredPath === route.path
          }
        />
      </div>
    </NavItem>
  )
}
