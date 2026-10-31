import type { PublicCommentRecord } from '@/lib/api/comment/get-public-comments'
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

export function getCommentAuthor(comment: CommentAuthorLike) {
  const githubAccount = comment.user?.accounts?.find(account => account.providerId === 'github')
  const googleAccount = comment.user?.accounts?.find(account => account.providerId === 'google')
  const provider: 'github' | 'google' | undefined =
    githubAccount != null ? 'github' : googleAccount != null ? 'google' : undefined

  return {
    displayName: getCommentDisplayName(comment),
    avatar: comment.user?.image?.trim() || comment.authorImage?.trim() || undefined,
    address: isAddress(comment.user?.name ?? '') ? (comment.user?.name as Address) : undefined,
    provider,
    githubAccountId: githubAccount?.accountId,
  }
}

export function buildCommentTree(comments: PublicCommentRecord[], sortOrder: 'asc' | 'desc') {
  const nodeMap = new Map<number, CommentTreeNode>()
  const roots: CommentTreeNode[] = []

  for (const comment of comments) {
    nodeMap.set(comment.id, {
      ...comment,
      children: [],
    })
  }

  for (const node of nodeMap.values()) {
    if (node.parentId == null) {
      roots.push(node)
      continue
    }

    const parentNode = nodeMap.get(node.parentId)

    if (parentNode == null) {
      roots.push(node)
      continue
    }

    parentNode.children.push(node)
  }

  for (const root of roots) {
    const replies = [...root.children]

    // Keep the reply target intact while displaying every reply at the second level.
    for (let index = 0; index < replies.length; index++) {
      const reply = replies[index]
      replies.push(...reply.children)
      reply.children = []
    }

    root.children = replies
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
