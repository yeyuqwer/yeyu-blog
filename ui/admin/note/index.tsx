'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useNoteQuery } from '@/hooks/api/note'
import { useNoteTagsQuery } from '@/hooks/api/tag'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import NoteSearch from './note-search'
import { columns } from './note-table-column'
import { NoteTagsContainer } from './note-tags-container'

export const AdminNotePage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { data: noteList, isPending: noteListPending } = useNoteQuery({
    q: query,
    tagNames: selectedTags,
  })

  const { data: noteTags, isPending: noteTagsPending } = useNoteTagsQuery()

  return (
    <main className="flex w-full flex-col gap-2">
      <NoteSearch setQuery={setQuery} />

      {!noteTagsPending && (
        <NoteTagsContainer noteTagList={noteTags ?? []} setSelectedTags={setSelectedTags} />
      )}

      {noteListPending || noteTagsPending ? (
        <Loading />
      ) : (
        <DataTable columns={columns} data={noteList ?? []} />
      )}
    </main>
  )
}
