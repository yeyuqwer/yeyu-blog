import { useTheme } from 'next-themes'
import { useCallback } from 'react'

type Direction = 'left' | 'right' | 'center' | 'top' | 'bottom'

type TransitionOptions = {
  direction?: Direction
  duration?: number
  easing?: string
}

const defaultOptions: Required<Pick<TransitionOptions, 'direction' | 'duration' | 'easing'>> = {
  direction: 'center',
  duration: 450,
  easing: 'ease-in-out',
}

function getClipPathDirection(direction: Direction): [string, string] {
  switch (direction) {
    case 'center':
      return [
        'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)',
        'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      ]
    case 'left':
      return ['inset(0 0 0 100%)', 'inset(0 0 0 0)']
    case 'right':
      return ['inset(0 100% 0 0)', 'inset(0 0 0 0)']
    case 'top':
      return ['inset(100% 0 0 0)', 'inset(0 0 0 0)']
    case 'bottom':
      return ['inset(0 0 100% 0)', 'inset(0 0 0 0)']
    default:
      return getClipPathDirection('center')
  }
}

function canUseViewTransition(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

export function useTransitionTheme() {
  const { setTheme, theme, themes, forcedTheme, resolvedTheme, systemTheme } = useTheme()

  const setTransitionTheme = useCallback(
    (nextTheme: 'light' | 'dark', options?: TransitionOptions) => {
      if (theme === nextTheme) return

      const { direction, duration, easing } = { ...defaultOptions, ...options }

      if (!canUseViewTransition()) {
        setTheme(nextTheme)
        return
      }

      const transition = document.startViewTransition(() => {
        setTheme(nextTheme)
      })

      transition.ready.then(() => {
        const clipPath = getClipPathDirection(direction)
        document.documentElement.animate(
          { clipPath },
          {
            duration,
            easing,
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
    },
    [setTheme, theme],
  )

  return {
    setTransitionTheme,
    theme,
    themes,
    forcedTheme,
    resolvedTheme,
    systemTheme,
  }
}
