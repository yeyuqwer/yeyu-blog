'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useEchoQuery } from '@/hooks/api/echo'
import Loading from '@/ui/components/shared/loading'
import { DataTable } from '../components/table/data-table'
import EchoSearch from './echo-search'
import { columns } from './echo-table-column'

export const AdminEchoPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')
  const { isPending, data } = useEchoQuery({
    q: query,
  })

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full flex-col gap-3 pb-4">
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <EchoSearch setQuery={setQuery} />

        {isPending ? <Loading /> : <DataTable columns={columns} data={data ?? []} />}
      </section>
    </main>
  )
}
