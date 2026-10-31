'use client'

import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut, useSession } from '@/lib/core/auth/client'
import { isWalletLoggedIn } from '@/lib/core/auth/utils'
import { cn } from '@/lib/utils/common/shadcn'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'

function SessionAvatar({
  address,
  isAvatarLoaded,
  isPending,
  isWallet,
  userEmail,
  userImage,
  userName,
  onLoad,
}: {
  address?: Address
  isAvatarLoaded: boolean
  isPending: boolean
  isWallet: boolean
  userEmail?: string
  userImage?: string
  userName?: string
  onLoad: () => void
}) {
  if (isPending) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 animate-pulse overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.74),transparent_38%),linear-gradient(135deg,#f4f4f5,#a1a1aa)] ring-1 ring-zinc-200/80 dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#27272a,#52525b)] dark:ring-zinc-700/80"
      />
    )
  }

  if (isWallet) return <AccountIcon account={address} className="size-8 rounded-lg" />

  if (userImage != null && userImage.length > 0) {
    return (
      <span className="relative inline-flex size-8 shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700/80">
        <Image
          src={userImage}
          alt={userName || userEmail || 'avatar'}
          width={32}
          height={32}
          sizes="32px"
          onLoad={onLoad}
          className={cn(
            'size-full object-cover transition-[filter,opacity,transform] duration-500 ease-out',
            isAvatarLoaded ? 'blur-0 scale-100 opacity-100' : 'scale-105 opacity-80 blur-sm',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.74),transparent_38%),linear-gradient(135deg,#f4f4f5,#a1a1aa)] transition-opacity duration-500 dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#27272a,#52525b)]',
            isAvatarLoaded ? 'opacity-0' : 'animate-pulse opacity-100',
          )}
        />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.74),transparent_38%),linear-gradient(135deg,#f4f4f5,#a1a1aa)] ring-1 ring-zinc-200/80 dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#27272a,#52525b)] dark:ring-zinc-700/80"
    />
  )
}

function SessionSummary({
  address,
  formattedAddress,
  isPending,
  isWallet,
  userEmail,
  userName,
}: {
  address?: Address
  formattedAddress?: string
  isPending: boolean
  isWallet: boolean
  userEmail?: string
  userName?: string
}) {
  if (isPending) {
    return (
      <section className="min-w-0 flex-1 space-y-1">
        <span className="bg-muted block h-4 w-24 animate-pulse rounded" />
        <span className="bg-muted block h-3 w-32 animate-pulse rounded" />
      </section>
    )
  }

  const detail = isWallet ? address : userEmail

  return (
    <section className="min-w-0 flex-1">
      <h3 className="truncate font-mono text-sm leading-5 font-medium">
        {isWallet ? formattedAddress : userName || userEmail}
      </h3>
      {detail != null ? (
        <small className="text-muted-foreground block truncate text-xs leading-4">{detail}</small>
      ) : null}
    </section>
  )
}

export const AvatarDropdownMenu: FC<ComponentProps<typeof DropdownMenu>> = props => {
  const { push } = useRouter()
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false)
  const { data: session, isPending } = useSession()
  const isWallet = isWalletLoggedIn({ data: session })
  const address = isWallet ? (session?.user?.name as Address) : undefined
  const formattedAddress =
    address != null ? `${address.slice(0, 4)}...${address.slice(-5)}` : undefined
  const userImage = session?.user?.image?.trim()
  const userName = session?.user?.name?.trim()
  const userEmail = session?.user?.email?.trim()
  const handleAvatarLoad = () => {
    setIsAvatarLoaded(true)
  }

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className="flex items-center rounded-lg">
        <SessionAvatar
          address={address}
          isAvatarLoaded={isAvatarLoaded}
          isPending={isPending}
          isWallet={isWallet}
          userEmail={userEmail}
          userImage={userImage}
          userName={userName}
          onLoad={handleAvatarLoad}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-lg">
        <div className="flex items-center gap-2 p-2">
          <SessionAvatar
            address={address}
            isAvatarLoaded={isAvatarLoaded}
            isPending={isPending}
            isWallet={isWallet}
            userEmail={userEmail}
            userImage={userImage}
            userName={userName}
            onLoad={handleAvatarLoad}
          />
          <SessionSummary
            address={address}
            formattedAddress={formattedAddress}
            isPending={isPending}
            isWallet={isWallet}
            userEmail={userEmail}
            userName={userName}
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await signOut()
            push('/')
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
