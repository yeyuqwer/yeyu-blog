import { TagType } from '@prisma/client'
import { prisma } from '@/prisma/instance'
import { ArticleList } from '../article-list'

export default async function NoteListPage() {
  const noteList = await prisma.note.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      tags: true,
    },
  })

  return <ArticleList items={noteList} type={TagType.NOTE} />
}
