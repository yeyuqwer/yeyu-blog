'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { toDisplayDate } from '@/lib/utils/common/time'
import { useLanguage } from '@/ui/components/provider/main/language-provider'
import { ScaleUnderline } from './scale-underline'

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
        'group flex cursor-pointer items-center justify-between gap-10 rounded-sm p-2 duration-500',
        'hover:text-theme-accent dark:hover:text-white',
      )}
    >
      <h2 className="group relative truncate">
        {title}
        <ScaleUnderline />
      </h2>
      <time className="group-hover:text-theme-accent shrink-0 text-sm text-zinc-400 dark:group-hover:text-white">
        {toDisplayDate(Date.parse(String(createdAt)))}
      </time>
    </Link>
  )
}
