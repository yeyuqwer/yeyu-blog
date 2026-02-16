'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { MutterForm } from './mutter-form'
import { MutterList, type MutterListItem } from './mutter-list'
import { MutterSearch } from './mutter-search'

const mockMutters: MutterListItem[] = [
  {
    id: 1,
    content: 'qqqqqqqqqqqqqqqq',
    createdAt: '2026-02-16 09:18',
  },
  {
    id: 2,
    content: 'qwerqeeeeeeeeeee',
    createdAt: '2026-02-16 10:05',
  },
  {
    id: 3,
    content: 'errqwerqwer',
    createdAt: '2026-02-16 10:47',
  },
]

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [mutters, setMutters] = useState<MutterListItem[]>(mockMutters)
  const [draft, setDraft] = useState('')

  const handleCreateMutter = () => {
    const content = draft.trim()
    if (content.length === 0) return

    const nextMutter: MutterListItem = {
      id: Date.now(),
      content,
      createdAt: new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()),
    }

    setMutters(prev => [nextMutter, ...prev])
    setDraft('')
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <MutterSearch />

      <MutterList data={mutters} />

      <MutterForm onCreate={handleCreateMutter} value={draft} onValueChange={setDraft} />
    </main>
  )
}
