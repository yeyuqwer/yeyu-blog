import type { TagOptionRecord } from './type'
import { TagType } from '@prisma/client'
import { apiRequest } from '@/lib/infra/http/ky'

export async function getNoteTags() {
  return await apiRequest<TagOptionRecord[]>({
    url: 'admin/tag',
    method: 'GET',
    searchParams: {
      tagType: TagType.NOTE,
    },
  })
}
