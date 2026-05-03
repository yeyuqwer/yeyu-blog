import 'server-only'

import type { Prisma } from '@prisma/client'
import type { PublicEchoCardData } from './type'
import { prisma } from '@/prisma/instance'

type GetRandomPublicEchoParams = {
  q?: string
}

const select = {
  id: true,
  content: true,
  reference: true,
} satisfies Prisma.EchoSelect

export async function getRandomPublicEcho(
  params: GetRandomPublicEchoParams = {},
): Promise<PublicEchoCardData> {
  const keyword = params.q?.trim()

  const where: Prisma.EchoWhereInput = {
    isPublished: true,
    ...(keyword
      ? {
          content: {
            contains: keyword,
          },
        }
      : {}),
  }

  const ids = await prisma.echo.findMany({ where, select: { id: true } })

  if (ids.length === 0) {
    return null
  }

  const { id } = ids[Math.floor(Math.random() * ids.length)]

  return prisma.echo.findUnique({ where: { id }, select })
}
