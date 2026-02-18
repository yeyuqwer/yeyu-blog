import { TagType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { getRawNoteBySlug } from '@/actions/notes'
import { requireAdmin } from '@/lib/core/auth/guard'
import { AdminArticleEditPage } from '@/ui/admin/components/admin-article-edit-page'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect(`/admin/note`)
  }

  const slug = (await params).slug?.[0] ?? null
  const article = slug != null ? await getRawNoteBySlug(slug) : null

  const relatedArticleTagNames = article != null ? article.tags.map(v => v.tagName) : []

  return (
    <AdminArticleEditPage
      article={article}
      relatedArticleTagNames={relatedArticleTagNames}
      type={TagType.NOTE}
    />
  )
}
