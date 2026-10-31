import type { BlogListItem } from '@/lib/api/blog/type'
import * as motion from 'motion/react-client'
import { MainEmptyState } from '@/ui/components/shared/main-empty-state'
import { MainScrollBlur } from '@/ui/components/shared/main-scroll-blur'
import { ViewportRevealItem, ViewportRevealList } from '@/ui/components/shared/viewport-reveal-list'
import { ArticleLink } from './article-link'

// TODO: 大括号样式
export const ArticleList = ({ items }: { items: BlogListItem[] }) => {
  if (items.length === 0) {
    return <MainEmptyState className="m-auto" />
  }

  // * 虽然数据库返回的数据已经有序了，但是做个保险吧
  // * 毕竟服务端渲染好了，到时候这块是静态渲染的，性能问题也不大
  const sortedItems = items.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const groupedItems = sortedItems.reduce(
    (acc, item) => {
      const year = new Date(item.createdAt).getFullYear()
      if (acc[year] === undefined) {
        acc[year] = []
      }
      acc[year].push(item)
      return acc
    },
    {} as Record<number, BlogListItem[]>,
  )

  const sortedYears = Object.keys(groupedItems)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <>
      <ViewportRevealList>
        <div className="group/list flex flex-col gap-10">
          {sortedYears.map(year => (
            <div key={year} className="flex flex-col gap-1">
              <ViewportRevealItem
                as="h3"
                className="text-muted-foreground/30 ml-2 text-2xl font-semibold select-none"
              >
                # {year}
              </ViewportRevealItem>
              <div className="flex flex-col">
                {groupedItems[year].map(v => (
                  <ViewportRevealItem as="div" key={v.id}>
                    <motion.div
                      inherit={false}
                      className="transition-opacity group-hover/list:opacity-50! hover:opacity-100!"
                      whileHover={{
                        scale: 1.01,
                        transition: { type: 'spring', stiffness: 200, damping: 25 },
                      }}
                    >
                      <ArticleLink slug={v.slug} title={v.title} createdAt={v.createdAt} />
                    </motion.div>
                  </ViewportRevealItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ViewportRevealList>
      <MainScrollBlur />
    </>
  )
}
