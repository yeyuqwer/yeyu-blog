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

export const noPermission = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user?.id == null || session.user.email == null) {
    return true
  }

  // * 这里设计的其实不太合理，之后得想办法不使用 better auth
  // * 😭 回来吧 authjs
  // * 😭 我最骄傲的信仰
  // * 😭 历历在目的登录
  // * 😭 眼泪莫名在流淌
  // * 😭 一直记得 session
  // * 😭 还有给我的 callback
  // * 😭 把我 bug 都给挡住
  // * 😭 就算通宵也不慌 (写于 26.1.22 23:01)
  if (isAddress(session.user.name) && ADMIN_WALLET_ADDRESS !== undefined) {
    return !isAdminWalletAddress(session.user.name)
  }

  // * 检查邮箱是否在管理员邮箱列表中
  const email = session.user.email

  if (ADMIN_EMAILS.length > 0) {
    return !ADMIN_EMAILS.includes(email)
  }

  return true
}

export const requireAdmin = async () => {
  if (await noPermission()) {
    throw new BadRequestError('Insufficient permissions.')
  }
}
