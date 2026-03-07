import type { TagType } from '@prisma/client'
import type { Variants } from 'motion/react'
import type { ComponentProps, FC } from 'react'
import type { BlogListItem } from '@/lib/api/blog'
import type { NoteListItem } from '@/lib/api/note'
import * as motion from 'motion/react-client'
import { ArticleLink } from './article-link'

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: [30, -8, 0] as number[],
    transition: {
      type: 'tween' as const,
      ease: 'easeInOut',
      duration: 0.8,
    },
  },
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type ArticleListItem = BlogListItem | NoteListItem

// TODO: 大括号样式
export const ArticleList: FC<
  ComponentProps<'div'> & {
    items: ArticleListItem[]
    type: TagType
  }
> = ({ items, type }) => {
  if (items.length === 0) {
    return <p className="m-auto">虚无。</p>
  }

  // * 虽然数据库返回的数据已经有序了，但是做个保险吧
  // * 毕竟服务端渲染好了，到时候这块是静态渲染的，性能问题也不大
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const groupedItems = sortedItems.reduce(
    (acc, item) => {
      const year = new Date(item.createdAt).getFullYear()
      acc[year] ??= []
      acc[year].push(item)
      return acc
    },
    {} as Record<number, ArticleListItem[]>,
  )

  const sortedYears = Object.keys(groupedItems)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <motion.div
      className="group/list flex flex-col gap-10"
      initial="hidden"
      animate="visible"
      variants={listVariants}
    >
      {sortedYears.map(year => (
        <motion.div key={year} className="flex flex-col gap-1" variants={listVariants}>
          <motion.h3
            variants={itemVariants}
            className="ml-2 select-none font-bold text-2xl text-muted-foreground/30"
          >
            # {year}
          </motion.h3>
          <div className="flex flex-col">
            {groupedItems[year].map(v => (
              <motion.div
                variants={itemVariants}
                key={v.id}
                className="transition hover:opacity-100! group-hover/list:opacity-50!"
                whileHover={{
                  scale: 1.01,
                }}
              >
                <ArticleLink item={v} type={type} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
