import { BadRequestError } from '@/lib/common/errors/request'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { getPublicMuttersQuerySchema } from './type'

export const GET = withResponse(async request => {
  const queryResult = getPublicMuttersQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, take, skip } = queryResult.data
  const where = {
    isPublished: true,
    ...(q != null && q.length > 0
      ? {
          content: {
            contains: q,
          },
        }
      : {}),
  }

  const [list, total] = await Promise.all([
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
      take,
      skip,
    }),
    prisma.mutter.count({ where }),
  ])

  return {
    list: list.map(item => ({
      id: item.id,
      content: item.content,
      likeCount: item.likeCount,
      createdAt: item.createdAt,
      commentCount: item._count.comments,
    })),
    total,
    take,
    skip,
  }
})
