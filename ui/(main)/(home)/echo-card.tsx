import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/prisma/instance'
import EchoCardContent, { type EchoCardViewData } from './echo-card-content'

async function getRandomPublishedEcho(): Promise<EchoCardViewData> {
  const where = { isPublished: true }
  const total = await prisma.echo.count({ where })

  if (total === 0) {
    return null
  }

  const randomSkip = Math.floor(Math.random() * total)

  return await prisma.echo.findFirst({
    where,
    orderBy: { id: 'asc' },
    skip: randomSkip,
    select: {
      id: true,
      content: true,
      reference: true,
    },
  })
}

export default async function EchoCard() {
  noStore()

  const echo = await getRandomPublishedEcho()

  return <EchoCardContent echo={echo} />
}
