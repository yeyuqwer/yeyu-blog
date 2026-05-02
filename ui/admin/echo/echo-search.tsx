'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Plus, RotateCw, Search } from 'lucide-react'
import { memo, useRef } from 'react'
import { useModalStore } from '@/store/use-modal-store'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'

function EchoSearch({ setQuery }: { setQuery: Dispatch<SetStateAction<string>> }) {
  const setModalOpen = useModalStore(s => s.setModalOpen)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="flex w-full shrink-0 gap-2">
      <Input
        placeholder="请输入引用喵~"
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

      <Button
        className="cursor-pointer"
        variant="secondary"
        onClick={() => {
          setModalOpen('createEchoModal')
        }}
      >
        <Plus />
        创建引用
      </Button>
    </section>
  )
}

export default memo(EchoSearch)
