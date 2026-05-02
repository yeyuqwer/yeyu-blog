'use client'

import type { ComponentProps, FC } from 'react'
import type { CommentState, CommentTargetType } from '@/lib/api/comment'
import { Check, RefreshCcw, Search, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { sileo } from 'sileo'
import {
  useAdminCommentDeleteMutation,
  useAdminCommentQuery,
  useAdminCommentStateMutation,
} from '@/hooks/api/comment'
import { prettyDateTime } from '@/lib/utils/time'
import Loading from '@/ui/components/shared/loading'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>

type CommentStateFilter = 'all' | CommentState
type TargetTypeFilter = 'all' | CommentTargetType

const COMMENT_STATE_OPTIONS: Array<{
  label: string
  value: CommentStateFilter
}> = [
  { label: '全部状态', value: 'all' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
]

const COMMENT_STATE_LABEL_MAP: Record<CommentState, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

const COMMENT_STATE_BADGE_VARIANT_MAP: Record<CommentState, BadgeVariant> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
}

const TARGET_TYPE_OPTIONS: Array<{
  label: string
  value: TargetTypeFilter
}> = [
  { label: '全部类型', value: 'all' },
  { label: '博客', value: 'BLOG' },
  { label: '笔记', value: 'NOTE' },
]

const TARGET_TYPE_LABEL_MAP: Record<CommentTargetType, string> = {
  BLOG: '博客',
  NOTE: '笔记',
}

export const CommentManager: FC<ComponentProps<'main'>> = () => {
  const [draftQuery, setDraftQuery] = useState('')
  const [draftTargetId, setDraftTargetId] = useState('')
  const [draftTargetType, setDraftTargetType] = useState<TargetTypeFilter>('all')
  const [draftState, setDraftState] = useState<CommentStateFilter>('PENDING')

  const [query, setQuery] = useState('')
  const [targetIdInput, setTargetIdInput] = useState('')
  const [targetType, setTargetType] = useState<TargetTypeFilter>('all')
  const [state, setState] = useState<CommentStateFilter>('PENDING')

  const parsedTargetId = useMemo(() => {
    if (targetIdInput.trim().length === 0) {
      return undefined
    }

    const numberValue = Number.parseInt(targetIdInput, 10)
    return Number.isNaN(numberValue) || numberValue <= 0 ? undefined : numberValue
  }, [targetIdInput])

  const { data, isPending } = useAdminCommentQuery({
    q: query,
    targetType: targetType === 'all' ? undefined : targetType,
    targetId: parsedTargetId,
    state: state === 'all' ? undefined : state,
    take: 100,
    skip: 0,
  })

  const comments = data?.list ?? []

  const { mutate: updateStateById, isPending: isUpdatingState } = useAdminCommentStateMutation()
  const { mutate: deleteById, isPending: isDeletingComment } = useAdminCommentDeleteMutation()

  const applyFilters = () => {
    setQuery(draftQuery.trim())
    setTargetIdInput(draftTargetId.trim())
    setTargetType(draftTargetType)
    setState(draftState)
  }

  const handleUpdateState = (id: number, nextState: CommentState) => {
    updateStateById(
      {
        id,
        state: nextState,
      },
      {
        onSuccess: () => {
          sileo.success({ title: '评论状态已更新。' })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('确认删除这条评论吗？此操作不可撤销。')) {
      return
    }

    deleteById(
      { id },
      {
        onSuccess: () => {
          sileo.success({ title: '评论已删除。' })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <header className="flex flex-wrap items-center gap-2">
        <Input
          className="min-w-56 flex-1"
          placeholder="搜索评论内容..."
          value={draftQuery}
          onChange={event => {
            setDraftQuery(event.target.value)
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              applyFilters()
            }
          }}
        />
        <Input
          className="w-40"
          placeholder="文章 ID"
          value={draftTargetId}
          onChange={event => {
            setDraftTargetId(event.target.value)
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              applyFilters()
            }
          }}
        />
        <Select
          value={draftTargetType}
          onValueChange={value => {
            setDraftTargetType(value as TargetTypeFilter)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="内容类型" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_TYPE_OPTIONS.map(option => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={draftState}
          onValueChange={value => {
            setDraftState(value as CommentStateFilter)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="评论状态" />
          </SelectTrigger>
          <SelectContent>
            {COMMENT_STATE_OPTIONS.map(option => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" variant="secondary" className="cursor-pointer" onClick={applyFilters}>
          <Search className="size-4" />
          搜索
        </Button>
      </header>

      {isPending ? (
        <Loading />
      ) : comments.length === 0 ? (
        <div className="m-auto text-muted-foreground">虚无。</div>
      ) : (
        <main className="flex max-h-[74vh] min-h-0 flex-1 overflow-y-auto bg-card [scrollbar-color:rgba(113,113,122,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[3px]">
          <ul className="w-full space-y-2">
            {comments.map(comment => (
              <li key={comment.id} className="rounded-sm border bg-background p-3 shadow-xs">
                <section className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-sm">
                        {comment.user?.name ?? comment.authorName}
                      </h3>
                      <Badge variant="outline">#{comment.id}</Badge>
                      <Badge variant={COMMENT_STATE_BADGE_VARIANT_MAP[comment.state]}>
                        {COMMENT_STATE_LABEL_MAP[comment.state]}
                      </Badge>
                      <Badge variant="outline">
                        {`${TARGET_TYPE_LABEL_MAP[comment.targetType]} ${comment.targetId}`}
                      </Badge>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.content}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                      {comment.target != null ? (
                        <>
                          <span>关联内容：</span>
                          <Link
                            href={comment.target.path}
                            target="_blank"
                            className="line-clamp-1 text-foreground underline underline-offset-4"
                          >
                            {comment.target.title}
                          </Link>
                          <Badge variant="outline">
                            {comment.target.isPublished ? '已发布' : '未发布'}
                          </Badge>
                        </>
                      ) : (
                        <span>关联内容不存在或已被删除。</span>
                      )}
                    </div>
                    {comment.user?.email != null ? (
                      <p className="mt-1 text-muted-foreground text-xs">{comment.user.email}</p>
                    ) : null}
                    <time className="mt-1 block text-muted-foreground text-xs">
                      {prettyDateTime(new Date(comment.createdAt))}
                    </time>
                  </div>

                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isUpdatingState || comment.state === 'APPROVED'}
                      onClick={() => {
                        handleUpdateState(comment.id, 'APPROVED')
                      }}
                    >
                      <Check className="size-4" />
                      通过
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isUpdatingState || comment.state === 'PENDING'}
                      onClick={() => {
                        handleUpdateState(comment.id, 'PENDING')
                      }}
                    >
                      <RefreshCcw className="size-4" />
                      待审
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isUpdatingState || comment.state === 'REJECTED'}
                      onClick={() => {
                        handleUpdateState(comment.id, 'REJECTED')
                      }}
                    >
                      <X className="size-4" />
                      拒绝
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      disabled={isDeletingComment}
                      onClick={() => {
                        handleDelete(comment.id)
                      }}
                    >
                      <Trash2 className="size-4" />
                      删除
                    </Button>
                  </div>
                </section>
              </li>
            ))}
          </ul>
        </main>
      )}
    </main>
  )
}
