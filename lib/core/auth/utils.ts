import type { useSession } from './client'
import { clientEnv } from '@/config/env/client-env'

const ethereumAddressRegExp = /^0x[a-fA-F0-9]{40}$/

const adminEmails = clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.split(',')
  .map(email => email.trim())
  .map(email => email.toLowerCase())
  .filter(email => email.length > 0)

const adminWalletAddress = clientEnv.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.trim().toLowerCase()

const isEthereumAddress = (value?: string | null) =>
  value !== null && value !== undefined && ethereumAddressRegExp.test(value)

// * 0x42e49a294a253f38af8d690d27884d3eb8154444@http://localhost:3000
export const isWalletEmail = (email: string) => {
  const at = email.indexOf('@')
  if (at <= 0) return false
  const local = email.slice(0, at)
  return isEthereumAddress(local)
}

export const isWalletLoggedIn = ({
  data: session,
}: Pick<ReturnType<typeof useSession>, 'data'>) => {
  const user = session?.user
  return user != null && isEthereumAddress(user.name) && isWalletEmail(user.email)
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

  if (isEthereumAddress(user.name) && adminWalletAddress !== undefined) {
    return user.name.toLowerCase() === adminWalletAddress
  }

  if (adminEmails.length > 0) {
    return adminEmails.includes(user.email.toLowerCase())
  }

  return false
}
