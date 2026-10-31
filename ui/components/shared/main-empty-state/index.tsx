'use client'

import type { ComponentProps } from 'react'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'

export function MainEmptyState(props: Omit<ComponentProps<'p'>, 'children'>) {
  const translations = useTranslations()

  return (
    <p {...props}>
      <LanguageText>{translations.common.empty}</LanguageText>
    </p>
  )
}
