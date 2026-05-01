import { useCallback, useMemo, useRef } from 'react'
import { useIndicatorPosition } from '@/hooks/animation'

export const useHeaderIndicator = (activeKey: string) => {
  const refs = useRef(new Map<string, HTMLElement>())
  const style = useIndicatorPosition(activeKey, refs)

  const setItemRef = useCallback((key: string, element: HTMLElement | null) => {
    if (element == null) {
      refs.current.delete(key)
      return
    }

    refs.current.set(key, element)
  }, [])

  return useMemo(
    () => ({
      setItemRef,
      style,
    }),
    [setItemRef, style],
  )
}
