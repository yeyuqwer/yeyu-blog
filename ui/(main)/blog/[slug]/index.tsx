import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { db } from '@/db/instance'
import { blogs } from '@/db/schema'
import { processor } from '@/lib/core/markdown/processor'
import ArticleDisplayPage from '@/ui/(main)/blog/article-display-page'
import DeferredCommentCard from '@/ui/(main)/blog/comment-card/deferred-comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'
import { MainScrollBlur } from '@/ui/components/shared/main-scroll-blur'

export async function BlogDetail({ slug }: { slug: string }) {
  const record = await db.query.blogs.findFirst({
    where: and(eq(blogs.slug, slug), eq(blogs.isPublished, true)),
    with: {
      tagLinks: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  })

  if (record == null) notFound()

  const { tagLinks, ...blog } = record
  const sanitizedBlogHtml = await processor.process(blog.content)
  const article = {
    ...blog,
    content: sanitizedBlogHtml.toString(),
    tags: tagLinks.map(link => link.tag),
  }

  const { content, createdAt, tags, id } = article

  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage createdAt={createdAt} sanitizedContent={content} tags={tagNames} />
      <HorizontalDividingLine />
      <DeferredCommentCard articleId={id} />
      <MainScrollBlur />
    </div>
  )
}
