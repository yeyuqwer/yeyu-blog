import type { useSession } from './client'
import { isAddress } from 'viem'
import { clientEnv } from '@/config/env/client-env'

const ADMIN_EMAILS = clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0)

const ADMIN_WALLET_ADDRESS = clientEnv.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.trim().toLowerCase()

// * 0x42e49a294a253f38af8d690d27884d3eb8154444@http://localhost:3000
export const isWalletEmail = (email: string) => {
  const at = email.indexOf('@')
  if (at <= 0) return false
  const local = email.slice(0, at)
  return isAddress(local)
}

export const isWalletLoggedIn = ({
  data: session,
}: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && isAddress(user.name) && isWalletEmail(user.email)
}

export const isEmailLoggedIn = ({ data: session }: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && user.email !== '' && !isWalletEmail(user.email)
}

export const isAdminLoggedIn = ({ data: session }: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user

  if (user == null || user.email === '') {
    return false
  }

  if (isAddress(user.name) && ADMIN_WALLET_ADDRESS !== undefined) {
    return user.name.toLowerCase() === ADMIN_WALLET_ADDRESS
  }

  if (ADMIN_EMAILS.length > 0) {
    return ADMIN_EMAILS.includes(user.email)
  }

  return false
}
