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

    const blog = await prisma.blog.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        tags: true,
      },
    })

    if (blog == null || blog.content.length === 0) {
      return null
    }

    const blogHTML = await processor.process(blog.content)

    return {
      ...blog,
      content: blogHTML.toString(),
    }
  },
)
