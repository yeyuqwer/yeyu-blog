export type Friend = {
  id: number
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

export type FriendPlaneItem = Omit<Friend, 'id'> &
  PlaneItemBase & {
    friendLinkId: number
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

export type PlaneSize = {
  width: number
  height: number
}

export type PlaneItemElement = {
  element: HTMLElement
  x: number
  y: number
  renderedX: number
  renderedY: number
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
