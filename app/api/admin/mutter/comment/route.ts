import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  deleteMutterCommentQuerySchema,
  getAdminMutterCommentsQuerySchema,
  updateMutterCommentSchema,
} from './type'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getAdminMutterCommentsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    mutterId: request.nextUrl.searchParams.get('mutterId') ?? undefined,
    state: request.nextUrl.searchParams.get('state') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, mutterId, state, take, skip } = queryResult.data

  const where = {
    ...(q != null && q.length > 0
      ? {
          content: {
            contains: q,
          },
        }
      : {}),
    ...(mutterId != null ? { mutterId } : {}),
    ...(state != null ? { state } : {}),
  }

  const [list, total] = await Promise.all([
    prisma.mutterComment.findMany({
      where,
      include: {
        mutter: {
          select: {
            id: true,
            content: true,
            isPublished: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    }),
    prisma.mutterComment.count({ where }),
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
  const parseResult = updateMutterCommentSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  const existing = await prisma.mutterComment.findUnique({
    where: {
      id: payload.id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id: payload.id } })
  }

  const updated = await prisma.mutterComment.update({
    where: {
      id: payload.id,
    },
    data: {
      state: payload.state,
    },
  })

  revalidatePath('/mutter')
  revalidatePath('/admin/mutter')

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteMutterCommentQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data

  const existing = await prisma.mutterComment.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id } })
  }

  await prisma.mutterComment.delete({
    where: {
      id,
    },
  })

  revalidatePath('/mutter')
  revalidatePath('/admin/mutter')

  return {
    message: 'Deleted.',
    id,
  }
})
