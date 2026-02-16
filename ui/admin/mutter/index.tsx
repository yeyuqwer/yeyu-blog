'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { MutterForm } from './mutter-form'
import { MutterList } from './mutter-list'
import { MutterSearch } from './mutter-search'

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [query, setQuery] = useState('')

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <MutterSearch setQuery={setQuery} />

      <MutterList query={query} />

      <MutterForm />
    </main>
  )
}
