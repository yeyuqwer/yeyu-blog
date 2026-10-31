'use client'

import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { HomeTextMotion } from './home-motion'

export default function AboutSection() {
  const translations = useTranslations()

  return (
    <div className="mt-10 space-y-7 text-[16px] leading-8">
      {translations.home.about.map((section, index) => (
        <HomeTextMotion key={section.id} delay={140 + index * 40}>
          {section.paragraphs.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </HomeTextMotion>
      ))}
    </div>
  )
}
