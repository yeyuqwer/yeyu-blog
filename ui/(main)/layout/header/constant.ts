import type { NavGroup, NavRoute, RouteItem } from './types'

export const activeTextShadowClass =
  '[text-shadow:0.03em_0_0_currentColor,-0.03em_0_0_currentColor]'
export const inactiveTextShadowClass = '[text-shadow:0_0_0_transparent]'

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
        },
        {
          path: '/friends',
          pathName: '友链',
          pattern: /^\/friends($|\/)/,
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

export const isNavGroupRoute = (
  route: RouteItem,
): route is Extract<RouteItem, { group: NavGroup }> => {
  return 'group' in route && route.group != null
}

export const flatNavRoutes = navigationConfig.flatMap(route =>
  isNavGroupRoute(route) ? route.group.items : [route],
)

export const navGroupRoutes = navigationConfig.filter(isNavGroupRoute)

export const navGroupIndexMap = new Map<string, number>(
  navGroupRoutes.map((route, index) => [route.group.key, index] as const),
)

export const navGroupRouteMap = new Map<string, Extract<RouteItem, { group: NavGroup }>>(
  navGroupRoutes.map(route => [route.group.key, route] as const),
)

export const navRoutePathMap = new Map<string, NavRoute>(
  flatNavRoutes.map(route => [route.path, route] as const),
)

export const navRouteGroupMap = new Map<string, Extract<RouteItem, { group: NavGroup }>>(
  navGroupRoutes.flatMap(route => route.group.items.map(item => [item.path, route] as const)),
)
