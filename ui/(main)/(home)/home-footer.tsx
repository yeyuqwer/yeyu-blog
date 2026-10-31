'use client'

import type { Variants } from 'motion/react'
import * as motion from 'motion/react-client'
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

const socialLinksVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const socialLinkVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HomeFooter() {
  const translations = useTranslations()

  return (
    <footer className="mx-auto mt-auto flex w-full max-w-[550px] items-center justify-between gap-4 px-4 pb-1 font-serif text-sm md:px-0">
      <HomeTextMotion className="shrink-0">
        <p className="leading-5">
          © {new Date().getFullYear()} {translations.home.copyrightName}
        </p>
      </HomeTextMotion>

      <motion.nav
        aria-label={translations.home.socialLinksLabel}
        className="flex justify-end gap-6"
        variants={socialLinksVariants}
      >
        {socialLinks.map(({ Icon, name, url }) => (
          <motion.a
            aria-label={name}
            className="size-5 text-zinc-700 transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black dark:text-zinc-300 dark:hover:text-white dark:focus-visible:outline-white"
            href={url}
            key={url}
            target="_blank"
            rel="noreferrer"
            variants={socialLinkVariants}
          >
            <Icon aria-hidden="true" className="size-full" />
          </motion.a>
        ))}
      </motion.nav>
    </footer>
  )
}
