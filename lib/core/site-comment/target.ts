import type { SiteCommentTargetType } from '@prisma/client'
import { prisma } from '@/prisma/instance'

export type SiteCommentTargetRecord = {
  id: number
  title: string
  slug: string
  isPublished: boolean
  targetType: SiteCommentTargetType
  path: string
}

export const getSiteCommentTargetKey = (targetType: SiteCommentTargetType, targetId: number) =>
  `${targetType}:${targetId}`

export async function getSiteCommentTarget(
  targetType: SiteCommentTargetType,
  targetId: number,
): Promise<SiteCommentTargetRecord | null> {
  switch (targetType) {
    case 'BLOG': {
      const blog = await prisma.blog.findUnique({
        where: {
          id: targetId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
        },
      })

      if (blog == null) {
        return null
      }

      return {
        ...blog,
        targetType,
        path: `/blog/${blog.slug}`,
      }
    }
    case 'NOTE': {
      const note = await prisma.note.findUnique({
        where: {
          id: targetId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
        },
      })

      if (note == null) {
        return null
      }

      return {
        ...note,
        targetType,
        path: `/note/${note.slug}`,
      }
    }
  }
}

export async function getSiteCommentTargetMap(
  targets: Array<{
    targetType: SiteCommentTargetType
    targetId: number
  }>,
) {
  const blogIds = [
    ...new Set(
      targets.filter(target => target.targetType === 'BLOG').map(target => target.targetId),
    ),
  ]
  const noteIds = [
    ...new Set(
      targets.filter(target => target.targetType === 'NOTE').map(target => target.targetId),
    ),
  ]

  const [blogs, notes] = await Promise.all([
    blogIds.length === 0
      ? Promise.resolve([])
      : prisma.blog.findMany({
          where: {
            id: {
              in: blogIds,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
          },
        }),
    noteIds.length === 0
      ? Promise.resolve([])
      : prisma.note.findMany({
          where: {
            id: {
              in: noteIds,
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
          },
        }),
  ])

  const map = new Map<string, SiteCommentTargetRecord>()

  for (const blog of blogs) {
    map.set(getSiteCommentTargetKey('BLOG', blog.id), {
      ...blog,
      targetType: 'BLOG',
      path: `/blog/${blog.slug}`,
    })
  }

  for (const note of notes) {
    map.set(getSiteCommentTargetKey('NOTE', note.id), {
      ...note,
      targetType: 'NOTE',
      path: `/note/${note.slug}`,
    })
  }

  return map
}
