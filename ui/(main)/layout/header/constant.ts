import type { IModalType } from '@/store/use-modal-store'

export type NavRoute = {
  path: string
  pathName: string
  pattern: RegExp
  disabled?: boolean
  type?: 'link' | 'button'
  modal?: IModalType
}

export type NavGroup = {
  key: string
  mainPath?: string
  disabled?: boolean
  items: [NavRoute, ...NavRoute[]]
}

export type RouteItem = (NavRoute & { group?: never }) | { group: NavGroup }

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction === 0 ? 0 : direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction === 0 ? 0 : direction < 0 ? 20 : -20,
    opacity: 0,
  }),
}

export const navigationConfig: RouteItem[] = [
  {
    path: '/',
    pathName: '首页',
    pattern: /^\/$/,
  },
  {
    group: {
      key: 'hand note',
      mainPath: '/blog',
      items: [
        {
          path: '/note',
          pathName: '笔记',
          pattern: /^\/note($|\/)/,
        },
        {
          path: '/blog',
          pathName: '日志',
          pattern: /^\/blog($|\/)/,
        },
      ],
    },
  },
  {
    group: {
      key: 'mutter',
      mainPath: '/mutter',
      items: [
        {
          path: '/mutter',
          pathName: '低语',
          pattern: /^\/mutter($|\/)/,
          // disabled: true,
        },
        {
          path: '/tool',
          pathName: '工具',
          pattern: /^\/tool($|\/)/,
          disabled: true,
        },
      ],
    },
  },
  {
    group: {
      key: 'more',
      mainPath: '/login',
      items: [
        {
          path: '/login',
          pathName: '登录',
          pattern: /^\/login($|\/)/,
          type: 'button',
          modal: 'loginModal',
        },
        {
          path: '/todo',
          pathName: '等待',
          pattern: /^\/todo($|\/)/,
          disabled: true,
        },
      ],
    },
  },
  {
    path: '/about',
    pathName: '关于',
    pattern: /^\/about($|\/)/,
  },
]
