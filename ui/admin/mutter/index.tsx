'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useMutterMutation, useMutterQuery } from '@/hooks/api/mutter'
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
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const { data, isPending } = useMutterQuery({ q: query })
  const { mutateAsync: createMutter, isPending: isCreating } = useMutterMutation()

  const fetchedMutters: MutterListItem[] = (data?.list ?? []).map(item => {
    return {
      id: item.id,
      content: item.content,
      createdAt: dateFormatter.format(new Date(item.createdAt)),
    }
  })

  const handleCreateMutter = async () => {
    const content = draft.trim()
    if (content.length === 0) return

    try {
      await createMutter({
        content,
      })
      setDraft('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to create mutter.')
      }
    }
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <MutterSearch setQuery={setQuery} />

      {isPending ? <Loading /> : <MutterList data={fetchedMutters} />}

      <MutterForm
        isCreating={isCreating}
        onCreate={handleCreateMutter}
        value={draft}
        onValueChange={setDraft}
      />
    </main>
  )
}
