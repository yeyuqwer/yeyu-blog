import { BadRequestError } from '@/lib/common/errors/request'
import { isAdminUser, requireAdmin } from '@/lib/core/auth/guard'
import { getSiteCommentTargetKey, getSiteCommentTargetMap } from '@/lib/core/site-comment/target'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { deleteCommentQuerySchema, getAdminCommentsQuerySchema, updateCommentSchema } from './type'

type AdminCommentUserRecord = {
  id: string
  name: string
  email: string
  image: string | null
}

type AdminCommentParentRecord = {
  id: number
  userId: string | null
  authorName: string
  authorImage: string | null
  user: AdminCommentUserRecord | null
}

const adminCommentUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const

const adminCommentInclude = {
  user: {
    select: adminCommentUserSelect,
  },
  parent: {
    select: {
      id: true,
      userId: true,
      authorName: true,
      authorImage: true,
      user: {
        select: adminCommentUserSelect,
      },
    },
  },
} as const

const serializeAdminCommentParent = (comment: AdminCommentParentRecord) => ({
  id: comment.id,
  userId: comment.userId,
  isAdmin: isAdminUser(comment.user),
  authorName: comment.authorName,
  authorImage: comment.authorImage,
  user:
    comment.user == null
      ? null
      : {
          id: comment.user.id,
          name: comment.user.name,
          image: comment.user.image,
        },
})

const isMissingTableError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'P2021'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getAdminCommentsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    targetType: request.nextUrl.searchParams.get('targetType') ?? undefined,
    targetId: request.nextUrl.searchParams.get('targetId') ?? undefined,
    state: request.nextUrl.searchParams.get('state') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, targetType, targetId, state, take, skip } = queryResult.data

  const where = {
    ...(q != null && q.length > 0
      ? {
          content: {
            contains: q,
          },
        }
      : {}),
    ...(targetType != null ? { targetType } : {}),
    ...(targetId != null ? { targetId } : {}),
    ...(state != null ? { state } : {}),
  }

  const getAdminSiteCommentList = () =>
    prisma.siteComment.findMany({
      where,
      include: adminCommentInclude,
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    })

  let rawList: Awaited<ReturnType<typeof getAdminSiteCommentList>>
  let total: number

  try {
    ;[rawList, total] = await Promise.all([
      getAdminSiteCommentList(),
      prisma.siteComment.count({ where }),
    ])
  } catch (error) {
    if (isMissingTableError(error)) {
      return {
        list: [],
        total: 0,
        take,
        skip,
      }
    }

    throw error
  }

  const targetMap = await getSiteCommentTargetMap(rawList)

  const list = rawList.map(comment => ({
    ...comment,
    parent: comment.parent == null ? null : serializeAdminCommentParent(comment.parent),
    target: targetMap.get(getSiteCommentTargetKey(comment.targetType, comment.targetId)) ?? null,
  }))

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
  const parseResult = updateCommentSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  let existing: Awaited<ReturnType<typeof prisma.siteComment.findUnique>>

  try {
    existing = await prisma.siteComment.findUnique({
      where: {
        id: payload.id,
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id: payload.id } })
  }

  let updated: Awaited<ReturnType<typeof prisma.siteComment.update>>

  try {
    updated = await prisma.siteComment.update({
      where: {
        id: payload.id,
      },
      data: {
        state: payload.state,
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteCommentQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data

  let existing: Awaited<ReturnType<typeof prisma.siteComment.findUnique>>

  try {
    existing = await prisma.siteComment.findUnique({
      where: {
        id,
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id } })
  }

  try {
    await prisma.siteComment.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    message: 'Deleted.',
    id,
  }
})
