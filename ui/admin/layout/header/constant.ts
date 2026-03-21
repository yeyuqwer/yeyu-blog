export const AdminRoutes: { path: string; pathName: string; pattern: RegExp }[] = [
  {
    path: '/admin',
    pathName: '首页',
    pattern: /^\/admin$/,
  },
  {
    path: '/admin/blog',
    pathName: '博客',
    pattern: /^\/admin\/blog($|\/)/,
  },
  {
    path: '/admin/note',
    pathName: '笔记',
    pattern: /^\/admin\/note($|\/)/,
  },
  {
    path: '/admin/tag',
    pathName: '标签',
    pattern: /^\/admin\/tag($|\/)/,
  },
  {
    path: '/admin/echo',
    pathName: '引用',
    pattern: /^\/admin\/echo($|\/)/,
  },
  {
    path: '/admin/mutter',
    pathName: '低语',
    pattern: /^\/admin\/mutter($|\/)/,
  },
  {
    path: '/admin/comment',
    pathName: '评论',
    pattern: /^\/admin\/comment($|\/)/,
  },
]
