import { BadRequestError } from '@/lib/common/errors/request'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { getPublicEchosQuerySchema } from './type'

export const GET = withResponse(async request => {
  const queryResult = getPublicEchosQuerySchema.safeParse({
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
          content: {
            contains: q,
          },
        }
      : {}),
  }

  const total = await prisma.echo.count({ where })

  if (total === 0) {
    return null
  }

  const randomSkip = Math.floor(Math.random() * total)

  return await prisma.echo.findFirst({
    where,
    orderBy: {
      id: 'asc',
    },
    skip: randomSkip,
  })
})
