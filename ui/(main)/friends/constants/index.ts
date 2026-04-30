import type { PlaneMotion } from '../types'

export const planeWidth = 720

export const planeHeight = 480

export const dragClickDelay = 160

export const centerFocusScale = 0.38

export const momentumStopSpeed = 0.012

export const dragVelocitySmoothing = 0.18

export const defaultPlaneMotion: PlaneMotion = {
  rotate: 0,
  scale: 1,
}

export const planeLayout = [
  { x: 88, y: 96, rotate: -8, scale: 1 },
  { x: 282, y: 72, rotate: 5, scale: 0.92 },
  { x: 510, y: 122, rotate: -3, scale: 1.06 },
  { x: 164, y: 288, rotate: 7, scale: 0.96 },
  { x: 398, y: 264, rotate: -6, scale: 1 },
  { x: 604, y: 346, rotate: 4, scale: 0.9 },
]

export const planeCopies = [-1, 0, 1].flatMap(copyY =>
  [-1, 0, 1].map(copyX => ({
    x: copyX,
    y: copyY,
  })),
)
