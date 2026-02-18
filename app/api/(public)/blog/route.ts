import { BadRequestError } from '@/lib/common/errors/request'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { getPublicBlogsQuerySchema } from './type'

export const GET = withResponse(async request => {
  const queryResult = getPublicBlogsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q } = queryResult.data
  const where = {
    isPublished: true,
    ...(q != null && q.length > 0
      ? {
          title: {
            contains: q,
          },
        }
      : {}),
  }

  return await prisma.blog.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      tags: true,
    },
  })
})
