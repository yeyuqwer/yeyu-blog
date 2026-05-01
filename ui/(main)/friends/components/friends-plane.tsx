'use client'

import type { CSSProperties } from 'react'
import type { Friend } from '../types'
import { cn } from '@/lib/utils/common/shadcn'
import { planeHeight, planeWidth } from '../constants'
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
          '[--friend-plane-card-highlight:rgba(255,255,255,0.84)] [--friend-plane-card:rgba(255,255,255,0.76)]',
          '[--friend-plane-border:color-mix(in_srgb,var(--theme-border)_74%,white_26%)] [--friend-plane-hover-border:color-mix(in_srgb,var(--theme-indicator)_28%,white_46%)]',
          '[--friend-plane-avatar-bg:color-mix(in_srgb,var(--theme-muted)_35%,white_65%)] [--friend-plane-inner-border:color-mix(in_srgb,var(--theme-muted)_78%,white_22%)]',
          '[--friend-plane-icon:var(--theme-indicator)] [--friend-plane-muted-text:var(--theme-muted-foreground)] [--friend-plane-text:var(--theme-primary)]',
          '[--friend-plane-shadow:0_14px_34px_rgba(24,24,27,0.12)]',
          'dark:[--friend-plane-card-highlight:rgba(18,18,21,0.8)] dark:[--friend-plane-card:rgba(9,9,11,0.72)]',
          'dark:[--friend-plane-border:rgba(255,255,255,0.12)] dark:[--friend-plane-hover-border:color-mix(in_srgb,var(--theme-400)_26%,white_14%)]',
          'dark:[--friend-plane-avatar-bg:rgba(255,255,255,0.06)] dark:[--friend-plane-inner-border:rgba(255,255,255,0.16)]',
          'dark:[--friend-plane-icon:color-mix(in_srgb,var(--theme-400)_62%,white_18%)] dark:[--friend-plane-muted-text:rgba(212,212,216,0.72)] dark:[--friend-plane-text:rgba(244,244,245,0.96)]',
          'dark:[--friend-plane-shadow:0_18px_48px_rgba(0,0,0,0.48)]',
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
              transform: getPlaneTransform({ x: 0, y: 0 }),
            } as CSSProperties
          }
        >
          {planeItems.map(item => (
            <FriendAvatarItem
              key={item.id}
              item={item}
              onClick={handleFriendClick}
              setItemRef={setPlaneItemRef}
            />
          ))}
        </div>
      </div>
    </>
  )
}
