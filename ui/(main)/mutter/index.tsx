import { prisma } from '@/prisma/instance'
import { MutterListClient } from './mutter-list-client'

export default async function MutterPage() {
  const mutters = await prisma.mutter.findMany({
    where: {
      isPublished: true,
    },
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
    take: 20,
  })

  return (
    <MutterListClient
      mutters={mutters.map(item => ({
        id: item.id,
        content: item.content,
        likeCount: item.likeCount,
        createdAt: item.createdAt.toISOString(),
        commentCount: item._count.comments,
      }))}
    />
  )
}
