import { BadRequestError } from '@/lib/common/errors/request'
import { requireAdmin } from '@/lib/core/auth/guard'
import { withResponse } from '@/lib/infra/http/with-response'
import { prisma } from '@/prisma/instance'

export const GET = withResponse(
  async (_request, { params }: { params: Promise<{ slug: string }> }) => {
    await requireAdmin()

    const slug = (await params).slug

    if (slug.trim().length === 0) {
      throw new BadRequestError('Invalid slug.', { data: { slug } })
    }

    return await prisma.note.findUnique({
      where: {
        slug,
      },
      include: {
        tags: true,
      },
    })
  },
)
