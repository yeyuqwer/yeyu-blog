import 'server-only'

import { prisma } from '@/prisma/instance'
import { getAdminPendingCount } from '../pending-count/get-admin-pending-count'

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
  const [blogGroups, noteGroups, pendingCount] = await Promise.all([
    prisma.blog.groupBy({
      by: ['isPublished'],
      _count: { _all: true },
    }),
    prisma.note.groupBy({
      by: ['isPublished'],
      _count: { _all: true },
    }),
    getAdminPendingCount(),
  ])

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

  return {
    blogCount,
    noteCount,
    blogDraftCount,
    noteDraftCount,
    draftCount: blogDraftCount + noteDraftCount,
    commentPendingCount: pendingCount.commentPendingCount,
    friendLinkPendingCount: pendingCount.friendLinkPendingCount,
    pendingCount: pendingCount.pendingCount,
  }
}
