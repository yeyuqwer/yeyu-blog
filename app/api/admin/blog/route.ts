import { revalidatePath } from 'next/cache'
import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { readJsonBody } from '@/lib/infra/http/read-json-body'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'
import {
  createBlogSchema,
  deleteBlogQuerySchema,
  getBlogsQuerySchema,
  updateBlogSchema,
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

function revalidateBlogPaths(...slugs: Array<string | undefined>) {
  revalidatePath('/blog')
  revalidatePath('/admin/blog')

  const uniqueSlugs = new Set(
    slugs
      .map(slug => slug?.trim())
      .filter((slug): slug is string => slug != null && slug.length > 0),
  )

  for (const slug of uniqueSlugs) {
    revalidatePath(`/blog/${encodeURIComponent(slug)}`)
  }
}

export const GET = withResponse(async request => {
  await requireAdmin()

  const queryResult = getBlogsQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
    tagNames: request.nextUrl.searchParams.get('tagNames') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q, tagNames: rawTagNames } = queryResult.data
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

  return await prisma.blog.findMany({
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
  })
})

export const POST = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = createBlogSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const payload = parseResult.data

  const existingBlog = await prisma.blog.findUnique({
    where: { slug: payload.slug },
  })

  if (existingBlog != null) {
    throw new BadRequestError('该 slug 已存在', { data: { slug: payload.slug } })
  }

  const relatedTags = await prisma.blogTag.findMany({
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

  const created = await prisma.blog.create({
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

  revalidateBlogPaths(created.slug)

  return {
    message: 'Created.',
    data: created,
  }
})

export const PATCH = withResponse(async request => {
  await requireAdmin()

  const body = await readJsonBody(request)
  const parseResult = updateBlogSchema.safeParse(body)

  if (!parseResult.success) {
    throw new BadRequestError('Invalid request body.', { data: parseResult.error.flatten() })
  }

  const { id, title, slug, isPublished, relatedTagNames, content } = parseResult.data

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  })

  if (existingBlog == null) {
    throw new BadRequestError('Blog 不存在', { data: { id } })
  }

  if (slug != null) {
    const duplicatedSlugBlog = await prisma.blog.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    })

    if (duplicatedSlugBlog != null) {
      throw new BadRequestError('该 slug 已存在', { data: { id, slug } })
    }
  }

  let blogTagsUpdate:
    | {
        set: { id: number }[]
      }
    | undefined

  if (relatedTagNames != null) {
    const relatedTags = await prisma.blogTag.findMany({
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

    blogTagsUpdate = {
      set: relatedTags.map(tag => ({
        id: tag.id,
      })),
    }
  }

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      ...(title != null ? { title } : {}),
      ...(slug != null ? { slug } : {}),
      ...(isPublished != null ? { isPublished } : {}),
      ...(content != null ? { content } : {}),
      ...(blogTagsUpdate != null
        ? {
            tags: blogTagsUpdate,
          }
        : {}),
    },
    include: {
      tags: true,
    },
  })

  revalidateBlogPaths(existingBlog.slug, updated.slug)

  return {
    message: 'Updated.',
    data: updated,
  }
})

export const DELETE = withResponse(async request => {
  await requireAdmin()

  const queryResult = deleteBlogQuerySchema.safeParse({
    id: request.nextUrl.searchParams.get('id') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { id } = queryResult.data
  const existingBlog = await prisma.blog.findUnique({
    where: {
      id,
    },
  })

  if (existingBlog == null) {
    throw new BadRequestError('Blog 不存在', { data: { id } })
  }

  await prisma.$transaction([
    prisma.siteComment.deleteMany({
      where: {
        targetType: 'BLOG',
        targetId: id,
      },
    }),
    prisma.blog.delete({
      where: {
        id,
      },
    }),
  ])

  revalidateBlogPaths(existingBlog.slug)

  return {
    message: 'Deleted.',
    id,
  }
})
