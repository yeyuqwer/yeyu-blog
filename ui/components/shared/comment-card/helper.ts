import type { PublicCommentRecord } from '@/lib/api/comment'
import type { CommentAuthorLike, CommentTreeNode } from './type'
import { type Address, isAddress } from 'viem'

export function getCommentDisplayName(comment: Pick<CommentAuthorLike, 'authorName' | 'user'>) {
  return comment.user?.name || comment.authorName
}

export function formatCommentDisplayName(displayName: string) {
  return isAddress(displayName)
    ? `${displayName.slice(0, 6)}...${displayName.slice(-6)}`
    : displayName
}

export function getCommentAvatar(comment: Pick<CommentAuthorLike, 'authorImage' | 'user'>) {
  return comment.user?.image?.trim() || comment.authorImage?.trim() || undefined
}

export function getCommentAddress(comment: Pick<CommentAuthorLike, 'user'>) {
  return isAddress(comment.user?.name ?? '') ? (comment.user?.name as Address) : undefined
}

export function getCommentLoginProvider(comment: Pick<CommentAuthorLike, 'user'>) {
  if (comment.user?.accounts?.some(account => account.providerId === 'github')) {
    return 'github'
  }

  if (comment.user?.accounts?.some(account => account.providerId === 'google')) {
    return 'google'
  }

  return undefined
}

export function getCommentGithubAccountId(comment: Pick<CommentAuthorLike, 'user'>) {
  const githubAccount = comment.user?.accounts?.find(account => account.providerId === 'github')

  return githubAccount?.accountId
}

export function buildCommentTree(
  comments: PublicCommentRecord[],
  sortOrder: 'asc' | 'desc' = 'asc',
) {
  const nodeMap = new Map<number, CommentTreeNode>()
  const roots: CommentTreeNode[] = []

  for (const comment of comments) {
    nodeMap.set(comment.id, {
      ...comment,
      children: [],
    })
  }

  for (const comment of comments) {
    const node = nodeMap.get(comment.id)

    if (node == null) {
      continue
    }

    if (comment.parentId != null) {
      const parentNode = nodeMap.get(comment.parentId)

      if (parentNode != null) {
        parentNode.children.push(node)
        continue
      }
    }

    roots.push(node)
  }

  sortCommentTree(roots, sortOrder)

  return roots
}

function sortCommentTree(comments: CommentTreeNode[], sortOrder: 'asc' | 'desc') {
  comments.sort((previousComment, nextComment) => {
    const previousTime = new Date(previousComment.createdAt).getTime()
    const nextTime = new Date(nextComment.createdAt).getTime()

    return sortOrder === 'asc' ? previousTime - nextTime : nextTime - previousTime
  })

  for (const comment of comments) {
    sortCommentTree(comment.children, sortOrder)
  }
}
