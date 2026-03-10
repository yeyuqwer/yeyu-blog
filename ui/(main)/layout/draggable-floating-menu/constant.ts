import { Moon, Palette, Sun, Volume2, VolumeOff } from 'lucide-react'

export const icons = [
  {
    id: 'tl',
    Icon: VolumeOff,
    className: '-right-20 -bottom-4',
    initial: { x: -30, y: -10 },
  },
  {
    id: 'tr',
    Icon: Volume2,
    className: '-top-4 -right-20',
    initial: { x: -30, y: 10 },
  },
  {
    id: 'bl',
    Icon: Sun,
    className: '-top-4 -left-20',
    initial: { x: 30, y: 10 },
  },
  {
    id: 'br',
    Icon: Moon,
    className: '-bottom-4 -left-20',
    initial: { x: 30, y: -10 },
  },
  {
    id: 'lm',
    Icon: Palette,
    className: '-left-24 top-1/2 -translate-y-1/2',
    initial: { x: 34, y: 0 },
  },
] as const

export type IconsId = (typeof icons)[number]['id']
export type Point = { x: number; y: number }
