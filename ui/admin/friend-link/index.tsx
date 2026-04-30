'use client'

import type { ComponentProps, FC } from 'react'
import { FriendLinkManager } from './friend-link-manager'

export const FriendLinkPage: FC<ComponentProps<'main'>> = () => {
  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <FriendLinkManager />
    </main>
  )
}
