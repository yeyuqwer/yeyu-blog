import type { NavGroup } from '../types'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModalStore } from '@/store/use-modal-store'
import { flatNavRoutes, navRouteGroupMap, navRoutePathMap } from '../constant'

export const useHeaderActiveRoute = () => {
  const pathname = usePathname()
  const modalType = useModalStore(s => s.modalType)
  const closeModal = useModalStore(s => s.closeModal)
  const [groupLastActivePaths, setGroupLastActivePaths] = useState<Record<string, string>>({})

  useEffect(() => {
    closeModal()
  }, [closeModal])

  const activeUrl = useMemo(() => {
    return flatNavRoutes.find(route => route.pattern.test(pathname))?.path ?? pathname
  }, [pathname])

  const effectiveActiveUrl = useMemo(() => {
    if (modalType != null) {
      const modalRoute = flatNavRoutes.find(route => route.modal === modalType)

      if (modalRoute != null) return modalRoute.path
    }

    return activeUrl
  }, [activeUrl, modalType])

  const activeRouteGroup = useMemo(() => {
    return navRouteGroupMap.get(effectiveActiveUrl)
  }, [effectiveActiveUrl])

  useEffect(() => {
    if (activeRouteGroup == null) return

    const { key } = activeRouteGroup.group

    setGroupLastActivePaths(prev => {
      if (prev[key] === effectiveActiveUrl) return prev

      return {
        ...prev,
        [key]: effectiveActiveUrl,
      }
    })
  }, [activeRouteGroup, effectiveActiveUrl])

  const activeKey = useMemo(() => {
    if (activeRouteGroup != null) return activeRouteGroup.group.key

    const activeRoute = navRoutePathMap.get(effectiveActiveUrl)

    return activeRoute?.path ?? effectiveActiveUrl
  }, [activeRouteGroup, effectiveActiveUrl])

  const getGroupCurrentItem = useCallback(
    (group: NavGroup) => {
      const activeItem = group.items.find(item => item.path === effectiveActiveUrl)

      if (activeItem != null) return activeItem

      const lastActivePath = groupLastActivePaths[group.key]
      const lastActiveItem = group.items.find(item => item.path === lastActivePath)

      if (lastActiveItem != null) return lastActiveItem

      const mainItem =
        group.mainPath == null ? undefined : group.items.find(item => item.path === group.mainPath)

      return mainItem ?? group.items[0]
    },
    [effectiveActiveUrl, groupLastActivePaths],
  )

  return useMemo(
    () => ({
      activeKey,
      effectiveActiveUrl,
      getGroupCurrentItem,
    }),
    [activeKey, effectiveActiveUrl, getGroupCurrentItem],
  )
}
