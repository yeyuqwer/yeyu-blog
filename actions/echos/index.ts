'use server'

import type { CreateEchoDTO, UpdateEchoDTO } from './type'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/core/auth/guard'
import { prisma } from '@/prisma/instance'

export async function createEcho(values: CreateEchoDTO) {
  await requireAdmin()

  revalidatePath('/')
  revalidatePath('/admin/echo')

  return await prisma.echo.create({
    data: {
      content: values.content,
      reference: values.reference,
      isPublished: values.isPublished,
    },
  })
}

export async function deleteEchoById(id: number) {
  await requireAdmin()

  revalidatePath('/')
  revalidatePath('/admin/echo')

  return await prisma.echo.delete({
    where: {
      id,
    },
  })
}

export async function updateEchoById(values: UpdateEchoDTO) {
  await requireAdmin()

  revalidatePath('/')

  return await prisma.echo.update({
    where: {
      id: values.id,
    },
    data: {
      content: values.content,
      reference: values.reference,
      isPublished: values.isPublished,
      createdAt: new Date(),
    },
  })
}

export async function toggleEchoPublishedById(id: number, newIsPublishedStatus: boolean) {
  await requireAdmin()

  revalidatePath('/')

  return await prisma.echo.update({
    where: {
      id,
    },
    data: {
      isPublished: newIsPublishedStatus,
    },
  })
}

export async function getQueryEchos(queryContent: string) {
  return await prisma.echo.findMany({
    where: {
      content: {
        contains: queryContent,
      },
    },
  })
}

export async function getAllEchos() {
  return await prisma.echo.findMany()
}

export async function getAllPublishedEcho() {
  return await prisma.echo.findMany({
    where: {
      isPublished: true,
    },
  })
}
