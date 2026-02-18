import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createEchoSchema,
  deleteEchoQuerySchema,
  getEchosQuerySchema,
  updateEchoSchema,
} from './type'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getEchosQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q } = queryResult.data
  const where =
    q != null && q.length > 0
      ? {
          content: {
            contains: q,
          },
        }
      : undefined

  return await prisma.echo.findMany({ where })
})

export const POST = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = createEchoSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const created = await prisma.echo.create({
    data: {
      content: parseResult.data.content,
      reference: parseResult.data.reference,
      isPublished: parseResult.data.isPublished,
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
  const parseResult = updateEchoSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, content, reference, isPublished } = parseResult.data

  const existing = await prisma.echo.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Echo not found.', { data: { id } })
  }

  const shouldTouchCreatedAt = content != null || reference != null

  const updated = await prisma.echo.update({
    where: {
      id,
    },
    data: {
      ...(content != null ? { content } : {}),
      ...(reference != null ? { reference } : {}),
      ...(isPublished != null ? { isPublished } : {}),
      ...(shouldTouchCreatedAt ? { createdAt: new Date() } : {}),
    },
  })

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteEchoQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data

  const existing = await prisma.echo.findUnique({
    where: {
      id,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Echo not found.', { data: { id } })
  }

  await prisma.echo.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Deleted.',
    id,
  }
})
