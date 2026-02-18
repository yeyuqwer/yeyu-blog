import { TagType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/core/auth/guard'
import { prisma } from '@/prisma/instance'
import { AdminArticleEditPage } from '@/ui/admin/components/admin-article-edit-page'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect(`/admin/blog`)
  }

  const slug = (await params).slug?.[0] ?? null
  const article =
    slug != null
      ? await prisma.blog.findUnique({
          where: {
            slug,
          },
          include: {
            tags: true,
          },
        })
      : null

  const relatedBlogTagNames = article != null ? article.tags.map(v => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedBlogTagNames}
      type={TagType.BLOG}
    />
  )
}
