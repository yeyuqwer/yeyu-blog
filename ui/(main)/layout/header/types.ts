import type { ModalType } from '@/store/use-modal-store'

export type NavRoute = {
  path: string
  pathName: string
  pattern: RegExp
  disabled?: boolean
  type?: 'link' | 'button'
  modal?: ModalType
}

export type NavGroup = {
  key: string
  mainPath?: string
  disabled?: boolean
  items: [NavRoute, ...NavRoute[]]
}

export type RouteItem = (NavRoute & { group?: never }) | { group: NavGroup }
