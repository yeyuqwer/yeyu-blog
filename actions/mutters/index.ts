'use server'

import { prisma } from '@/prisma/instance'

export async function getAllMutters() {
  return await prisma.mutter.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}
