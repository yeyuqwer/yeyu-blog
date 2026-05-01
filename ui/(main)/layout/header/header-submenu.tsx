import type { useHeaderActiveRoute } from './hooks/use-header-active-route'
import type { useHeaderSubmenu } from './hooks/use-header-submenu'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils/common/shadcn'
import { activeTextShadowClass, inactiveTextShadowClass, slideVariants } from './constant'
import { NavItem } from './nav-item'

export function HeaderSubmenu({
  activeRoute,
  submenu,
}: {
  activeRoute: ReturnType<typeof useHeaderActiveRoute>
  submenu: ReturnType<typeof useHeaderSubmenu>
}) {
  const { activeGroupRoute, direction } = submenu.state

  return (
    <AnimatePresence>
      {activeGroupRoute != null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute top-[116%] left-0 w-full overflow-hidden rounded-3xl py-1 backdrop-blur-sm md:py-2',
            'bg-theme-background/80 dark:bg-black/70',
            'border border-[#00000011] dark:border-white/10',
            'shadow-[0px_4px_10px_0px_#0000001A]',
          )}
          {...submenu.panelProps}
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
                    disabled: activeGroupRoute.group.disabled === true || item.disabled === true,
                  }}
                  className={cn(
                    'rounded-lg px-4 py-2 transition-[color,text-shadow] duration-1000 ease-out',
                    'hover:underline',
                    item.path === activeRoute.effectiveActiveUrl
                      ? cn('text-primary', activeTextShadowClass)
                      : cn('text-neutral-600 dark:text-neutral-400', inactiveTextShadowClass),
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
  )
}
