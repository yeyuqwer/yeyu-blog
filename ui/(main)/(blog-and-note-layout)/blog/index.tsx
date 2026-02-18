'use client'

import { TagType } from '@prisma/client'
import { usePublicBlogListQuery } from '@/hooks/api/blog'
import Loading from '@/ui/components/shared/loading'
import { ArticleList } from '../article-list'

export default function BlogListPage() {
  const { data, isPending } = usePublicBlogListQuery()

  if (isPending) {
    return <Loading />
  }

  return <ArticleList items={data ?? []} type={TagType.BLOG} />
}
