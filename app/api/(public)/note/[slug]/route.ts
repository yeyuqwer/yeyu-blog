import { BadRequestError } from '@/lib/common/errors/request'
import { processor } from '@/lib/core/markdown/processor'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'

export const GET = withResponse(
  async (_request, { params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug

    if (slug.trim().length === 0) {
      throw new BadRequestError('Invalid slug.', { data: { slug } })
    }

    const note = await prisma.note.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        tags: true,
      },
    })

    if (note == null || note.content.length === 0) {
      return null
    }

    const noteHTML = await processor.process(note.content)

    return {
      ...note,
      content: noteHTML.toString(),
    }
  },
)
