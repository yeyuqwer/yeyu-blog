import { TagType } from '@prisma/client'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import { createTagSchema, deleteTagQuerySchema, getTagsQuerySchema, updateTagSchema } from './type'

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getTagsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    tagType: request.nextUrl.searchParams.get('tagType') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, tagType } = queryResult.data
  const where = q != null && q.length > 0 ? { tagName: { contains: q } } : undefined

  if (tagType === TagType.BLOG) {
    return await prisma.blogTag.findMany({ where })
  }

  if (tagType === TagType.NOTE) {
    return await prisma.noteTag.findMany({ where })
  }

  const [blogTags, noteTags] = await Promise.all([
    prisma.blogTag.findMany({
      where,
      include: {
        _count: true,
      },
    }),
    prisma.noteTag.findMany({
      where,
      include: {
        _count: true,
      },
    }),
  ])

  const blogTagsWithCount = blogTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.BLOG,
    count: tag._count.blogs,
  }))

  const noteTagsWithCount = noteTags.map(tag => ({
    id: tag.id,
    tagName: tag.tagName,
    tagType: TagType.NOTE,
    count: tag._count.notes,
  }))

  return [...blogTagsWithCount, ...noteTagsWithCount]
})

export const POST = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = createTagSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { tagName, tagType } = parseResult.data

  const existingTag =
    tagType === TagType.BLOG
      ? await prisma.blogTag.findFirst({ where: { tagName } })
      : await prisma.noteTag.findFirst({ where: { tagName } })

  if (existingTag != null) {
    throw new BadRequestError('Tag name already exists.', { data: { tagName, tagType } })
  }

  const created =
    tagType === TagType.BLOG
      ? await prisma.blogTag.create({
          data: {
            tagName,
          },
        })
      : await prisma.noteTag.create({
          data: {
            tagName,
          },
        })

  return {
    message: 'Created.',
    data: created,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateTagSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, tagName, tagType } = parseResult.data

  const existingTag =
    tagType === TagType.BLOG
      ? await prisma.blogTag.findUnique({ where: { id } })
      : await prisma.noteTag.findUnique({ where: { id } })

  if (existingTag == null) {
    throw new BadRequestError('Tag not found.', { data: { id, tagType } })
  }

  const duplicateTag =
    tagType === TagType.BLOG
      ? await prisma.blogTag.findFirst({
          where: {
            tagName,
            NOT: { id },
          },
        })
      : await prisma.noteTag.findFirst({
          where: {
            tagName,
            NOT: { id },
          },
        })

  if (duplicateTag != null) {
    throw new BadRequestError('Tag name already exists.', { data: { id, tagName, tagType } })
  }

  const updated =
    tagType === TagType.BLOG
      ? await prisma.blogTag.update({
          where: { id },
          data: { tagName },
        })
      : await prisma.noteTag.update({
          where: { id },
          data: { tagName },
        })

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteTagQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
    tagType: request.nextUrl.searchParams.get('tagType') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id, tagType } = queryResult.data

  const existingTag =
    tagType === TagType.BLOG
      ? await prisma.blogTag.findUnique({ where: { id } })
      : await prisma.noteTag.findUnique({ where: { id } })

  if (existingTag == null) {
    throw new BadRequestError('Tag not found.', { data: { id, tagType } })
  }

  if (tagType === TagType.BLOG) {
    await prisma.blogTag.delete({ where: { id } })
  } else {
    await prisma.noteTag.delete({ where: { id } })
  }

  return {
    message: 'Deleted.',
    id,
    tagType,
  }
})
