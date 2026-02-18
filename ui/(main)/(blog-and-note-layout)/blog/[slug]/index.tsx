import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { processor } from '@/lib/core/markdown'
import { prisma } from '@/prisma/instance'
import ArticleDisplayPage from '@/ui/components/shared/article-display-page'
import CommentCard from '@/ui/components/shared/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'

export const BlogDetail: FC<
  ComponentProps<'div'> & {
    slug: string
  }
> = async ({ slug }) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })

  if (blog == null || blog.content.length === 0) notFound()

  const blogHTML = await processor.process(blog.content)
  const article = {
    ...blog,
    content: blogHTML.toString(),
  }

  const { content, title, createdAt, tags, id } = article

  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage title={title} createdAt={createdAt} content={content} tags={tagNames} />
      <HorizontalDividingLine />
      <CommentCard term={`${title}-blog-${id}`} />
    </div>
  )
}
