'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getPublicEchos } from '@/lib/api/echo/get-public-echos'
import { useHomeEchoStore } from '@/store/use-home-echo-store'
import EchoCardContent, { type EchoCardViewData } from './echo-card-content'

export default function EchoCard() {
  const initialEcho = useHomeEchoStore(state => state.initialEcho)
  const setInitialEcho = useHomeEchoStore(state => state.setInitialEcho)

  const randomEchoQuery = useQuery({
    queryKey: ['home-random-echo'],
    queryFn: async (): Promise<EchoCardViewData> => {
      const result = await getPublicEchos()

      if (result === null) {
        return null
      }

      return {
        id: result.id,
        content: result.content,
        reference: result.reference,
      }
    },
    enabled: initialEcho === undefined,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    if (initialEcho === undefined && randomEchoQuery.status === 'success') {
      setInitialEcho(randomEchoQuery.data)
    }
  }, [initialEcho, randomEchoQuery.status, randomEchoQuery.data, setInitialEcho])

  const displayEcho = initialEcho ?? randomEchoQuery.data ?? null

  return <EchoCardContent echo={displayEcho} />
}
