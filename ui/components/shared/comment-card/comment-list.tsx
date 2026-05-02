import type { CommentTreeNode, SessionAvatarProps } from './type'
import Loading from '../loading'
import { CommentThreadItem } from './comment-thread-item'

export function CommentList({
  isPending,
  commentTree,
  sessionUserId,
  isLoggedIn,
  activeReplyCommentId,
  replyContent,
  isCreatingComment,
  sessionAvatarProps,
  onReplyClick,
  onReplyCancel,
  onReplyContentChange,
  onReplySubmit,
}: {
  isPending: boolean
  commentTree: CommentTreeNode[]
  sessionUserId?: string
  isLoggedIn: boolean
  activeReplyCommentId: number | null
  replyContent: string
  isCreatingComment: boolean
  sessionAvatarProps: SessionAvatarProps
  onReplyClick: (commentId: number) => void
  onReplyCancel: () => void
  onReplyContentChange: (value: string) => void
  onReplySubmit: (commentId: number) => void
}) {
  if (isPending) {
    return (
      <div className="flex min-h-24 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (commentTree.length === 0) {
    return (
      <div className="px-1 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        评论会在这里按时间倒序展开，回复会以缩进形式挂在对应楼层下面。
      </div>
    )
  }

  return (
    <ul className="space-y-5">
      {commentTree.map(comment => (
        <CommentThreadItem
          key={comment.id}
          comment={comment}
          depth={0}
          sessionUserId={sessionUserId}
          isLoggedIn={isLoggedIn}
          activeReplyCommentId={activeReplyCommentId}
          replyContent={replyContent}
          isCreatingComment={isCreatingComment}
          sessionAvatarProps={sessionAvatarProps}
          onReplyClick={onReplyClick}
          onReplyCancel={onReplyCancel}
          onReplyContentChange={onReplyContentChange}
          onReplySubmit={onReplySubmit}
        />
      ))}
    </ul>
  )
}
