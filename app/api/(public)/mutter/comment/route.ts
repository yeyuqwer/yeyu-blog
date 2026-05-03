import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { isAdminUser, isWalletSessionUser, requireSignedInUser } from '@/lib/core/auth/guard'
import { notifyAdminNewMutterComment } from '@/lib/infra/email/notifications'
import { sendEmailInBackground } from '@/lib/infra/email/send-email'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createMutterCommentSchema,
  deleteMutterCommentQuerySchema,
  getPublicMutterCommentsQuerySchema,
} from './type'

const mutterCommentConfigId = 1
const defaultMutterCommentConfig = {
  autoApproveEmailUsers: true,
  autoApproveWalletUsers: false,
}
const deletedCommentText = '已删除'

const isMissingTableError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'P2021'

const getMutterCommentPolicy = async () => {
  try {
    const config = await prisma.mutterCommentConfig.findUnique({
      where: {
        id: mutterCommentConfigId,
      },
      select: {
        autoApproveEmailUsers: true,
        autoApproveWalletUsers: true,
      },
    })

    return {
      autoApproveEmailUsers:
        config?.autoApproveEmailUsers ?? defaultMutterCommentConfig.autoApproveEmailUsers,
      autoApproveWalletUsers:
        config?.autoApproveWalletUsers ?? defaultMutterCommentConfig.autoApproveWalletUsers,
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      return defaultMutterCommentConfig
    }

    throw error
  }
}

export const GET = withResponse(async request => {
  const queryResult = getPublicMutterCommentsQuerySchema.safeParse({
    mutterId: request.nextUrl.searchParams.get('mutterId') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { mutterId, take, skip } = queryResult.data

  const where = {
    mutterId,
    state: 'APPROVED' as const,
    mutter: {
      isPublished: true,
    },
  }

  const [rawList, total] = await Promise.all([
    prisma.mutterComment.findMany({
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
    }),
    prisma.mutterComment.count({ where }),
  ])

  const list = rawList.map(comment => ({
    id: comment.id,
    mutterId: comment.mutterId,
    userId: comment.userId,
    isAdmin: isAdminUser(comment.user),
    authorName: comment.authorName,
    authorImage: comment.authorImage,
    content: comment.isDeleted ? deletedCommentText : comment.content,
    isDeleted: comment.isDeleted,
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
  const config = await getMutterCommentPolicy()

  const body = await readJsonBody(request)
  const parseResult = createMutterCommentSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  const mutter = await prisma.mutter.findUnique({
    where: {
      id: payload.mutterId,
    },
    select: {
      id: true,
      isPublished: true,
    },
  })

  if (mutter == null || !mutter.isPublished) {
    throw new BadRequestError('Mutter not found.')
  }

  const isWalletUser = isWalletSessionUser(user)
  const autoApproveByPolicy = isWalletUser
    ? config.autoApproveWalletUsers
    : config.autoApproveEmailUsers
  const currentUserIsAdmin = isAdminUser(user)
  const autoApprove = currentUserIsAdmin || autoApproveByPolicy

  const created = await prisma.mutterComment.create({
    data: {
      mutterId: payload.mutterId,
      userId: user.id,
      authorName: user.name || user.email || 'Anonymous',
      authorImage: user.image,
      content: payload.content,
      state: autoApprove ? 'APPROVED' : 'PENDING',
    },
  })

  sendEmailInBackground(() =>
    notifyAdminNewMutterComment({
      authorName: created.authorName,
      authorEmail: user.email,
      content: created.content,
      mutterId: created.mutterId,
      state: created.state,
    }),
  )

  return {
    message: autoApprove ? 'Comment published.' : 'Comment submitted, waiting for approval.',
    data: created,
  }
})

export const DELETE = withResponse(async request => {
  const user = await requireSignedInUser()

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
    select: {
      id: true,
      userId: true,
      mutterId: true,
    },
  })

  if (existing == null) {
    throw new BadRequestError('Comment not found.', { data: { id } })
  }

  if (existing.userId !== user.id) {
    throw new BadRequestError('只能删除自己的评论。')
  }

  await prisma.mutterComment.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  })

  revalidatePath('/mutter')

  return {
    message: 'Deleted.',
    id,
    mutterId: existing.mutterId,
  }
})
