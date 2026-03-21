import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { updateCommentConfigSchema } from './type'

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

export const GET = withResponse(async () => {
  await requireAdmin()

  let config: Awaited<ReturnType<typeof prisma.siteCommentConfig.upsert>>

  try {
    config = await prisma.siteCommentConfig.upsert({
      where: {
        id: SITE_COMMENT_CONFIG_ID,
      },
      create: {
        id: SITE_COMMENT_CONFIG_ID,
        ...DEFAULT_SITE_COMMENT_CONFIG,
      },
      update: {},
    })
  } catch (error) {
    if (isMissingTableError(error)) {
      throw new BadRequestError('Comment system is not initialized. Please run Prisma migration.')
    }

    throw error
  }

  return {
    data: config,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateCommentConfigSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  let updated: Awaited<ReturnType<typeof prisma.siteCommentConfig.upsert>>

  try {
    updated = await prisma.siteCommentConfig.upsert({
      where: {
        id: SITE_COMMENT_CONFIG_ID,
      },
      create: {
        id: SITE_COMMENT_CONFIG_ID,
        ...payload,
      },
      update: payload,
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
