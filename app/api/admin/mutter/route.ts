import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createMutterSchema,
  deleteMutterQuerySchema,
  getMuttersQuerySchema,
  updateMutterSchema,
} from './type'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getMuttersQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    isPublished: request.nextUrl.searchParams.get('isPublished') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, isPublished, take, skip } = queryResult.data
  const where = {
    ...(q != null && q.length > 0
      ? {
          content: {
            contains: q,
          },
        }
      : {}),
    ...(isPublished != null ? { isPublished: isPublished === 'true' } : {}),
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

export const POST = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = createMutterSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data
  const created = await prisma.mutter.create({
    data: {
      content: payload.content,
      isPublished: payload.isPublished,
    },
  })

  return {
    message: 'Created.',
    data: created,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateMutterSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, content, isPublished } = parseResult.data
  const existing = await prisma.mutter.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Mutter not found.', { data: { id } })
  }

  const updated = await prisma.mutter.update({
    where: {
      id,
    },
    data: {
      ...(content != null ? { content } : {}),
      ...(isPublished != null ? { isPublished } : {}),
    },
  })

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteMutterQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data
  const existing = await prisma.mutter.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Mutter not found.', { data: { id } })
  }

  await prisma.mutter.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Deleted.',
    id,
  }
})
