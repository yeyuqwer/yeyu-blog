'use client'

import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { HomeTextMotion } from './home-motion'

export default function AboutSection() {
  const translations = useTranslations()

  return (
    <div className="mt-10 space-y-7 text-[16px] leading-8">
      {translations.home.about.map((section, index) => (
        <HomeTextMotion key={section.id} delay={140 + index * 40}>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              <LanguageText delay={index * 30 + paragraphIndex * 15}>{paragraph}</LanguageText>
            </p>
          ))}
        </HomeTextMotion>
      ))}
    </div>
  )
}
