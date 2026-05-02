'use client'

import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps, FC } from 'react'
import type { Address } from 'viem'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { isWalletLoggedIn, signOut, useSession } from '@/lib/core'
import { cn } from '@/lib/utils/common/shadcn'
import { AccountIcon } from '@/ui/components/shared/account-icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'

const avatarPlaceholderClassName =
  'inline-flex size-8 shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.74),transparent_38%),linear-gradient(135deg,#f4f4f5,#a1a1aa)] ring-1 ring-zinc-200/80 dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(135deg,#27272a,#52525b)] dark:ring-zinc-700/80'

export const AvatarDropdownMenu: FC<ComponentProps<typeof DropdownMenuPrimitive.Root>> = props => {
  const router = useRouter()
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false)
  const { data: session, isPending } = useSession()
  const isWallet = isWalletLoggedIn({ data: session })
  const address = isWallet ? (session?.user?.name as Address) : undefined
  const formattedAddress =
    address != null ? `${address.slice(0, 4)}...${address.slice(-5)}` : undefined
  const userImage = session?.user?.image?.trim()
  const userName = session?.user?.name?.trim()
  const userEmail = session?.user?.email?.trim()

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className="flex items-center rounded-lg">
        {isPending ? (
          <span aria-hidden="true" className={cn(avatarPlaceholderClassName, 'animate-pulse')} />
        ) : isWallet ? (
          <AccountIcon account={address} className="size-8 rounded-lg" />
        ) : userImage != null && userImage.length > 0 ? (
          <span className="relative inline-flex size-8 shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700/80">
            <Image
              src={userImage}
              alt={userName || userEmail || 'avatar'}
              width={32}
              height={32}
              sizes="32px"
              onLoad={() => {
                setIsAvatarLoaded(true)
              }}
              className={cn(
                'size-full object-cover transition-[filter,opacity,transform] duration-500 ease-out',
                isAvatarLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-80 blur-sm',
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
        ) : (
          <span aria-hidden="true" className={avatarPlaceholderClassName} />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-lg">
        <DropdownMenuLabel className="flex items-center gap-2 p-2">
          {isPending ? (
            <span aria-hidden="true" className={cn(avatarPlaceholderClassName, 'animate-pulse')} />
          ) : isWallet ? (
            <AccountIcon account={address} className="size-8 rounded-lg" />
          ) : userImage != null && userImage.length > 0 ? (
            <span className="relative inline-flex size-8 shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:ring-zinc-700/80">
              <Image
                src={userImage}
                alt={userName || userEmail || 'avatar'}
                width={32}
                height={32}
                sizes="32px"
                onLoad={() => {
                  setIsAvatarLoaded(true)
                }}
                className={cn(
                  'size-full object-cover transition-[filter,opacity,transform] duration-500 ease-out',
                  isAvatarLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-80 blur-sm',
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
          ) : (
            <span aria-hidden="true" className={avatarPlaceholderClassName} />
          )}
          {isPending ? (
            <section className="min-w-0 flex-1 space-y-1">
              <span className="block h-4 w-24 animate-pulse rounded bg-muted" />
              <span className="block h-3 w-32 animate-pulse rounded bg-muted" />
            </section>
          ) : (
            <section className="min-w-0 flex-1">
              <h3 className="truncate font-medium font-mono text-sm leading-5">
                {isWallet ? formattedAddress : userName || userEmail}
              </h3>
              {(isWallet ? address : userEmail) != null ? (
                <small className="block truncate text-muted-foreground text-xs leading-4">
                  {isWallet ? address : userEmail}
                </small>
              ) : null}
            </section>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await signOut()
            router.push('/')
          }}
        >
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
