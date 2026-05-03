'use client'

import { useQuery } from '@tanstack/react-query'
import { getPublicEcho } from '@/lib/api/echo/get-public-echo'
import EchoCardContent from './echo-card-content'

export default function EchoCard() {
  const { data } = useQuery({
    queryKey: ['echo', 'random'],
    queryFn: getPublicEcho,
    staleTime: Infinity,
  })

  if (data == null) return null

  return <EchoCardContent echo={data} />
}
