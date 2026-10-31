'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { useLanguage } from '@/ui/components/provider/main/language-provider'

export function HomeTextMotion({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { language } = useLanguage()

  return (
    <div
      className={cn('motion-safe:animate-entry-text', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="overflow-hidden">
        <div
          key={language}
          className="motion-safe:animate-language-content [--site-language-offset:-12px] data-[language=en]:[--site-language-offset:12px]"
          data-language={language}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export function HomeAvatarMotion({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <figure className={cn('motion-safe:animate-entry-avatar', className)}>{children}</figure>
}
