import { prisma } from '@/prisma/instance'
import { MutterListClient } from './mutter-list-client'

export default async function MutterPage() {
  const pageSize = 10
  const where = {
    isPublished: true,
  }
  const [mutters, total] = await Promise.all([
    prisma.mutter.findMany({
      where,
      select: {
        id: true,
        content: true,
        likeCount: true,
        createdAt: true,
        _count: {
          select: {
            comments: {
              where: {
                state: 'APPROVED',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: pageSize,
    }),
    prisma.mutter.count({ where }),
  ])

  return (
    <MutterListClient
      mutters={mutters.map(item => ({
        id: item.id,
        content: item.content,
        likeCount: item.likeCount,
        createdAt: item.createdAt.toISOString(),
        commentCount: item._count.comments,
      }))}
      total={total}
    />
  )
}
