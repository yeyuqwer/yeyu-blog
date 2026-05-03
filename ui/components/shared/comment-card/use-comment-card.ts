import type { CommentTargetType } from '@/lib/api/comment'
import type { CommentTreeNode } from './type'
import { useMemo, useState } from 'react'
import { type Address, isAddress } from 'viem'
import {
  useCommentDeleteMutation,
  useCommentMutation,
  usePublicCommentQuery,
} from '@/hooks/api/comment'
import { isAdminLoggedIn, isEmailLoggedIn, isWalletLoggedIn, useSession } from '@/lib/core'
import { useModalStore } from '@/store/use-modal-store'
import { maxCommentLength } from './constant'
import { buildCommentTree } from './helper'

export function useCommentCard({
  articleId,
  articleType,
}: {
  articleId: number
  articleType: CommentTargetType
}) {
  const [commentContent, setCommentContent] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<number | null>(null)
  const [deletingComment, setDeletingComment] = useState<CommentTreeNode | null>(null)
  const setModalOpen = useModalStore(s => s.setModalOpen)

  const { data: session } = useSession()
  const isWalletUser = isWalletLoggedIn({ data: session ?? null })
  const isEmailUser = isEmailLoggedIn({ data: session ?? null })
  const isAdminUser = isAdminLoggedIn({ data: session ?? null })
  const isLoggedIn = isEmailUser || isWalletUser

  const { data, isPending: isCommentPending } = usePublicCommentQuery({
    targetType: articleType,
    targetId: articleId,
    take: 50,
  })
  const commentTree = useMemo(
    () => buildCommentTree(data?.list ?? [], sortOrder),
    [data?.list, sortOrder],
  )

  const { mutate: createComment, isPending: isCreatingComment } = useCommentMutation()
  const { mutate: deleteComment, isPending: isDeletingComment } = useCommentDeleteMutation()

  const sessionAddress = isAddress(session?.user?.name ?? '')
    ? (session?.user?.name as Address)
    : undefined
  const sessionAvatar = session?.user?.image?.trim() || undefined
  const sessionAvatarProps = useMemo(
    () => ({
      isAdminUser,
      isWalletUser,
      sessionAvatar,
      sessionAddress,
    }),
    [isAdminUser, isWalletUser, sessionAvatar, sessionAddress],
  )

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

    if (
      !isLoggedIn ||
      articleId <= 0 ||
      trimmedContent.length === 0 ||
      trimmedContent.length > maxCommentLength
    ) {
      return
    }

    createComment(
      {
        targetType: articleType,
        targetId: articleId,
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

  const handleReplyClick = (commentId: number) => {
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    if (activeReplyCommentId === commentId) {
      setActiveReplyCommentId(null)
      setReplyContent('')
      return
    }

    setActiveReplyCommentId(commentId)
    setReplyContent('')
  }

  const cancelReply = () => {
    setActiveReplyCommentId(null)
    setReplyContent('')
  }

  const submitReply = (commentId: number) => {
    submitComment({
      content: replyContent,
      parentId: commentId,
      onSuccess: () => {
        setReplyContent('')
        setActiveReplyCommentId(null)
      },
    })
  }

  const confirmDeleteComment = () => {
    if (deletingComment == null) {
      return
    }

    deleteComment(
      {
        id: deletingComment.id,
        targetType: deletingComment.targetType,
        targetId: deletingComment.targetId,
      },
      {
        onSuccess: () => {
          if (activeReplyCommentId === deletingComment.id) {
            setActiveReplyCommentId(null)
            setReplyContent('')
          }

          setDeletingComment(null)
        },
      },
    )
  }

  return {
    total: data?.total,
    commentTree,
    sortOrder,
    setSortOrder,
    commentContent,
    setCommentContent,
    replyContent,
    setReplyContent,
    activeReplyCommentId,
    isLoggedIn,
    isCommentPending,
    isCreatingComment,
    isDeletingComment,
    sessionUserId: session?.user?.id,
    sessionAvatarProps,
    deletingComment,
    setDeletingComment,
    openLoginModal,
    submitRootComment,
    handleReplyClick,
    cancelReply,
    submitReply,
    confirmDeleteComment,
  }
}
