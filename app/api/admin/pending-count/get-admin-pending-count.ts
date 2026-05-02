import 'server-only'

import { prisma } from '@/prisma/instance'

export async function getAdminPendingCount() {
  const [siteCommentPendingCount, mutterCommentPendingCount, friendLinkPendingCount] =
    await Promise.all([
      prisma.siteComment.count({ where: { state: 'PENDING' } }),
      prisma.mutterComment.count({ where: { state: 'PENDING' } }),
      prisma.friendLink.count({ where: { state: 'PENDING' } }),
    ])
  const commentPendingCount = siteCommentPendingCount + mutterCommentPendingCount

  return {
    siteCommentPendingCount,
    mutterCommentPendingCount,
    commentPendingCount,
    friendLinkPendingCount,
    pendingCount: commentPendingCount + friendLinkPendingCount,
  }
}
