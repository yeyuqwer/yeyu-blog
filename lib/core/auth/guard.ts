import { headers } from 'next/headers'
import { isAddress } from 'viem'
import { auth } from '@/auth'
import { clientEnv } from '@/config/env/client-env'
import { BadRequestError } from '@/lib/common/errors/request'

const ADMIN_EMAILS = clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0)

const ADMIN_WALLET_ADDRESS = clientEnv.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.trim().toLowerCase()

const isAdminWalletAddress = (walletAddress?: string | null) =>
  walletAddress !== null &&
  walletAddress !== undefined &&
  ADMIN_WALLET_ADDRESS !== undefined &&
  walletAddress.toLowerCase() === ADMIN_WALLET_ADDRESS

const isWalletEmail = (email: string) => {
  const at = email.indexOf('@')
  if (at <= 0) return false
  const local = email.slice(0, at)
  return isAddress(local)
}

export const isWalletSessionUser = (
  user?: { name?: string | null; email?: string | null } | null,
) => user != null && user.email != null && isAddress(user.name ?? '') && isWalletEmail(user.email)

export const isAdminUser = (user?: { name?: string | null; email?: string | null } | null) => {
  if (user?.email == null) {
    return false
  }

  if (isWalletSessionUser(user) && ADMIN_WALLET_ADDRESS !== undefined) {
    return isAdminWalletAddress(user.name)
  }

  if (ADMIN_EMAILS.length > 0) {
    return ADMIN_EMAILS.includes(user.email)
  }

  return false
}

export const noPermission = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    return true
  }

  return !isAdminUser(session.user)
}

export const requireAdmin = async () => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }
}

export type SessionUser = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>['user']

export const requireSignedInUser = async (): Promise<SessionUser> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    throw new BadRequestError('Please login first.')
  }

  return session.user
}
