import { BadRequestError } from '@/lib/common/errors/request'
import { isAdminUser, isWalletSessionUser, requireSignedInUser } from '@/lib/core/auth/guard'
import { getSiteCommentTarget } from '@/lib/core/site-comment/target'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { createCommentSchema, getPublicCommentsQuerySchema } from './type'

const SITE_COMMENT_CONFIG_ID = 1
const DEFAULT_SITE_COMMENT_CONFIG = {
  autoApproveEmailUsers: true,
  autoApproveWalletUsers: false,
}

const isMissingTableError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'P2021'

const getSiteCommentPolicy = async () => {
  try {
    const config = await prisma.siteCommentConfig.findUnique({
      where: {
        id: SITE_COMMENT_CONFIG_ID,
      },
      select: {
        autoApproveEmailUsers: true,
        autoApproveWalletUsers: true,
      },
    })

    return {
      autoApproveEmailUsers:
        config?.autoApproveEmailUsers ?? DEFAULT_SITE_COMMENT_CONFIG.autoApproveEmailUsers,
      autoApproveWalletUsers:
        config?.autoApproveWalletUsers ?? DEFAULT_SITE_COMMENT_CONFIG.autoApproveWalletUsers,
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      return DEFAULT_SITE_COMMENT_CONFIG
    }

    throw error
  }
}

export const GET = withResponse(async request => {
  const queryResult = getPublicCommentsQuerySchema.safeParse({
    targetType: request.nextUrl.searchParams.get('targetType') ?? undefined,
    targetId: request.nextUrl.searchParams.get('targetId') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { targetType, targetId, take, skip } = queryResult.data
  const target = await getSiteCommentTarget(targetType, targetId)

  if (target == null || !target.isPublished) {
    return {
      list: [],
      total: 0,
      take,
      skip,
    }
  }

  const where = {
    targetType,
    targetId,
    state: 'APPROVED' as const,
  }

  const getPublicSiteCommentList = () =>
    prisma.siteComment.findMany({
      where,
      include: {
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
    })

  let rawList: Awaited<ReturnType<typeof getPublicSiteCommentList>>
  let total: number

  try {
    ;[rawList, total] = await Promise.all([
      getPublicSiteCommentList(),
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

  const list = rawList.map(comment => ({
    id: comment.id,
    targetType: comment.targetType,
    targetId: comment.targetId,
    userId: comment.userId,
    isAdmin: isAdminUser(comment.user),
    authorName: comment.authorName,
    authorImage: comment.authorImage,
    content: comment.content,
    state: comment.state,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user:
      comment.user == null
        ? null
        : {
            id: comment.user.id,
            name: comment.user.name,
            image: comment.user.image,
          },
  }))

  return {
    list,
    total,
    take,
    skip,
  }
})

export const POST = withResponse(async request => {
  const user = await requireSignedInUser()
  const config = await getSiteCommentPolicy()

  const body = await readJsonBody(request)
  const parseResult = createCommentSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data
  const target = await getSiteCommentTarget(payload.targetType, payload.targetId)

  if (target == null || !target.isPublished) {
    throw new BadRequestError('Article not found.')
  }

  const isWalletUser = isWalletSessionUser(user)
  const autoApproveByPolicy = isWalletUser
    ? config.autoApproveWalletUsers
    : config.autoApproveEmailUsers
  const autoApprove = isAdminUser(user) || autoApproveByPolicy

  let created: Awaited<ReturnType<typeof prisma.siteComment.create>>

  try {
    created = await prisma.siteComment.create({
      data: {
        targetType: payload.targetType,
        targetId: payload.targetId,
        userId: user.id,
        authorName: user.name || user.email || 'Anonymous',
        authorImage: user.image,
        content: payload.content,
        state: autoApprove ? 'APPROVED' : 'PENDING',
      },
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    message: autoApprove ? 'Comment published.' : 'Comment submitted, waiting for approval.',
    data: created,
  }
})
