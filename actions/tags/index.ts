'use server'

import type { UpdateTagNameDTO } from './type'
import { TagType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/core/auth/guard'
import { prisma } from '@/prisma/instance'

export async function createBlogTag(tagName: string) {
  await requireAdmin()

  const existingTagName = await prisma.blogTag.findFirst({
    where: {
      tagName,
    },
  })

  if (existingTagName != null) {
    throw new Error('标签名已存在')
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/blog')

  return await prisma.blogTag.create({
    data: {
      tagName,
    },
  })
}

export async function createNoteTag(tagName: string) {
  await requireAdmin()

  const existingTagName = await prisma.noteTag.findFirst({
    where: {
      tagName,
    },
  })

  if (existingTagName != null) {
    throw new Error('标签名已存在')
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/note')

  return await prisma.noteTag.create({
    data: {
      tagName,
    },
  })
}

export async function deleteBlogTagById(id: number) {
  await requireAdmin()

  const tag = await prisma.blogTag.findUnique({ where: { id } })

  if (tag == null) {
    throw new Error('标签不存在')
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/blog')

  return await prisma.blogTag.delete({
    where: {
      id,
    },
  })
}

export async function deleteNoteTagById(id: number) {
  await requireAdmin()

  const tag = await prisma.noteTag.findUnique({ where: { id } })

  if (tag == null) {
    throw new Error('标签不存在')
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/note')

  return await prisma.noteTag.delete({
    where: {
      id,
    },
  })
}

export async function updateBlogTagById(values: UpdateTagNameDTO) {
  await requireAdmin()

  const { id, tagName } = values

  const existingTag = await prisma.blogTag.findFirst({
    where: {
      tagName,
      NOT: {
        id,
      },
    },
  })

  if (existingTag != null) {
    throw new Error(`标签名 "${tagName}" 已存在`)
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/blog')

  return await prisma.blogTag.update({
    where: {
      id,
    },
    data: {
      tagName,
    },
  })
}

export async function updateNoteTagById(values: UpdateTagNameDTO) {
  await requireAdmin()

  const { id, tagName } = values

  const existingTag = await prisma.noteTag.findFirst({
    where: {
      tagName,
      NOT: {
        id,
      },
    },
  })

  if (existingTag != null) {
    throw new Error(`标签名 "${tagName}" 已存在`)
  }

  revalidatePath('/admin/tag')
  revalidatePath('/admin/note')

  return await prisma.noteTag.update({
    where: {
      id,
    },
    data: {
      tagName,
    },
  })
}

export async function getBlogTags() {
  return await prisma.blogTag.findMany()
}

export async function getNoteTags() {
  return await prisma.noteTag.findMany()
}

export async function getAllTags() {
  const [blogTags, noteTags] = await Promise.all([
    prisma.blogTag.findMany({
      include: {
        _count: true,
      },
    }),
    prisma.noteTag.findMany({
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
}

export async function getQueryTags(tagName: string) {
  const [blogTags, noteTags] = await Promise.all([
    prisma.blogTag.findMany({
      where: {
        tagName: {
          contains: tagName,
        },
      },
      include: {
        _count: true,
      },
    }),
    prisma.noteTag.findMany({
      where: {
        tagName: {
          contains: tagName,
        },
      },
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
}
