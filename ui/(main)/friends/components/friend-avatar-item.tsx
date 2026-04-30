import type { CSSProperties, MouseEvent } from 'react'
import type { PlaneCopy, PlaneItem } from '../types'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { planeHeight, planeWidth } from '../constants'

type FriendAvatarItemProps = {
  item: PlaneItem
  copy: PlaneCopy
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void
  setItemRef: (key: string, element: HTMLElement | null, item: PlaneItem, copy: PlaneCopy) => void
}

const getItemIntroOffset = (item: PlaneItem, copy: PlaneCopy) => {
  const x = item.x + copy.x * planeWidth - planeWidth / 2
  const y = item.y + copy.y * planeHeight - planeHeight / 2
  const distance = Math.max(Math.hypot(x, y), 1)

  return {
    x: (x / distance) * 220,
    y: (y / distance) * 220,
  }
}

const getItemIntroDelay = (item: PlaneItem, copy: PlaneCopy) => {
  const copyDistance = Math.abs(copy.x) + Math.abs(copy.y)
  const itemDistance = Math.hypot(item.x - planeWidth / 2, item.y - planeHeight / 2)

  return copyDistance * 80 + itemDistance * 0.18
}

const getItemStyle = (item: PlaneItem, copy: PlaneCopy) => {
  const introOffset = getItemIntroOffset(item, copy)

  return {
    left: `${item.x + copy.x * planeWidth}px`,
    top: `${item.y + copy.y * planeHeight}px`,
    '--item-rotate': `${item.rotate}deg`,
    '--item-scale': item.scale,
    '--friend-intro-x': `${introOffset.x}px`,
    '--friend-intro-y': `${introOffset.y}px`,
    '--friend-intro-delay': `${getItemIntroDelay(item, copy)}ms`,
    transform: `translate(-50%, -50%) rotate(var(--item-rotate)) scale(var(--item-scale))`,
  } as CSSProperties
}

export function FriendAvatarItem({ item, copy, onClick, setItemRef }: FriendAvatarItemProps) {
  const itemKey = `${copy.x}-${copy.y}-${item.id}`

  if (item.type === 'apply') {
    return (
      <div
        ref={element => setItemRef(itemKey, element, item, copy)}
        className="friend-plane-item group hover:!z-[200] focus-within:!z-[200] absolute will-change-transform [height:var(--friend-tile-size)] [width:var(--friend-tile-size)]"
        style={getItemStyle(item, copy)}
      >
        <button
          type="button"
          tabIndex={copy.x === 0 && copy.y === 0 ? 0 : -1}
          aria-label={item.description}
          className="grid size-full cursor-pointer place-items-center rounded-full border border-theme-muted/70 p-1.5 shadow-md transition-[filter,border-color] duration-200 hover:border-theme-indicator/35 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-theme-ring"
        >
          <span className="grid size-full place-items-center rounded-full border border-theme-muted/80 border-dashed text-theme-indicator">
            <Plus className="size-1/2" strokeWidth={1.8} />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div
      ref={element => setItemRef(itemKey, element, item, copy)}
      className="friend-plane-item group hover:!z-[200] focus-within:!z-[200] absolute will-change-transform [height:var(--friend-tile-size)] [width:var(--friend-tile-size)]"
      style={getItemStyle(item, copy)}
    >
      <Link
        href={item.siteUrl}
        target="_blank"
        rel="noreferrer"
        tabIndex={copy.x === 0 && copy.y === 0 ? 0 : -1}
        aria-label={`${item.name}: ${item.description}`}
        onClick={onClick}
        className="flex h-full w-full max-w-[min(calc(var(--friend-tile-size)_+_14rem),78vw)] cursor-pointer items-center overflow-hidden rounded-full border border-theme-muted/70 bg-theme-background/95 p-1.5 text-left shadow-md backdrop-blur-md transition-[width,filter,border-color] duration-[260ms] ease-out hover:w-[min(calc(var(--friend-tile-size)_+_14rem),78vw)] hover:border-theme-indicator/35 hover:brightness-110 focus-visible:w-[min(calc(var(--friend-tile-size)_+_14rem),78vw)] focus-visible:outline-2 focus-visible:outline-theme-ring group-focus-within:w-[min(calc(var(--friend-tile-size)_+_14rem),78vw)] group-hover:w-[min(calc(var(--friend-tile-size)_+_14rem),78vw)]"
      >
        <span className="grid aspect-square h-full shrink-0 place-items-center overflow-hidden rounded-full">
          <Image
            src={item.avatarUrl}
            alt={item.name}
            width={104}
            height={104}
            draggable={false}
            unoptimized
            className="size-full rounded-full object-cover"
          />
        </span>
        <span className="w-[min(14rem,calc(78vw_-_var(--friend-tile-size)))] shrink-0 overflow-hidden pr-5 pl-3 opacity-0 transition-[clip-path,opacity] duration-200 ease-out [clip-path:inset(0_100%_0_0)] group-focus-within:opacity-100 group-hover:opacity-100 group-focus-within:[clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)]">
          <span className="block truncate font-semibold text-theme-primary">{item.name}</span>
          <span className="mt-0.5 line-clamp-2 block text-theme-muted-foreground text-xs leading-4">
            {item.description}
          </span>
        </span>
      </Link>
    </div>
  )
}
