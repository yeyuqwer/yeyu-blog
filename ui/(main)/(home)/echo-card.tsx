'use client'

import { useQuery } from '@tanstack/react-query'
import { getPublicEcho } from '@/lib/api/echo/get-public-echo'
import EchoCardContent from './echo-card-content'

export default function EchoCard() {
  const { data } = useQuery({
    queryKey: ['home-random-echo'],
    queryFn: getPublicEcho,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  })

  return <EchoCardContent echo={data} />
}
