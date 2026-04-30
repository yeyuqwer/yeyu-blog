import type { Friend, PlaneMotion, PlaneOffset, PlaneVelocity } from './types'
import { defaultPlaneMotion, planeHeight, planeLayout, planeWidth } from './constants'

export const normalizeOffset = (value: number, size: number) => {
  let nextValue = value % size

  if (nextValue > size / 2) {
    nextValue -= size
  }

  if (nextValue < -size / 2) {
    nextValue += size
  }

  return nextValue
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const getPlaneTransform = (
  { x, y }: PlaneOffset,
  motion: PlaneMotion = defaultPlaneMotion,
) =>
  `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotate(${motion.rotate}deg) scale(${motion.scale})`

export const getPlaneMotionFromVelocity = (velocity: PlaneVelocity, isDragging: boolean) => {
  const speed = Math.hypot(velocity.x, velocity.y)

  return {
    rotate: clamp(velocity.x * 2.4, -2.8, 2.8),
    scale: 1 + Math.min(speed, 1.2) * (isDragging ? 0.012 : 0.008),
  }
}

const applyPlaneItem = {
  id: 'friend-apply',
  type: 'apply',
  x: 326,
  y: 392,
  rotate: 3,
  scale: 0.94,
} as const

const wrapPlaneCoordinate = (value: number, size: number, padding: number) => {
  const contentSize = size - padding * 2
  const wrappedValue = ((((value - padding) % contentSize) + contentSize) % contentSize) + padding

  return wrappedValue
}

const getFriendLayout = (index: number) => {
  const baseLayout = planeLayout[index % planeLayout.length]
  const cycle = Math.floor(index / planeLayout.length)

  if (cycle === 0) {
    return baseLayout
  }

  return {
    x: wrapPlaneCoordinate(baseLayout.x + cycle * 113 + (index % 2) * 32, planeWidth, 64),
    y: wrapPlaneCoordinate(baseLayout.y + cycle * 71 + (index % 3) * 28, planeHeight, 64),
    rotate: clamp(baseLayout.rotate + cycle * 5 - (index % 4) * 3, -9, 9),
    scale: clamp(baseLayout.scale - cycle * 0.03, 0.84, 1.08),
  }
}

export const createPlaneItems = (friendLinks: Friend[]) => [
  ...friendLinks.map((friend, index) => ({
    ...friend,
    ...getFriendLayout(index),
    friendLinkId: friend.id,
    id: `${friend.id}-${index}`,
    type: 'friend' as const,
  })),
  applyPlaneItem,
]

export const getNormalizedPlaneOffset = (offset: PlaneOffset) => ({
  x: normalizeOffset(offset.x, planeWidth),
  y: normalizeOffset(offset.y, planeHeight),
})
