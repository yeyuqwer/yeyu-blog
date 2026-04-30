import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { createFriendLinkSchema, getPublicFriendLinksQuerySchema } from './type'

export const GET = withResponse(async request => {
  const queryResult = getPublicFriendLinksQuerySchema.safeParse({
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { take, skip } = queryResult.data
  const where = {
    state: 'APPROVED' as const,
  }

  const [list, total] = await Promise.all([
    prisma.friendLink.findMany({
      where,
      orderBy: [
        {
          updatedAt: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      take,
      skip,
    }),
    prisma.friendLink.count({ where }),
  ])

  return {
    list,
    total,
    take,
    skip,
  }
})

export const POST = withResponse(async request => {
  const body = await readJsonBody(request)
  const parseResult = createFriendLinkSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const created = await prisma.friendLink.create({
    data: {
      ...parseResult.data,
      state: 'PENDING',
    },
  })

  revalidatePath('/friends')
  revalidatePath('/admin/friend-link')

  return {
    message: '友链申请已提交，等待审核。',
    data: created,
  }
})
