import type { FC } from 'react'
import type { BlogListItem } from '@/lib/api/blog'
import type { NoteListItem } from '@/lib/api/note'
import { TagType } from '@prisma/client'
import Link from 'next/link'
import { cn } from '@/lib/utils/common/shadcn'
import { toDisplayDate } from '@/lib/utils/time'
import ScaleUnderline from '@/ui/components/shared/scale-underline'

export const ArticleLink: FC<{
  item: BlogListItem | NoteListItem
  type: TagType
}> = ({ item, type }) => {
  const isBlog = type === TagType.BLOG
  const isNote = type === TagType.NOTE

  return (
    <Link
      href={isBlog ? `/blog/${item?.slug}` : isNote ? `/note/${item?.slug}` : '/'}
      className={cn(
        'group flex cursor-pointer items-center justify-between gap-10 rounded-sm p-2 duration-500',
        'hover:text-mint-indicator dark:hover:text-white',
      )}
    >
      <h2 className="group relative truncate">
        {item.title}
        <ScaleUnderline className="bg-mint-indicator dark:bg-white" />
      </h2>
      <time className="shrink-0 text-gray-400 text-sm group-hover:text-mint-indicator dark:group-hover:text-white">
        {toDisplayDate(new Date(item.createdAt))}
      </time>
    </Link>
  )
}
