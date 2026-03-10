import { Moon, Palette, Sun, Volume2, VolumeOff } from 'lucide-react'

export const icons = [
  {
    id: 'tl',
    Icon: VolumeOff,
    className: '-top-4 -left-20',
    initial: { x: 30, y: 10 },
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
    className: '-bottom-4 -left-20',
    initial: { x: 30, y: -10 },
  },
  {
    id: 'br',
    Icon: Moon,
    className: '-right-20 -bottom-4',
    initial: { x: -30, y: -10 },
  },
  {
    id: 'bc',
    Icon: Palette,
    className: '-bottom-20 left-0 right-0 mx-auto',
    initial: { x: 0, y: -14 },
  },
] as const

export type IconsId = (typeof icons)[number]['id']
export type Point = { x: number; y: number }
