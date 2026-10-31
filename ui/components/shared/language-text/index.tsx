'use client'

import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useLanguage } from '@/ui/components/provider/main/language-provider'

export function LanguageText({
  children,
  className,
  delay = 0,
}: {
  children: string
  className?: string
  delay?: number
}) {
  const { language } = useLanguage()
  const elementRef = useRef<HTMLSpanElement>(null)
  const previous = useRef({ language, text: children })

  useLayoutEffect(() => {
    const changed = previous.current.language !== language && previous.current.text !== children
    previous.current = { language, text: children }

    const element = elementRef.current
    if (!changed || !element || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return

    const bounds = element.getBoundingClientRect()
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return

    const animation = element.animate(
      [
        { opacity: 0, filter: 'blur(6px)', translate: '0 0.25em' },
        { opacity: 1, filter: 'blur(0px)', translate: '0 0' },
      ],
      {
        duration: 360,
        delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'backwards',
      },
    )

    return () => animation.cancel()
  }, [children, delay, language])

  return (
    <span ref={elementRef} className={cn('inline-block max-w-full', className)}>
      {children}
    </span>
  )
}
