'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Plus, RotateCw, Search } from 'lucide-react'
import Link from 'next/link'
import { memo, useRef } from 'react'
import { cn } from '@/lib/utils/common/shadcn'
import { Button, buttonVariants } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'

function NoteSearch({ setQuery }: { setQuery: Dispatch<SetStateAction<string>> }) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="flex w-full shrink-0 gap-2">
      <Input
        placeholder="请输入标题喵~"
        className="min-w-0 flex-1"
        ref={inputRef}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const query = inputRef.current?.value
            if (query?.trim() != null) {
              setQuery(query)
            } else {
              setQuery('')
            }
          }
        }}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const query = inputRef.current?.value
          if (query?.trim() != null) {
            setQuery(query)
          }
        }}
        className="cursor-pointer"
      >
        <Search />
        搜索
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          if (inputRef.current != null) {
            inputRef.current.value = ''
          }

          setQuery('')
        }}
        className="cursor-pointer"
      >
        <RotateCw />
        重置
      </Button>

      <Link
        className={cn(buttonVariants({ variant: 'secondary' }), 'cursor-pointer')}
        href="note/edit"
      >
        <Plus />
        创建笔记
      </Link>
    </section>
  )
}

export default memo(NoteSearch)
