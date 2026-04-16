import { getRandomPublicEcho } from '@/lib/api/echo/get-random-public-echo'
import { BadRequestError } from '@/lib/common/errors/request'
import { withResponse } from '@/lib/infra/http/with-response'
import { getPublicEchosQuerySchema } from './type'

export const GET = withResponse(async request => {
  const queryResult = getPublicEchosQuerySchema.safeParse({
    q: request.nextUrl.searchParams.get('q') ?? undefined,
  })

  if (!queryResult.success) {
    throw new BadRequestError('Invalid query parameters.', { data: queryResult.error.flatten() })
  }

  const { q } = queryResult.data

  return await getRandomPublicEcho({ q })
})
