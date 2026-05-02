'use client'

import type { ComponentProps, FC, SetStateAction } from 'react'
import { useState } from 'react'
import { useEchoQuery } from '@/hooks/api/echo'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import EchoSearch from './echo-search'
import { columns } from './echo-table-column'

export const AdminEchoPage: FC<ComponentProps<'main'>> = () => {
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
  const { isPending, data } = useEchoQuery({
    q: query,
    take: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  })
  const echoPageCount = Math.ceil((data?.total ?? 0) / pagination.pageSize)

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full flex-col gap-3 pb-4">
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <EchoSearch setQuery={updateQuery} />

        {isPending ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data?.list ?? []}
            onPaginationChange={setPagination}
            pageCount={echoPageCount}
            pagination={pagination}
          />
        )}
      </section>
    </main>
  )
}
