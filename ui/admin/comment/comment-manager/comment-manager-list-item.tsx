import type { AdminCommentRecord } from '@/lib/api/comment/get-admin-comments'
import type { CommentState } from '@/lib/api/comment/type'
import { Check, RefreshCcw, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { prettyDateTime } from '@/lib/utils/common/time'
import { Badge } from '@/ui/shadcn/badge'
import { Button } from '@/ui/shadcn/button'
import { CommentContent } from '../comment-content'
import { commentStateBadgeVariantMap, commentStateLabelMap, targetTypeLabelMap } from './constants'

function CommentManagerListItemActions({
  comment,
  isDeletingComment,
  isRestoringComment,
  isUpdatingState,
  onDeleteClick,
  onRestore,
  onUpdateState,
}: {
  comment: AdminCommentRecord
  isDeletingComment: boolean
  isRestoringComment: boolean
  isUpdatingState: boolean
  onDeleteClick: (comment: AdminCommentRecord) => void
  onRestore: (id: number) => void
  onUpdateState: (id: number, nextState: CommentState) => void
}) {
  if (comment.isDeleted) {
    return (
      <div className="flex shrink-0 flex-col gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="cursor-pointer"
          disabled={isRestoringComment}
          onClick={() => {
            onRestore(comment.id)
          }}
        >
          <RefreshCcw className="size-4" />
          恢复
        </Button>
      </div>
    )
  }

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="cursor-pointer"
        disabled={isUpdatingState || comment.state === 'APPROVED'}
        onClick={() => {
          onUpdateState(comment.id, 'APPROVED')
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
          onUpdateState(comment.id, 'PENDING')
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
          onUpdateState(comment.id, 'REJECTED')
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
          onDeleteClick(comment)
        }}
      >
        <Trash2 className="size-4" />
        删除
      </Button>
    </div>
  )
}

export function CommentManagerListItem({
  comment,
  isDeletingComment,
  isRestoringComment,
  isUpdatingState,
  onDeleteClick,
  onRestore,
  onUpdateState,
}: {
  comment: AdminCommentRecord
  isDeletingComment: boolean
  isRestoringComment: boolean
  isUpdatingState: boolean
  onDeleteClick: (comment: AdminCommentRecord) => void
  onRestore: (id: number) => void
  onUpdateState: (id: number, nextState: CommentState) => void
}) {
  return (
    <li className="bg-background rounded-sm border p-3 shadow-xs">
      <section className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium">{comment.user?.name ?? comment.authorName}</h3>
            <Badge variant="outline">#{comment.id}</Badge>
            <Badge variant={commentStateBadgeVariantMap[comment.state]}>
              {commentStateLabelMap[comment.state]}
            </Badge>
            {comment.isDeleted ? <Badge variant="destructive">已删除</Badge> : null}
            <Badge variant="outline">
              {`${targetTypeLabelMap[comment.targetType]} ${comment.targetId}`}
            </Badge>
          </div>
          <CommentContent content={comment.content} />
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
            {comment.target != null ? (
              <>
                <span>关联内容：</span>
                <Link
                  href={comment.target.path}
                  target="_blank"
                  className="text-foreground line-clamp-1 underline underline-offset-4"
                >
                  {comment.target.title}
                </Link>
                <Badge variant="outline">{comment.target.isPublished ? '已发布' : '未发布'}</Badge>
              </>
            ) : (
              <span>关联内容不存在或已被删除。</span>
            )}
          </div>
          {comment.user?.email != null ? (
            <p className="text-muted-foreground mt-1 text-xs">{comment.user.email}</p>
          ) : null}
          <time className="text-muted-foreground mt-1 block text-xs">
            {prettyDateTime(Date.parse(comment.createdAt))}
          </time>
        </div>

        <CommentManagerListItemActions
          comment={comment}
          isDeletingComment={isDeletingComment}
          isRestoringComment={isRestoringComment}
          isUpdatingState={isUpdatingState}
          onDeleteClick={onDeleteClick}
          onRestore={onRestore}
          onUpdateState={onUpdateState}
        />
      </section>
    </li>
  )
}
