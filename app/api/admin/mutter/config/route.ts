import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { updateMutterCommentConfigSchema } from './type'

const MUTTER_COMMENT_CONFIG_ID = 1
const DEFAULT_MUTTER_COMMENT_CONFIG = {
  autoApproveEmailUsers: true,
  autoApproveWalletUsers: false,
}

export const GET = withResponse(async () => {
  await requireAdmin()

  const config = await prisma.mutterCommentConfig.upsert({
    where: {
      id: MUTTER_COMMENT_CONFIG_ID,
    },
    create: {
      id: MUTTER_COMMENT_CONFIG_ID,
      ...DEFAULT_MUTTER_COMMENT_CONFIG,
    },
    update: {},
  })

  return {
    data: config,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateMutterCommentConfigSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  const updated = await prisma.mutterCommentConfig.upsert({
    where: {
      id: MUTTER_COMMENT_CONFIG_ID,
    },
    create: {
      id: MUTTER_COMMENT_CONFIG_ID,
      ...payload,
    },
    update: payload,
  })

  revalidatePath('/admin/mutter')

  return {
    message: 'Updated.',
    data: updated,
  }
})
