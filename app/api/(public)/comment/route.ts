import { getSiteCommentTarget } from '@/lib/api/comment/target'
import { BadRequestError } from '@/lib/common/errors/request'
import { isAdminUser, isWalletSessionUser, requireSignedInUser } from '@/lib/core/auth/guard'
import { commentProcessor } from '@/lib/core/markdown/comment-processor'
import {
  notifyAdminNewSiteComment,
  notifyCommentAuthorReply,
} from '@/lib/infra/email/notifications'
import { sendEmailInBackground } from '@/lib/infra/email/send-email'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { createCommentSchema, deleteCommentQuerySchema, getPublicCommentsQuerySchema } from './type'

const siteCommentConfigId = 1
const defaultSiteCommentConfig = {
  autoApproveEmailUsers: true,
  autoApproveWalletUsers: false,
}
const deletedCommentText = '已删除'
const commentLoginProviderIds = ['github', 'google']

type PublicCommentUserRecord = {
  id: string
  name: string
  email: string
  image: string | null
  accounts: {
    providerId: string
    accountId: string
  }[]
}

type PublicCommentParentRecord = {
  id: number
  userId: string | null
  authorName: string
  authorImage: string | null
  isDeleted: boolean
  user: PublicCommentUserRecord | null
}

type PublicCommentRecord = {
  id: number
  targetType: 'BLOG' | 'NOTE'
  targetId: number
  parentId: number | null
  userId: string | null
  authorName: string
  authorImage: string | null
  content: string
  isDeleted: boolean
  state: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
  user: PublicCommentUserRecord | null
  parent: PublicCommentParentRecord | null
}

const publicCommentUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  accounts: {
    where: {
      providerId: {
        in: commentLoginProviderIds,
      },
    },
    select: {
      providerId: true,
      accountId: true,
    },
  },
} as const

const publicCommentInclude = {
  user: {
    select: publicCommentUserSelect,
  },
  parent: {
    select: {
      id: true,
      userId: true,
      authorName: true,
      authorImage: true,
      isDeleted: true,
      user: {
        select: publicCommentUserSelect,
      },
    },
  },
} as const

const serializePublicCommentUser = (user: PublicCommentUserRecord) => ({
  id: user.id,
  name: user.name,
  image: user.image,
  accounts: user.accounts.map(account => ({
    providerId: account.providerId,
    accountId: account.accountId,
  })),
})

const serializePublicCommentParent = (comment: PublicCommentParentRecord) => {
  return {
    id: comment.id,
    userId: comment.userId,
    isAdmin: isAdminUser(comment.user),
    authorName: comment.authorName,
    authorImage: comment.authorImage,
    isDeleted: comment.isDeleted,
    user: comment.user == null ? null : serializePublicCommentUser(comment.user),
  }
}

const serializePublicComment = async (comment: PublicCommentRecord) => {
  const content = comment.isDeleted ? deletedCommentText : comment.content
  const htmlContent = comment.isDeleted
    ? deletedCommentText
    : String(await commentProcessor.process(content))

  return {
    id: comment.id,
    targetType: comment.targetType,
    targetId: comment.targetId,
    parentId: comment.parentId,
    parent: comment.parent == null ? null : serializePublicCommentParent(comment.parent),
    userId: comment.userId,
    isAdmin: isAdminUser(comment.user),
    authorName: comment.authorName,
    authorImage: comment.authorImage,
    content,
    htmlContent,
    isDeleted: comment.isDeleted,
    state: comment.state,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: comment.user == null ? null : serializePublicCommentUser(comment.user),
  }
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
        id: siteCommentConfigId,
      },
      select: {
        autoApproveEmailUsers: true,
        autoApproveWalletUsers: true,
      },
    })

    return {
      autoApproveEmailUsers:
        config?.autoApproveEmailUsers ?? defaultSiteCommentConfig.autoApproveEmailUsers,
      autoApproveWalletUsers:
        config?.autoApproveWalletUsers ?? defaultSiteCommentConfig.autoApproveWalletUsers,
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      return defaultSiteCommentConfig
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
      include: publicCommentInclude,
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

  const list = await Promise.all(rawList.map(serializePublicComment))

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

  const parentComment =
    payload.parentId == null
      ? null
      : await prisma.siteComment.findUnique({
          where: {
            id: payload.parentId,
          },
          select: {
            id: true,
            targetType: true,
            targetId: true,
            authorName: true,
            state: true,
            user: {
              select: publicCommentUserSelect,
            },
          },
        })

  if (payload.parentId != null) {
    if (parentComment == null) {
      throw new BadRequestError('Reply target not found.')
    }

    if (
      parentComment.targetType !== payload.targetType ||
      parentComment.targetId !== payload.targetId
    ) {
      throw new BadRequestError('Reply target does not belong to the current article.')
    }

    if (parentComment.state !== 'APPROVED') {
      throw new BadRequestError('Reply target is not publicly visible.')
    }
  }

  const isWalletUser = isWalletSessionUser(user)
  const autoApproveByPolicy = isWalletUser
    ? config.autoApproveWalletUsers
    : config.autoApproveEmailUsers
  const currentUserIsAdmin = isAdminUser(user)
  const autoApprove = currentUserIsAdmin || autoApproveByPolicy

  let created: PublicCommentRecord

  try {
    created = await prisma.siteComment.create({
      data: {
        targetType: payload.targetType,
        targetId: payload.targetId,
        parentId: payload.parentId ?? null,
        userId: user.id,
        authorName: user.name || user.email || 'Anonymous',
        authorImage: user.image,
        content: payload.content,
        state: autoApprove ? 'APPROVED' : 'PENDING',
      },
      include: publicCommentInclude,
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  const shouldNotifyAdmin = !currentUserIsAdmin || payload.parentId == null

  if (shouldNotifyAdmin) {
    sendEmailInBackground(() =>
      notifyAdminNewSiteComment({
        authorName: created.authorName,
        authorEmail: user.email,
        content: created.content,
        targetTitle: target.title,
        targetPath: target.path,
        state: created.state,
      }),
    )
  }

  const parentCommentUser = parentComment?.user
  if (
    created.state === 'APPROVED' &&
    parentComment != null &&
    parentCommentUser != null &&
    !isAdminUser(parentCommentUser) &&
    !isWalletSessionUser(parentCommentUser) &&
    parentCommentUser.id !== user.id
  ) {
    const parentCommentUserEmail = parentCommentUser.email
    const parentCommentAuthorName = parentComment.authorName

    sendEmailInBackground(() =>
      notifyCommentAuthorReply({
        to: parentCommentUserEmail,
        recipientName: parentCommentAuthorName,
        replyAuthorName: created.authorName,
        targetTitle: target.title,
        targetPath: target.path,
        replyContent: created.content,
      }),
    )
  }

  return {
    message: autoApprove ? 'Comment published.' : 'Comment submitted, waiting for approval.',
    data: await serializePublicComment(created),
  }
})

export const DELETE = withResponse(async request => {
  const user = await requireSignedInUser()

  const queryResult = deleteCommentQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data
  const existing = await prisma.siteComment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id } })
  }

  if (existing.userId !== user.id) {
    throw new BadRequestError('只能删除自己的评论。')
  }

  await prisma.siteComment.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  })

  return {
    message: 'Deleted.',
    id,
  }
})
