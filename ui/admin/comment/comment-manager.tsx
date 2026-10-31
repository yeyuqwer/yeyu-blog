'use client'

import type { ComponentProps, FC } from 'react'
import type { AdminCommentRecord } from '@/lib/api/comment/get-admin-comments'
import type { CommentState } from '@/lib/api/comment/type'
import type { CommentStateFilter, CommentTargetTypeFilter } from './comment-manager/types'
import { useReducer } from 'react'
import { sileo } from 'sileo'
import { useAdminCommentDeleteMutation } from '@/hooks/api/comment/use-admin-comment-delete-mutation'
import { useAdminCommentQuery } from '@/hooks/api/comment/use-admin-comment-query'
import { useAdminCommentRestoreMutation } from '@/hooks/api/comment/use-admin-comment-restore-mutation'
import { useAdminCommentStateMutation } from '@/hooks/api/comment/use-admin-comment-state-mutation'
import { ConfirmDialog } from '@/ui/components/modal/base/confirm-dialog'
import Loading from '@/ui/components/shared/loading'
import { CommentManagerFilters } from './comment-manager/comment-manager-filters'
import { CommentManagerListItem } from './comment-manager/comment-manager-list-item'

type CommentFilterState = {
  deletingComment: AdminCommentRecord | null
  draftQuery: string
  draftState: CommentStateFilter
  draftTargetId: string
  draftTargetType: CommentTargetTypeFilter
  query: string
  state: CommentStateFilter
  targetIdInput: string
  targetType: CommentTargetTypeFilter
}

const initialCommentFilterState: CommentFilterState = {
  deletingComment: null,
  draftQuery: '',
  draftState: 'PENDING',
  draftTargetId: '',
  draftTargetType: 'all',
  query: '',
  state: 'PENDING',
  targetIdInput: '',
  targetType: 'all',
}

type CommentFilterAction =
  | { type: 'applyFilters' }
  | { type: 'setDeletingComment'; deletingComment: AdminCommentRecord | null }
  | { type: 'setDraftQuery'; draftQuery: string }
  | { type: 'setDraftState'; draftState: CommentStateFilter }
  | { type: 'setDraftTargetId'; draftTargetId: string }
  | { type: 'setDraftTargetType'; draftTargetType: CommentTargetTypeFilter }

function commentFilterReducer(
  state: CommentFilterState,
  action: CommentFilterAction,
): CommentFilterState {
  switch (action.type) {
    case 'applyFilters':
      return {
        ...state,
        query: state.draftQuery.trim(),
        targetIdInput: state.draftTargetId.trim(),
        targetType: state.draftTargetType,
        state: state.draftState,
      }
    case 'setDeletingComment':
      return {
        ...state,
        deletingComment: action.deletingComment,
      }
    case 'setDraftQuery':
      return {
        ...state,
        draftQuery: action.draftQuery,
      }
    case 'setDraftState': {
      const query = state.draftQuery.trim()
      const targetIdInput = state.draftTargetId.trim()

      return {
        ...state,
        draftState: action.draftState,
        query,
        targetIdInput,
        targetType: state.draftTargetType,
        state: action.draftState,
      }
    }
    case 'setDraftTargetId':
      return {
        ...state,
        draftTargetId: action.draftTargetId,
      }
    case 'setDraftTargetType': {
      const query = state.draftQuery.trim()
      const targetIdInput = state.draftTargetId.trim()

      return {
        ...state,
        draftTargetType: action.draftTargetType,
        query,
        targetIdInput,
        targetType: action.draftTargetType,
        state: state.draftState,
      }
    }
  }
}

export const CommentManager: FC<ComponentProps<'main'>> = () => {
  const [filterState, dispatch] = useReducer(commentFilterReducer, initialCommentFilterState)
  const {
    deletingComment,
    draftQuery,
    draftState,
    draftTargetId,
    draftTargetType,
    query,
    state,
    targetIdInput,
    targetType,
  } = filterState

  const parsedTargetId = (() => {
    if (targetIdInput.trim().length === 0) {
      return undefined
    }

    const numberValue = Number.parseInt(targetIdInput, 10)
    return Number.isNaN(numberValue) || numberValue <= 0 ? undefined : numberValue
  })()

  const { data, isPending } = useAdminCommentQuery({
    q: query,
    targetType: targetType === 'all' ? undefined : targetType,
    targetId: parsedTargetId,
    state: state === 'all' || state === 'deleted' ? undefined : state,
    isDeleted: state === 'deleted',
    take: 100,
    skip: 0,
  })

  const comments = data?.list ?? []

  const { mutate: updateStateById, isPending: isUpdatingState } = useAdminCommentStateMutation()
  const { mutate: deleteById, isPending: isDeletingComment } = useAdminCommentDeleteMutation()
  const { mutate: restoreById, isPending: isRestoringComment } = useAdminCommentRestoreMutation()

  const applyFilters = () => {
    dispatch({ type: 'applyFilters' })
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

  const handleDelete = () => {
    if (deletingComment == null) {
      sileo.error({ title: '评论信息不存在，删除失败。' })
      return
    }

    deleteById(
      { id: deletingComment.id },
      {
        onSuccess: () => {
          dispatch({ type: 'setDeletingComment', deletingComment: null })
          sileo.success({ title: '评论已删除。' })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  const handleRestore = (id: number) => {
    restoreById(
      { id },
      {
        onSuccess: () => {
          sileo.success({ title: '评论已恢复。' })
        },
        onError: error => {
          sileo.error({ title: error.message })
        },
      },
    )
  }

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col gap-2">
      <CommentManagerFilters
        draftQuery={draftQuery}
        draftState={draftState}
        draftTargetId={draftTargetId}
        draftTargetType={draftTargetType}
        onApplyFilters={applyFilters}
        onDraftQueryChange={value => {
          dispatch({ type: 'setDraftQuery', draftQuery: value })
        }}
        onDraftStateChange={value => {
          dispatch({ type: 'setDraftState', draftState: value })
        }}
        onDraftTargetIdChange={value => {
          dispatch({ type: 'setDraftTargetId', draftTargetId: value })
        }}
        onDraftTargetTypeChange={value => {
          dispatch({ type: 'setDraftTargetType', draftTargetType: value })
        }}
      />

      {isPending ? (
        <Loading />
      ) : comments.length === 0 ? (
        <div className="text-muted-foreground m-auto">虚无。</div>
      ) : (
        <main className="bg-card flex min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.45)_transparent] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-500/45 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-400/35 [&::-webkit-scrollbar-track]:bg-transparent">
          <ul className="w-full space-y-2">
            {comments.map(comment => (
              <CommentManagerListItem
                key={comment.id}
                comment={comment}
                isDeletingComment={isDeletingComment}
                isRestoringComment={isRestoringComment}
                isUpdatingState={isUpdatingState}
                onDeleteClick={comment => {
                  dispatch({ type: 'setDeletingComment', deletingComment: comment })
                }}
                onRestore={handleRestore}
                onUpdateState={handleUpdateState}
              />
            ))}
          </ul>
        </main>
      )}

      <ConfirmDialog
        open={deletingComment != null}
        onClose={() => {
          dispatch({ type: 'setDeletingComment', deletingComment: null })
        }}
        onConfirm={handleDelete}
        title="确定要删除这条评论吗？"
        description="该操作不可撤销。"
        isPending={isDeletingComment}
      >
        {deletingComment != null ? (
          <div className="bg-muted/30 rounded-md border p-3 text-sm">
            <p className="font-medium">
              {deletingComment.user?.name ?? deletingComment.authorName}
            </p>
            <p className="text-muted-foreground mt-2 line-clamp-3 text-xs whitespace-pre-wrap">
              {deletingComment.content}
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </main>
  )
}
