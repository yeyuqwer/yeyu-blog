import 'server-only'

import { prisma } from '@/prisma/instance'

export type AdminOverviewStats = {
  blogCount: number
  noteCount: number
  blogDraftCount: number
  noteDraftCount: number
  draftCount: number
  commentPendingCount: number
  friendLinkPendingCount: number
  pendingCount: number
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const blogGroups = await prisma.blog.groupBy({
    by: ['isPublished'],
    _count: { _all: true },
  })
  const noteGroups = await prisma.note.groupBy({
    by: ['isPublished'],
    _count: { _all: true },
  })
  const siteCommentPendingCount = await prisma.siteComment.count({ where: { state: 'PENDING' } })
  const mutterCommentPendingCount = await prisma.mutterComment.count({
    where: { state: 'PENDING' },
  })
  const friendLinkPendingCount = await prisma.friendLink.count({ where: { state: 'PENDING' } })

  const blogCount = blogGroups.reduce((total, group) => total + group._count._all, 0)
  const noteCount = noteGroups.reduce((total, group) => total + group._count._all, 0)
  const blogDraftCount = blogGroups.reduce(
    (total, group) => total + (group.isPublished ? 0 : group._count._all),
    0,
  )
  const noteDraftCount = noteGroups.reduce(
    (total, group) => total + (group.isPublished ? 0 : group._count._all),
    0,
  )
  const commentPendingCount = siteCommentPendingCount + mutterCommentPendingCount

  return {
    blogCount,
    noteCount,
    blogDraftCount,
    noteDraftCount,
    draftCount: blogDraftCount + noteDraftCount,
    commentPendingCount,
    friendLinkPendingCount,
    pendingCount: commentPendingCount + friendLinkPendingCount,
  }
}
