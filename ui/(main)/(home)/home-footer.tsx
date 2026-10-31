'use client'

import { useTranslations } from '@/ui/components/provider/main/language-provider'
import { GitHubIcon, GmailIcon, XIcon } from './assets/social-icons'
import { HomeTextMotion } from './home-motion'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yeyuqwer',
    Icon: GitHubIcon,
  },
  {
    name: 'X',
    url: 'https://x.com/yeyuTvT',
    Icon: XIcon,
  },
  {
    name: 'Gmail',
    url: 'mailto:yeyuqwer@gmail.com',
    Icon: GmailIcon,
  },
]

export default function HomeFooter() {
  const translations = useTranslations()

  return (
    <footer className="mx-auto mt-auto flex w-full max-w-[550px] items-center justify-between gap-4 px-4 pb-1 font-serif text-sm md:px-0">
      <HomeTextMotion className="shrink-0">
        <p className="leading-5">
          © {new Date().getFullYear()} {translations.home.copyrightName}
        </p>
      </HomeTextMotion>

      <nav aria-label={translations.home.socialLinksLabel} className="flex justify-end gap-6">
        {socialLinks.map(({ Icon, name, url }, index) => (
          <a
            aria-label={name}
            className="motion-safe:animate-entry-icon size-5 text-zinc-700 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-zinc-300 dark:hover:text-white dark:focus-visible:outline-white"
            href={url}
            key={url}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <Icon aria-hidden="true" className="size-full" />
          </a>
        ))}
      </nav>
    </footer>
  )
}
