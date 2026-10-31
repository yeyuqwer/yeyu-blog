'use client'

import type { Friend } from './types'
import { ViewportRevealList } from '@/ui/components/shared/viewport-reveal-list'
import { FriendCard } from './friend-card'

export function FriendsList({ friends }: { friends: Friend[] }) {
  return (
    <ViewportRevealList interval={70}>
      <ol className="flex flex-col gap-4 md:gap-6">
        {friends.map((friend, index) => (
          <FriendCard key={friend.id} friend={friend} index={index} />
        ))}
      </ol>
    </ViewportRevealList>
  )
}
