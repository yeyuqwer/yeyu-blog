'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { MutterForm } from './mutter-form'
import { MutterList } from './mutter-list'
import { MutterSearch } from './mutter-search'

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [editingMutter, setEditingMutter] = useState<{
    id: number
    content: string
  } | null>(null)
  const [query, setQuery] = useState('')

  return (
    <main className="flex h-[calc(100dvh-5rem)] min-h-0 w-full flex-col gap-3 pb-4">
      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <MutterSearch setQuery={setQuery} />

        <MutterList query={query} onEditMutter={setEditingMutter} />

        <MutterForm
          editingMutter={editingMutter}
          clearEditingMutter={() => setEditingMutter(null)}
        />
      </section>
    </main>
  )
}
