import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createNoteSchema,
  deleteNoteQuerySchema,
  getNotesQuerySchema,
  updateNoteSchema,
} from './type'

function parseTagNames(rawTagNames: string | undefined) {
  if (rawTagNames == null || rawTagNames.length === 0) {
    return []
  }

  return rawTagNames
    .split(',')
    .map(value => value.trim())
    .filter(value => value.length > 0)
}

function revalidateNotePaths(...slugs: Array<string | undefined>) {
  revalidatePath('/note')
  revalidatePath('/admin/note')

  const uniqueSlugs = new Set(
    slugs
      .map(slug => slug?.trim())
      .filter((slug): slug is string => slug != null && slug.length > 0),
  )

  for (const slug of uniqueSlugs) {
    revalidatePath(`/note/${encodeURIComponent(slug)}`)
  }
}

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getNotesQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    tagNames: request.nextUrl.searchParams.get('tagNames') ?? undefined,
    take: request.nextUrl.searchParams.get('take') ?? undefined,
    skip: request.nextUrl.searchParams.get('skip') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, tagNames: rawTagNames, take, skip } = queryResult.data
  const tagNames = parseTagNames(rawTagNames)

  const andWhere = [
    ...(q != null && q.length > 0
      ? [
          {
            title: {
              contains: q,
            },
          },
        ]
      : []),
    ...tagNames.map(tagName => ({
      tags: {
        some: {
          tagName,
        },
      },
    })),
  ]

  const where = andWhere.length > 0 ? { AND: andWhere } : undefined

  const [list, total] = await Promise.all([
    prisma.note.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    }),
    prisma.note.count({ where }),
  ])

  return {
    list,
    total,
    take,
    skip,
  }
})

export const POST = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = createNoteSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  const existingNote = await prisma.note.findUnique({
    where: { slug: payload.slug },
  })

  if (existingNote != null) {
    throw new BadRequestError('该 slug 已存在', { data: { slug: payload.slug } })
  }

  const relatedTags = await prisma.noteTag.findMany({
    where: {
      tagName: {
        in: payload.relatedTagNames,
      },
    },
    select: { id: true },
  })

  if (relatedTags.length > 3) {
    throw new BadRequestError('标签数量超过 3 个限制', {
      data: { relatedTagNames: payload.relatedTagNames },
    })
  }

  const created = await prisma.note.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      isPublished: payload.isPublished,
      content: payload.content,
      tags: {
        connect: relatedTags.map(tag => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  })

  revalidateNotePaths(created.slug)

  return {
    message: 'Created.',
    data: created,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateNoteSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, title, slug, isPublished, relatedTagNames, content } = parseResult.data

  const existingNote = await prisma.note.findUnique({
    where: { id },
  })

  if (existingNote == null) {
    throw new BadRequestError('Note 不存在', { data: { id } })
  }

  if (slug != null) {
    const duplicatedSlugNote = await prisma.note.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    })

    if (duplicatedSlugNote != null) {
      throw new BadRequestError('该 slug 已存在', { data: { id, slug } })
    }
  }

  let noteTagsUpdate:
    | {
        set: { id: number }[]
      }
    | undefined

  if (relatedTagNames != null) {
    const relatedTags = await prisma.noteTag.findMany({
      where: {
        tagName: {
          in: relatedTagNames,
        },
      },
      select: { id: true },
    })

    if (relatedTags.length > 3) {
      throw new BadRequestError('标签数量超过 3 个限制', { data: { relatedTagNames } })
    }

    noteTagsUpdate = {
      set: relatedTags.map(tag => ({
        id: tag.id,
      })),
    }
  }

  const updated = await prisma.note.update({
    where: { id },
    data: {
      ...(title != null ? { title } : {}),
      ...(slug != null ? { slug } : {}),
      ...(isPublished != null ? { isPublished } : {}),
      ...(content != null ? { content } : {}),
      ...(noteTagsUpdate != null
        ? {
            tags: noteTagsUpdate,
          }
        : {}),
    },
    include: {
      tags: true,
    },
  })

  revalidateNotePaths(existingNote.slug, updated.slug)

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteNoteQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data
  const existingNote = await prisma.note.findUnique({
    where: {
      id,
    },
  })

  if (existingNote == null) {
    throw new BadRequestError('Note 不存在', { data: { id } })
  }

  await prisma.$transaction([
    prisma.siteComment.deleteMany({
      where: {
        targetType: 'NOTE',
        targetId: id,
      },
    }),
    prisma.note.delete({
      where: {
        id,
      },
    }),
  ])

  revalidateNotePaths(existingNote.slug)

  return {
    message: 'Deleted.',
    id,
  }
})
