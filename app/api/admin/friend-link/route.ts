import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  deleteFriendLinkQuerySchema,
  getAdminFriendLinksQuerySchema,
  updateFriendLinkSchema,
} from './type'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getAdminFriendLinksQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    state: request.nextUrl.searchParams.get('state') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, state, take, skip } = queryResult.data
  const where = {
    ...(q != null && q.length > 0
      ? {
          OR: [
            {
              name: {
                contains: q,
              },
            },
            {
              description: {
                contains: q,
              },
            },
            {
              siteUrl: {
                contains: q,
              },
            },
          ],
        }
      : {}),
    ...(state != null ? { state } : {}),
  }

  const [list, total] = await Promise.all([
    prisma.friendLink.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
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

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateFriendLinkSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data
  const existing = await prisma.friendLink.findUnique({
    where: {
      id: payload.id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Friend link not found.', { data: { id: payload.id } })
  }

  const updated = await prisma.friendLink.update({
    where: {
      id: payload.id,
    },
    data: {
      ...(payload.name != null ? { name: payload.name } : {}),
      ...(payload.description != null ? { description: payload.description } : {}),
      ...(payload.avatarUrl != null ? { avatarUrl: payload.avatarUrl } : {}),
      ...(payload.siteUrl != null ? { siteUrl: payload.siteUrl } : {}),
      ...(payload.state != null ? { state: payload.state } : {}),
    },
  })

  revalidatePath('/friends')
  revalidatePath('/admin/friend-link')

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteFriendLinkQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data
  const existing = await prisma.friendLink.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Friend link not found.', { data: { id } })
  }

  await prisma.friendLink.delete({
    where: {
      id,
    },
  })

  revalidatePath('/friends')
  revalidatePath('/admin/friend-link')

  return {
    message: 'Deleted.',
    id,
  }
})
