'use client'

import Image from 'next/image'
import avatar from '@/config/img/avatar.webp'
import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { LanguageText } from '@/ui/components/shared/language-text'
import { HomeAvatarMotion, HomeTextMotion } from './home-motion'
import TechStack from './tech-stack'

export default function ProfileSection() {
  const translations = useTranslations()

  return (
    <header className="grid grid-cols-1 items-center justify-items-center gap-8 md:grid-cols-[180px_1fr] md:justify-items-stretch md:gap-16">
      <HomeAvatarMotion className="size-[180px] shrink-0 overflow-hidden rounded-[64px] border border-[#eaeaea]">
        <Image
          src={avatar}
          alt={translations.home.avatarAlt}
          className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover/avatar:scale-[1.025] motion-reduce:transition-none"
          sizes="180px"
          placeholder="blur"
          preload
          fetchPriority="high"
          draggable={false}
        />
      </HomeAvatarMotion>

      <div className="flex flex-col items-center text-center md:translate-y-[5px] md:items-start md:text-left">
        <HomeTextMotion delay={40}>
          <h1 className="text-xl leading-8 font-bold sm:text-2xl">
            <LanguageText>{translations.home.greeting}</LanguageText>
          </h1>
        </HomeTextMotion>
        <HomeTextMotion delay={80}>
          <p className="mt-[22px] text-[16px] leading-8 font-bold">
            <LanguageText delay={30}>{translations.home.role}</LanguageText>
          </p>
        </HomeTextMotion>
        <TechStack />
      </div>
    </header>
  )
}
