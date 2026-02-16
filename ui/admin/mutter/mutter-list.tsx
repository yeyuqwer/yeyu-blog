'use client'

import type { ComponentProps, FC } from 'react'
import { useMutterQuery } from '@/hooks/api/mutter'
import { prettyDateTime } from '@/lib/utils/time'
import Loading from '@/ui/components/shared/loading'

export const MutterList: FC<
  ComponentProps<'main'> & {
    query: string
  }
> = ({ query }) => {
  const { data, isPending } = useMutterQuery({ q: query })
  const mutters = data?.list ?? []

  if (isPending) {
    return <Loading />
  }

  return (
    <main className="max-h-[69vh] min-h-0 flex-1 overflow-y-auto rounded-md border bg-card p-3">
      {mutters.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
          暂无 mutter 数据
        </div>
      ) : (
        <ul className="space-y-2">
          {mutters.map(item => {
            return (
              <li key={item.id} className="rounded-md border bg-background p-3 shadow-xs">
                <p className="whitespace-pre-wrap text-sm leading-6">{item.content}</p>
                <time className="mt-2 block text-muted-foreground text-xs">
                  {prettyDateTime(new Date(item.createdAt))}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
