import { useEffect, useRef, useState } from 'react'
import { useCommentDeleteMutation } from '@/hooks/api/comment/use-comment-delete-mutation'
import { useCommentMutation } from '@/hooks/api/comment/use-comment-mutation'
import { usePublicCommentQuery } from '@/hooks/api/comment/use-public-comment-query'
import { useSession } from '@/lib/core/auth/client'
import { isEmailLoggedIn, isWalletLoggedIn } from '@/lib/core/auth/utils'
import { useCommentCardActions, useCommentCardStore } from '@/store/use-comment-card-store'
import { useModalActions } from '@/store/use-modal-store'
import { maxCommentLength } from './constant'
import { buildCommentTree } from './helper'

export function useCommentCard({ articleId }: { articleId: number }) {
  const [commentContent, setCommentContent] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const previousArticleId = useRef(articleId)
  const { clearReply, setDeletingCommentId } = useCommentCardActions()
  const { setModalOpen } = useModalActions()

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isLoggedIn = isEmailLoggedIn({ data: session ?? null }) || isWalletUser
  const sessionUserId = session?.user?.id

  const {
    data,
    dataUpdatedAt: commentReferenceTime,
    isPending: isCommentPending,
  } = usePublicCommentQuery({
    targetId: articleId,
    take: 50,
  })
  const commentTree = buildCommentTree(data?.list ?? [], sortOrder)

  const { mutate: createComment, isPending: creatingComment } = useCommentMutation({
    targetId: articleId,
  })
  const { mutate: deleteComment, isPending: deletingCommentPending } = useCommentDeleteMutation({
    targetId: articleId,
  })

  const openLoginModal = () => {
    setModalOpen('loginModal')
  }

  const submitComment = ({
    content,
    parentId,
    onSuccess,
  }: {
    content: string
    parentId?: number
    onSuccess: () => void
  }) => {
    const trimmedContent = content.trim()

    if (!isLoggedIn || trimmedContent.length === 0 || trimmedContent.length > maxCommentLength) {
      return
    }

    createComment(
      {
        parentId,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          onSuccess()
        },
      },
    )
  }

  const submitRootComment = () => {
    submitComment({
      content: commentContent,
      onSuccess: () => {
        setCommentContent('')
      },
    })
  }

  const submitReply = (commentId: number) => {
    submitComment({
      content: useCommentCardStore.getState().replyContent,
      parentId: commentId,
      onSuccess: clearReply,
    })
  }

  const confirmDeleteComment = () => {
    const { deletingCommentId } = useCommentCardStore.getState()

    if (deletingCommentId == null || deletingCommentPending || !isLoggedIn) {
      return
    }

    deleteComment(
      {
        id: deletingCommentId,
      },
      {
        onSuccess: () => {
          if (useCommentCardStore.getState().activeReplyCommentId === deletingCommentId) {
            clearReply()
          }

          setDeletingCommentId(null)
        },
      },
    )
  }

  useEffect(() => {
    if (previousArticleId.current !== articleId) {
      previousArticleId.current = articleId
      setCommentContent('')
      setSortOrder('asc')
    }

    return () => {
      useCommentCardStore.getState().actions.reset()
    }
  }, [articleId])

  return {
    total: data?.total,
    commentTree,
    commentReferenceTime,
    sortOrder,
    setSortOrder,
    commentContent,
    setCommentContent,
    isLoggedIn,
    sessionUserId,
    isCommentPending,
    isCreatingComment: creatingComment,
    isDeletingComment: deletingCommentPending,
    setDeletingCommentId,
    openLoginModal,
    submitRootComment,
    submitReply,
    confirmDeleteComment,
  }
}
