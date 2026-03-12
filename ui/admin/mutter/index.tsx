'use client'

import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { Button } from '@/ui/shadcn/button'
import { MutterCommentConfigManager } from './mutter-comment-config-manager'
import { MutterCommentManager } from './mutter-comment-manager'
import { MutterForm } from './mutter-form'
import { MutterList } from './mutter-list'
import { MutterSearch } from './mutter-search'

export const MutterPage: FC<ComponentProps<'main'>> = () => {
  const [mode, setMode] = useState<'mutter' | 'comment' | 'commentConfig'>('mutter')
  const [editingMutter, setEditingMutter] = useState<{
    id: number
    content: string
  } | null>(null)
  const [query, setQuery] = useState('')

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <header className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'mutter' ? 'default' : 'outline'}
          onClick={() => {
            setMode('mutter')
          }}
        >
          低语管理
        </Button>
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'comment' ? 'default' : 'outline'}
          onClick={() => {
            setMode('comment')
          }}
        >
          评论管理
        </Button>
        <Button
          type="button"
          size="sm"
          className="cursor-pointer"
          variant={mode === 'commentConfig' ? 'default' : 'outline'}
          onClick={() => {
            setMode('commentConfig')
          }}
        >
          评论配置
        </Button>
      </header>

      {mode === 'mutter' ? (
        <>
          <MutterSearch setQuery={setQuery} />

          <MutterList query={query} onEditMutter={setEditingMutter} />

          <MutterForm
            editingMutter={editingMutter}
            clearEditingMutter={() => setEditingMutter(null)}
          />
        </>
      ) : mode === 'comment' ? (
        <MutterCommentManager />
      ) : (
        <MutterCommentConfigManager />
      )}
    </main>
  )
}
