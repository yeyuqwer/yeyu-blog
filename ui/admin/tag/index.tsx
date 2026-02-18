'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useTagsQuery } from '@/hooks/api/tag'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import TagSearch from './tag-search'
import { columns } from './tag-table-column'

export const AdminTagPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const { isPending, data } = useTagsQuery({ q: query })

  return (
    <main className="flex w-full flex-col gap-2">
      <TagSearch setQuery={setQuery} />
      {isPending ? <Loading /> : <DataTable columns={columns} data={data ?? []} />}
    </main>
  )
}
