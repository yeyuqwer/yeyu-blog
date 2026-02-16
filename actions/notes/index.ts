'use server'

import type {
  ArticleDTO,
  UpdateArticleDTO,
} from '@/ui/admin/components/admin-article-edit-page/type'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/core/auth/guard'
import { processor } from '@/lib/core/markdown'
import { prisma } from '@/prisma/instance'

export async function createNote(values: ArticleDTO) {
  await requireAdmin()

  const existingNote = await prisma.note.findUnique({
    where: { slug: values.slug },
  })

  if (existingNote != null) {
    throw new Error('该 slug 已存在')
  }

  const relatedTags = await prisma.noteTag.findMany({
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

  revalidatePath('/note')
  revalidatePath('/admin/note')

  return await prisma.note.create({
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

export async function deleteNoteById(noteId: number) {
  await requireAdmin()

  revalidatePath('/note')
  revalidatePath('/admin/note')

  return prisma.note.delete({
    where: {
      id: noteId,
    },
  })
}

export async function toggleNotePublishedById(id: number, newIsPublishedStatus: boolean) {
  await requireAdmin()

  revalidatePath('/note')
  revalidatePath('/admin/note')

  return await prisma.note.update({
    where: {
      id,
    },
    data: {
      isPublished: newIsPublishedStatus,
    },
  })
}

export async function updateNoteById(values: UpdateArticleDTO) {
  await requireAdmin()

  const [existingNote, relatedTags, currentTags] = await Promise.all([
    prisma.note.findUnique({
      where: {
        slug: values.slug,
        NOT: {
          id: values.id,
        },
      },
    }),
    prisma.noteTag.findMany({
      where: {
        tagName: {
          in: values.relatedTagNames,
        },
      },
      select: {
        id: true,
      },
    }),
    prisma.note.findUnique({
      where: { id: values.id },
      select: {
        tags: {
          select: { id: true },
        },
      },
    }),
  ])

  if (existingNote != null) {
    throw new Error('该 slug 已存在')
  }

  if (relatedTags.length > 3) {
    throw new Error('标签数量超过 3 个限制')
  }

  if (currentTags == null) {
    throw new Error('Note 不存在')
  }

  const currentTagIds = currentTags.tags.map(tag => tag.id)
  const newTagIds = relatedTags.map(tag => tag.id)

  const tagsToDisconnect = currentTagIds
    .filter(tagId => !newTagIds.includes(tagId))
    .map(tagId => ({ id: tagId }))

  const tagsToConnect = newTagIds
    .filter(tagId => !currentTagIds.includes(tagId))
    .map(tagId => ({ id: tagId }))

  await prisma.note.update({
    where: { id: values.id },
    data: {
      tags: {
        disconnect: tagsToDisconnect,
        connect: tagsToConnect,
      },
    },
  })

  revalidatePath('/note')
  revalidatePath('/admin/note')

  return await prisma.note.update({
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

export async function getQueryNotes(noteTitle: string) {
  return await prisma.note.findMany({
    where: {
      title: {
        contains: noteTitle,
      },
    },
    include: {
      tags: true,
    },
  })
}

export async function getNoteList() {
  return await prisma.note.findMany({
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

export async function getNotesBySelectedTagName(tagNamesArray: string[]) {
  const notes = await prisma.note.findMany({
    where: {
      AND: [
        {
          tags: {
            some: {
              tagName: {
                in: tagNamesArray,
              },
            },
          },
        },
      ],
    },
    include: {
      tags: true,
    },
  })

  return notes.filter(note => {
    const noteTagNames = note.tags.map(tagOnNote => tagOnNote.tagName)
    return tagNamesArray.every(tag => noteTagNames.includes(tag)) // 选中的标签必须都在笔记的标签中
  })
}

export async function getAllShowNotes() {
  return await prisma.note.findMany({
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

export async function getRawNoteBySlug(slug: string) {
  return await prisma.note.findUnique({
    where: {
      slug,
    },
    include: {
      tags: true,
    },
  })
}

export async function getPublishedNoteHTMLBySlug(slug: string) {
  const note = await prisma.note.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      tags: true,
    },
  })
  if (note == null || note.content.length === 0) return null

  const noteHTML = await processor.process(note.content)

  return {
    ...note,
    content: noteHTML.toString(),
  }
}
