export type Friend = {
  name: string
  description: string
  avatarUrl: string
  siteUrl: string
}

export type PlaneItemBase = {
  id: string
  x: number
  y: number
  rotate: number
  scale: number
}

export type FriendPlaneItem = Friend &
  PlaneItemBase & {
    type: 'friend'
  }

export type ApplyPlaneItem = PlaneItemBase & {
  type: 'apply'
}

export type PlaneItem = FriendPlaneItem | ApplyPlaneItem

export type PlaneOffset = {
  x: number
  y: number
}

export type PlaneMotion = {
  rotate: number
  scale: number
}

export type PlaneVelocity = {
  x: number
  y: number
}

export type PlaneCopy = {
  x: number
  y: number
}

export type PlaneItemElement = {
  element: HTMLElement
  x: number
  y: number
  baseScale: number
  scale: number
  zIndex: number
}

export type DragState = {
  isDragging: boolean
  hasMoved: boolean
  startX: number
  startY: number
  pointerX: number
  pointerY: number
  time: number
}
