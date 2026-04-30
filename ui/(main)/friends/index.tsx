'use client'

import type { ComponentProps, FC } from 'react'
import { FriendsPlane } from './components/friends-plane'

export const FriendsPage: FC<ComponentProps<'section'>> = () => {
  return (
    <section className="relative h-[calc(100dvh-180px)] min-h-[520px] overflow-hidden py-4">
      <div className="relative h-full w-full overflow-hidden">
        <FriendsPlane />
      </div>
    </section>
  )
}
