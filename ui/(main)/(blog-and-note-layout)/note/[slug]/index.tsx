import type { ComponentProps, FC } from 'react'
import { notFound } from 'next/navigation'
import { processor } from '@/lib/core/markdown'
import { prisma } from '@/prisma/instance'
import ArticleDisplayPage from '@/ui/components/shared/article-display-page'
import CommentCard from '@/ui/components/shared/comment-card'
import HorizontalDividingLine from '@/ui/components/shared/horizontal-dividing-line'

export const NoteDetail: FC<ComponentProps<'div'> & { slug: string }> = async ({ slug }) => {
  const note = await prisma.note.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })

  if (note == null || note.content.length === 0) notFound()

  const noteHTML = await processor.process(note.content)
  const article = {
    ...note,
    content: noteHTML.toString(),
  }

  const { content, createdAt, tags, id } = article
  const tagNames = tags.map(v => v.tagName)

  return (
    <div className="flex flex-col gap-4">
      <ArticleDisplayPage createdAt={createdAt} content={content} tags={tagNames} />
      <HorizontalDividingLine />
      <CommentCard articleType="NOTE" articleId={id} />
    </div>
  )
}
