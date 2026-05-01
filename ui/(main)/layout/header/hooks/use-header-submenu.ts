import type { MouseEvent, PointerEvent } from 'react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { navGroupIndexMap, navGroupRouteMap } from '../constant'

const closeDelay = 150

const getNavGroupIndex = (path: string | null) => {
  if (path == null) return -1

  return navGroupIndexMap.get(path) ?? -1
}

export const useHeaderSubmenu = () => {
  const pathname = usePathname()
  const routePathnameRef = useRef(pathname)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchTargetPathRef = useRef<string | null>(null)
  const touchStartedOpenPathRef = useRef<string | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)

  const activeGroupRoute = useMemo(() => {
    if (hoveredPath == null) return undefined

    return navGroupRouteMap.get(hoveredPath)
  }, [hoveredPath])

  const clearCloseTimer = useCallback(() => {
    if (timeoutRef.current == null) return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }, [])

  const showNavPath = useCallback(
    (path: string) => {
      clearCloseTimer()

      const newIndex = getNavGroupIndex(path)
      const oldIndex = getNavGroupIndex(hoveredPath)

      if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
        setDirection(newIndex > oldIndex ? 1 : -1)
      } else if (newIndex === -1 || oldIndex === -1) {
        setDirection(0)
      }

      setHoveredPath(path)
    },
    [clearCloseTimer, hoveredPath],
  )

  const close = useCallback(() => {
    clearCloseTimer()
    touchTargetPathRef.current = null
    touchStartedOpenPathRef.current = null
    setHoveredPath(null)
    setDirection(0)
  }, [clearCloseTimer])

  useEffect(() => {
    if (routePathnameRef.current === pathname) return

    routePathnameRef.current = pathname
    close()
  }, [pathname, close])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [clearCloseTimer])

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLElement>, path: string) => {
      if (event.pointerType !== 'mouse') return

      showNavPath(path)
    },
    [showNavPath],
  )

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return

      clearCloseTimer()
      timeoutRef.current = setTimeout(() => {
        close()
      }, closeDelay)
    },
    [clearCloseTimer, close],
  )

  const handleGroupPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>, path: string) => {
      if (event.pointerType === 'mouse') {
        touchTargetPathRef.current = null
        touchStartedOpenPathRef.current = null
        return
      }

      touchTargetPathRef.current = path
      touchStartedOpenPathRef.current = hoveredPath === path ? path : null
    },
    [hoveredPath],
  )

  const handleGroupClickCapture = useCallback(
    (event: MouseEvent<HTMLElement>, path: string) => {
      if (touchTargetPathRef.current !== path) return

      event.preventDefault()
      event.stopPropagation()

      if (touchStartedOpenPathRef.current === path) {
        close()
      } else {
        showNavPath(path)
      }

      touchTargetPathRef.current = null
      touchStartedOpenPathRef.current = null
    },
    [close, showNavPath],
  )

  const state = useMemo(
    () => ({
      activeGroupRoute,
      direction,
      hoveredPath,
      isOpen: activeGroupRoute != null,
    }),
    [activeGroupRoute, direction, hoveredPath],
  )

  const getRouteItemProps = useCallback(
    (path: string) => ({
      onPointerEnter: (event: PointerEvent<HTMLElement>) => handlePointerEnter(event, path),
      onPointerLeave: handlePointerLeave,
    }),
    [handlePointerEnter, handlePointerLeave],
  )

  const getGroupTriggerProps = useCallback(
    (path: string) => ({
      onClickCapture: (event: MouseEvent<HTMLElement>) => handleGroupClickCapture(event, path),
      onPointerDownCapture: (event: PointerEvent<HTMLElement>) =>
        handleGroupPointerDown(event, path),
      ...getRouteItemProps(path),
    }),
    [getRouteItemProps, handleGroupClickCapture, handleGroupPointerDown],
  )

  const panelProps = useMemo(
    () => ({
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType !== 'mouse') return

        clearCloseTimer()
      },
      onPointerLeave: handlePointerLeave,
    }),
    [clearCloseTimer, handlePointerLeave],
  )

  return useMemo(
    () => ({
      close,
      getGroupTriggerProps,
      getRouteItemProps,
      panelProps,
      state,
    }),
    [close, getGroupTriggerProps, getRouteItemProps, panelProps, state],
  )
}
