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
  const { language, isLanguageChanging } = useLanguage()

  return (
    <div
      key={language}
      className={cn('motion-safe:animate-entry-text', className)}
      style={{ animationDelay: `${isLanguageChanging ? 0 : delay}ms` }}
    >
      {children}
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
  return (
    <figure className={cn('group/avatar motion-safe:animate-entry-avatar', className)}>
      {children}
    </figure>
  )
}
