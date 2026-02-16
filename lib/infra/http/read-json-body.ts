import { BadRequestError } from '@/lib/common/errors/request'

export async function readJsonBody(request: Request) {
  try {
    return await request.json()
  } catch {
    throw new BadRequestError('Request body must be valid JSON.')
  }
}
