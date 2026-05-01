import { MoonIcon } from '@/ui/shadcn/moon'
import { PaletteIcon } from '@/ui/shadcn/palette'
import { SunIcon } from '@/ui/shadcn/sun'
import { VolumeIcon } from '@/ui/shadcn/volume'
import { VolumeOffIcon } from '@/ui/shadcn/volume-off'

export const icons = [
  {
    id: 'tl',
    Icon: VolumeOffIcon,
    className: '-right-20 -bottom-4',
    initial: { x: -30, y: -10 },
  },
  {
    id: 'tr',
    Icon: VolumeIcon,
    className: '-top-4 -right-20',
    initial: { x: -30, y: 10 },
  },
  {
    id: 'bl',
    Icon: SunIcon,
    className: '-top-4 -left-20',
    initial: { x: 30, y: 10 },
  },
  {
    id: 'br',
    Icon: MoonIcon,
    className: '-bottom-4 -left-20',
    initial: { x: 30, y: -10 },
  },
  {
    id: 'lm',
    Icon: PaletteIcon,
    className: '-left-24 top-1/2 -translate-y-1/2',
    initial: { x: 34, y: 0 },
  },
] as const

export type IconsId = (typeof icons)[number]['id']
export type Point = { x: number; y: number }
