'use client'

import type { ComponentProps, FC } from 'react'
import type { AdminMutterCommentRecord, MutterCommentState } from '@/lib/api/mutter-comment'
import { Check, RefreshCcw, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sileo } from 'sileo'
import {
  useAdminMutterCommentDeleteMutation,
  useAdminMutterCommentQuery,
  useAdminMutterCommentStateMutation,
} from '@/hooks/api/mutter-comment'
import { prettyDateTime } from '@/lib/utils/time'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'
import Loading from '@/ui/components/shared/loading'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/shadcn/select'

const commentStateOptions: Array<{
  label: string
  value: 'all' | MutterCommentState
}> = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'PENDING' },
  { label: '已通过', value: 'APPROVED' },
  { label: '已拒绝', value: 'REJECTED' },
]

const commentStateLabelMap: Record<MutterCommentState, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
}

const commentStateBadgeVariantMap: Record<
  MutterCommentState,
  NonNullable<ComponentProps<typeof Badge>['variant']>
> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
}

export const MutterCommentManager: FC<ComponentProps<'main'>> = () => {
  const [draftQuery, setDraftQuery] = useState('')
  const [draftMutterId, setDraftMutterId] = useState('')
  const [draftState, setDraftState] = useState<'all' | MutterCommentState>('PENDING')

  const [query, setQuery] = useState('')
  const [mutterIdInput, setMutterIdInput] = useState('')
  const [state, setState] = useState<'all' | MutterCommentState>('PENDING')
  const [deletingComment, setDeletingComment] = useState<AdminMutterCommentRecord | null>(null)

  const parsedMutterId = useMemo(() => {
    if (mutterIdInput.trim().length === 0) {
      return undefined
    }

    const numberValue = Number.parseInt(mutterIdInput, 10)
    return Number.isNaN(numberValue) || numberValue <= 0 ? undefined : numberValue
  }, [mutterIdInput])

  const { data, isPending } = useAdminMutterCommentQuery({
    q: query,
    mutterId: parsedMutterId,
    state: state === 'all' ? undefined : state,
    take: 100,
    skip: 0,
  })

  const comments = data?.list ?? []

  const { mutate: updateStateById, isPending: isUpdatingState } =
    useAdminMutterCommentStateMutation()
  const { mutate: deleteById, isPending: isDeletingComment } = useAdminMutterCommentDeleteMutation()

  const applyFilters = () => {
    setQuery(draftQuery.trim())
    setMutterIdInput(draftMutterId.trim())
    setState(draftState)
  }

  const handleUpdateState = (id: number, nextState: MutterCommentState) => {
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

  const handleDelete = () => {
    if (deletingComment == null) {
      sileo.error({ title: '评论信息不存在，删除失败。' })
      return
    }

    deleteById(
      { id: deletingComment.id },
      {
        onSuccess: () => {
          setDeletingComment(null)
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
          placeholder="Mutter ID"
          value={draftMutterId}
          onChange={event => {
            setDraftMutterId(event.target.value)
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              applyFilters()
            }
          }}
        />
        <Select
          value={draftState}
          onValueChange={value => {
            setDraftState(value as 'all' | MutterCommentState)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="评论状态" />
          </SelectTrigger>
          <SelectContent>
            {commentStateOptions.map(option => (
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
                      <Badge variant={commentStateBadgeVariantMap[comment.state]}>
                        {commentStateLabelMap[comment.state]}
                      </Badge>
                      <Badge variant="outline">{`Mutter ${comment.mutterId}`}</Badge>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.content}</p>
                    <p className="mt-2 line-clamp-1 text-muted-foreground text-xs">
                      <span className="mr-1">关联低语：</span>
                      {comment.mutter.content}
                    </p>
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
                        setDeletingComment(comment)
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

      <ConfirmDialog
        open={deletingComment != null}
        onClose={() => {
          setDeletingComment(null)
        }}
        onConfirm={handleDelete}
        title="确定要删除这条评论吗？"
        description="该操作不可撤销。"
        isPending={isDeletingComment}
      >
        {deletingComment != null ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-muted-foreground text-xs">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </main>
  )
}
