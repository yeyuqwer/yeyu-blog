import type { QueryClient, QueryKey } from '@tanstack/react-query'

export function getCachedPaginatedQueryData<TData>(
  queryClient: QueryClient,
  {
    queryKey,
    skip,
    take,
  }: {
    queryKey: QueryKey
    skip: number
    take: number
  },
) {
  const cachedQueries = queryClient.getQueriesData<{
    list: TData[]
    total: number
    take: number
    skip: number
  }>({ queryKey })
  const targetStart = skip

  for (const [cachedQueryKey, cachedData] of cachedQueries) {
    if (cachedData == null) {
      continue
    }

    const cachedStart = cachedData.skip
    const cachedEnd = cachedData.skip + cachedData.list.length
    const targetEnd = Math.min(skip + take, cachedData.total)

    if (cachedStart > targetStart || cachedEnd < targetEnd) {
      continue
    }

    const offset = targetStart - cachedStart

    return {
      data: {
        ...cachedData,
        list: cachedData.list.slice(offset, offset + take),
        skip,
        take,
      },
      updatedAt: queryClient.getQueryState(cachedQueryKey)?.dataUpdatedAt,
    }
  }

  return undefined
}
