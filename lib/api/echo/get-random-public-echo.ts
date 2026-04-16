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

  const total = await prisma.echo.count({ where })

  if (total === 0) {
    return null
  }

  const randomSkip = Math.floor(Math.random() * total)

  const echo =
    (await prisma.echo.findFirst({
      where,
      orderBy: {
        id: 'asc',
      },
      skip: randomSkip,
      select,
    })) ??
    (await prisma.echo.findFirst({
      where,
      orderBy: {
        id: 'asc',
      },
      select,
    }))

  return echo
}
