import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { likeMutterSchema } from './type'

export const POST = withResponse(async request => {
  const body = await readJsonBody(request)
  const parseResult = likeMutterSchema.safeParse(body)

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
      updatedAt: true,
    },
  })

  if (mutter == null || !mutter.isPublished) {
    throw new BadRequestError('Mutter not found.')
  }

  const updated = await prisma.mutter.update({
    where: {
      id: payload.mutterId,
    },
    data: {
      likeCount: {
        increment: 1,
      },
      updatedAt: mutter.updatedAt,
    },
    select: {
      id: true,
      likeCount: true,
    },
  })

  revalidatePath('/mutter')

  return {
    message: 'Liked.',
    data: updated,
  }
})
