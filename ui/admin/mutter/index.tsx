'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { useMutterQuery } from '@/hooks/api/mutter'
import Loading from '@/ui/components/shared/loading'
import { MutterForm } from './mutter-form'
import { MutterList, type MutterListItem } from './mutter-list'
import { MutterSearch } from './mutter-search'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [optimisticMutters, setOptimisticMutters] = useState<MutterListItem[]>([])
  const [draft, setDraft] = useState('')
  const { data, isPending } = useMutterQuery()

  const fetchedMutters: MutterListItem[] = (data?.list ?? []).map(item => {
    return {
      id: item.id,
      content: item.content,
      createdAt: dateFormatter.format(new Date(item.createdAt)),
    }
  })

  const handleCreateMutter = () => {
    const content = draft.trim()
    if (content.length === 0) return

    const nextMutter: MutterListItem = {
      id: Date.now(),
      content,
      createdAt: dateFormatter.format(new Date()),
    }

    setOptimisticMutters(prev => [nextMutter, ...prev])
    setDraft('')
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <MutterSearch />

      {isPending ? <Loading /> : <MutterList data={[...optimisticMutters, ...fetchedMutters]} />}

      <MutterForm onCreate={handleCreateMutter} value={draft} onValueChange={setDraft} />
    </main>
  )
}
