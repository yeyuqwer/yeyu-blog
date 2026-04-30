'use client'

import type { CSSProperties } from 'react'
import type { Friend } from '../types'
import { cn } from '@/lib/utils/common/shadcn'
import { planeCopies, planeHeight, planeWidth } from '../constants'
import { useFriendsPlaneController } from '../hooks/use-friends-plane-controller'
import { getPlaneTransform } from '../utils'
import { FriendAvatarItem } from './friend-avatar-item'
import { FriendsPlaneStyle } from './friends-plane-style'

type FriendsPlaneProps = {
  friends: Friend[]
}

export function FriendsPlane({ friends }: FriendsPlaneProps) {
  const {
    handleFriendClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    offsetRef,
    planeItems,
    planeRef,
    setPlaneItemRef,
    stageRef,
  } = useFriendsPlaneController(friends)

  return (
    <>
      <FriendsPlaneStyle />

      <div
        ref={stageRef}
        className={cn(
          'friends-plane-stage friends-plane-mask absolute inset-0 cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing',
          '[--friend-tile-size:clamp(58px,10vmin,104px)]',
        )}
        data-dragging="false"
        data-moving="false"
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={planeRef}
          className="absolute top-1/2 left-1/2"
          style={
            {
              width: `${planeWidth}px`,
              height: `${planeHeight}px`,
              transform: getPlaneTransform(offsetRef.current),
            } as CSSProperties
          }
        >
          {planeCopies.flatMap(copy =>
            planeItems.map(item => (
              <FriendAvatarItem
                key={`${copy.x}-${copy.y}-${item.id}`}
                item={item}
                copy={copy}
                onClick={handleFriendClick}
                setItemRef={setPlaneItemRef}
              />
            )),
          )}
        </div>
      </div>
    </>
  )
}
