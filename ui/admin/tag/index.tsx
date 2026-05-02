'use client'

import type { ComponentProps, FC, SetStateAction } from 'react'
import { useState } from 'react'
import { useTagsQuery } from '@/hooks/api/tag'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import TagSearch from './tag-search'
import { columns } from './tag-table-column'

export const AdminTagPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const updateQuery = (value: SetStateAction<string>) => {
    setPagination(previousPagination => ({
      ...previousPagination,
      pageIndex: 0,
    }))
    setQuery(value)
  }
  const { isPending, data } = useTagsQuery({
    q: query,
    take: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  })
  const tagPageCount = Math.ceil((data?.total ?? 0) / pagination.pageSize)

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full flex-col gap-3 pb-4">
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <TagSearch setQuery={updateQuery} />

        {isPending ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data?.list ?? []}
            onPaginationChange={setPagination}
            pageCount={tagPageCount}
            pagination={pagination}
          />
        )}
      </section>
    </main>
  )
}
