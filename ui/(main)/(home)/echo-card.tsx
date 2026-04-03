'use client'

import { useQuery } from '@tanstack/react-query'
import { getPublicEcho } from '@/lib/api/echo/get-public-echo'
import EchoCardContent from './echo-card-content'

const HOME_RANDOM_ECHO_QUERY_KEY = ['home-random-echo']

export default function EchoCard() {
  const randomEchoQuery = useQuery({
    queryKey: HOME_RANDOM_ECHO_QUERY_KEY,
    queryFn: getPublicEcho,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
  })

  return <EchoCardContent echo={randomEchoQuery.data ?? null} />
}
