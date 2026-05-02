import { connection } from 'next/server'
import { getRandomPublicEcho } from '@/lib/api/echo/get-random-public-echo'
import EchoCardContent from './echo-card-content'

export default async function EchoCard() {
  await connection()

  const echo = await getRandomPublicEcho()

  if (echo == null) {
    return null
  }

  return <EchoCardContent echo={echo} />
}
