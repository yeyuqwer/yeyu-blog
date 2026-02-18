'use client'

import { TagType } from '@prisma/client'
import { usePublicNoteListQuery } from '@/hooks/api/note'
import Loading from '@/ui/components/shared/loading'
import { ArticleList } from '../article-list'

export default function NoteListPage() {
  const { data, isPending } = usePublicNoteListQuery()

  if (isPending) {
    return <Loading />
  }

  return <ArticleList items={data ?? []} type={TagType.NOTE} />
}
