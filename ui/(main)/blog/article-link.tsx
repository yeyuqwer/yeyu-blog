'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { toDisplayDate } from '@/lib/utils/common/time'
import { useLanguage } from '@/ui/components/provider/main/language-provider'
import {
  waveLinkTriggerClassName,
  waveLinkUnderlineClassName,
} from '@/ui/components/shared/wave-link'

export const ArticleLink = ({
  slug,
  title,
  createdAt,
}: {
  slug: string
  title: string
  createdAt: Date | string
}) => {
  const { language } = useLanguage()

  return (
    <Link
      href={`/${language}/blog/${slug}`}
      className={cn(
        'hover:text-theme-primary focus-visible:outline-theme-ring flex cursor-pointer items-center justify-between gap-4 rounded-sm p-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:gap-10 dark:hover:text-white',
        waveLinkTriggerClassName,
      )}
    >
      <h2
        className={cn(waveLinkUnderlineClassName, 'after:bg-theme-primary min-w-0 pb-1 leading-6')}
      >
        <span className="block truncate">{title}</span>
      </h2>
      <time className="group-hover/wave-link:text-theme-primary shrink-0 text-sm text-zinc-400 transition-colors duration-200 motion-reduce:transition-none dark:group-hover/wave-link:text-white">
        {toDisplayDate(Date.parse(String(createdAt)))}
      </time>
    </Link>
  )
}
