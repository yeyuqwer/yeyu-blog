'use client'

import type { ComponentProps, FC } from 'react'
import { usePublicFriendLinkQuery } from '@/hooks/api/friend-link'
import Loading from '@/ui/components/shared/loading'
import { FriendsPlane } from './components/friends-plane'

export const FriendsPage: FC<ComponentProps<'section'>> = () => {
  const { data, isPending } = usePublicFriendLinkQuery({
    take: 100,
    skip: 0,
  })

  const friends = data?.list ?? []

  return (
    <section className="relative h-[calc(100dvh-180px)] min-h-[520px] overflow-hidden py-4">
      <div className="relative h-full w-full overflow-hidden">
        {isPending ? <Loading /> : <FriendsPlane friends={friends} />}
      </div>
    </section>
  )
}
