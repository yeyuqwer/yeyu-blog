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
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    }),
    prisma.mutter.count({ where }),
  ])

  return {
    list,
    total,
    take,
    skip,
  }
})
