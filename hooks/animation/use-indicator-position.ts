import { useEffect, useRef, useState } from 'react'

type IndicatorOffset = {
  left?: number
  width?: number
  height?: number
}

const defaultOffset: Required<IndicatorOffset> = {
  left: -4,
  width: 8,
  height: 4,
}

export function useIndicatorPosition(
  activeUrl: string,
  refs: React.MutableRefObject<Map<string, HTMLElement>>,
  offset: IndicatorOffset = {},
) {
  const [style, setStyle] = useState({ left: 0, width: 0, height: 0 })
  const observerRef = useRef<ResizeObserver | null>(null)

  const mergedOffset = { ...defaultOffset, ...offset }

  useEffect(() => {
    const el = refs.current.get(activeUrl)
    if (el == null) return

    const update = () => {
      setStyle({
        left: el.offsetLeft + mergedOffset.left,
        width: el.offsetWidth + mergedOffset.width,
        height: el.offsetHeight + mergedOffset.height,
      })
    }

    update()

    window.addEventListener('resize', update)
    observerRef.current = new ResizeObserver(update)
    observerRef.current.observe(el)

    return () => {
      window.removeEventListener('resize', update)
      observerRef.current?.disconnect()
    }
  }, [activeUrl, refs, mergedOffset.left, mergedOffset.width, mergedOffset.height])

  return style
}
