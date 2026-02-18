import type { TagType } from '@prisma/client'
import type { DeleteTagDTO } from './type'
import { apiRequest } from '@/lib/infra/http/ky'

export type DeleteTagResponse = {
  message: string
  id: number
  tagType: TagType
}

export async function deleteTag(params: DeleteTagDTO) {
  const { id, tagType } = params

  return await apiRequest<DeleteTagResponse>({
    url: 'admin/tag',
    method: 'DELETE',
    searchParams: {
      id: String(id),
      tagType,
    },
  })
}
