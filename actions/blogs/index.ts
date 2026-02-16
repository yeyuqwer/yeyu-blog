'use server'

import type {
  ArticleDTO,
  UpdateArticleDTO,
} from '@/ui/admin/components/admin-article-edit-page/type'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/core/auth/guard'
import { processor } from '@/lib/core/markdown'
import { prisma } from '@/prisma/instance'

export async function createBlog(values: ArticleDTO) {
  await requireAdmin()

  const existingBlog = await prisma.blog.findUnique({
    where: { slug: values.slug },
  })

  if (existingBlog != null) {
    throw new Error('该 slug 已存在')
  }

  const relatedTags = await prisma.blogTag.findMany({
    where: {
      tagName: {
        in: values.relatedTagNames,
      },
    },
    select: { id: true },
  })

  if (relatedTags.length > 3) {
    throw new Error('标签数量超过 3 个限制')
  }

  revalidatePath('/blog')
  revalidatePath('/admin/blog')

  return await prisma.blog.create({
    data: {
      title: values.title,
      slug: values.slug,
      isPublished: values.isPublished,
      content: values.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: {
        connect: relatedTags.map(tag => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  })
}

export async function deleteBlogById(blogId: number) {
  await requireAdmin()

  revalidatePath('/blog')
  revalidatePath('/admin/blog')

  return prisma.blog.delete({
    where: {
      id: blogId,
    },
  })
}

export async function toggleBlogPublishedById(id: number, newIsPublishedStatus: boolean) {
  await requireAdmin()

  revalidatePath('/blog')
  revalidatePath('/admin/blog')

  return await prisma.blog.update({
    where: {
      id,
    },
    data: {
      isPublished: newIsPublishedStatus,
    },
  })
}

export async function updateBlogById(values: UpdateArticleDTO) {
  await requireAdmin()

  const [existingBlog, relatedTags, currentTags] = await Promise.all([
    prisma.blog.findUnique({
      where: {
        slug: values.slug,
        NOT: {
          id: values.id,
        },
      },
    }),
    prisma.blogTag.findMany({
      where: {
        tagName: {
          in: values.relatedTagNames,
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.blog.findUnique({
      where: { id: values.id },
      select: {
        tags: {
          select: { id: true },
        },
      },
    }),
  ])

  if (existingBlog != null) {
    throw new Error('该 slug 已存在')
  }

  if (relatedTags.length > 3) {
    throw new Error('标签数量超过 3 个限制')
  }

  if (currentTags == null) {
    throw new Error('Blog 不存在')
  }

  const currentTagIds = currentTags.tags.map(tag => tag.id)
  const newTagIds = relatedTags.map(tag => tag.id)

  const tagsToDisconnect = currentTagIds
    .filter(tagId => !newTagIds.includes(tagId))
    .map(tagId => ({ id: tagId }))

  const tagsToConnect = newTagIds
    .filter(tagId => !currentTagIds.includes(tagId))
    .map(tagId => ({ id: tagId }))

  await prisma.blog.update({
    where: { id: values.id },
    data: {
      tags: {
        disconnect: tagsToDisconnect,
        connect: tagsToConnect,
      },
    },
  })

  revalidatePath('/blog')
  revalidatePath('/admin/blog')

  return await prisma.blog.update({
    where: {
      id: values.id,
    },
    data: {
      title: values.title,
      slug: values.slug,
      isPublished: values.isPublished,
      updatedAt: new Date(),
      content: values.content,
    },
    include: {
      tags: true,
    },
  })
}

export async function getQueryBlog(blogTitle: string) {
  return await prisma.blog.findMany({
    where: {
      title: {
        contains: blogTitle,
      },
    },
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
}

export async function getBlogList() {
  return await prisma.blog.findMany({
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
}

export async function getBlogsBySelectedTagName(tagNamesArray: string[]) {
  const blogs = await prisma.blog.findMany({
    where: {
      AND: [
        {
          tags: {
            some: {
              tagName: { in: tagNamesArray },
            },
          },
        },
      ],
    },
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

  return blogs.filter(blog => {
    const blogTagNames = blog.tags.map(tagOnBlog => tagOnBlog.tagName)
    return tagNamesArray.every(tag => blogTagNames.includes(tag))
  })
}

export async function getAllShowBlogs() {
  return await prisma.blog.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
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
}

export async function getRawBlogBySlug(slug: string) {
  return await prisma.blog.findUnique({
    where: {
      slug,
    },
    include: {
      tags: true,
    },
  })
}

export async function getPublishedBlogHTMLBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })
  if (blog == null || blog.content.length === 0) return null

  const blogHTML = await processor.process(blog.content)

  return {
    ...blog,
    content: blogHTML.toString(),
  }
}
