import type { Friend, PlaneMotion } from '../types'

export const friends: Friend[] = [
  {
    name: 'Aki',
    description: '记录前端、摄影和一些生活里发亮的小事。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Aki&backgroundColor=b6e3f4',
    siteUrl: 'https://example.com/aki',
  },
  {
    name: 'Mio',
    description: '喜欢 TypeScript，也喜欢把复杂问题写得温柔一点。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Mio&backgroundColor=c0aede',
    siteUrl: 'https://example.com/mio',
  },
  {
    name: 'Nana',
    description: '在博客里放技术笔记、读书摘录和偶尔的碎碎念。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Nana&backgroundColor=ffd5dc',
    siteUrl: 'https://example.com/nana',
  },
  {
    name: 'Rin',
    description: '做设计系统，也写一点关于独立开发的观察。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Rin&backgroundColor=d1d4f9',
    siteUrl: 'https://example.com/rin',
  },
  {
    name: 'Sora',
    description: '热衷折腾 Next.js、动画和漂亮但实用的交互。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Sora&backgroundColor=c0e8d5',
    siteUrl: 'https://example.com/sora',
  },
  {
    name: 'Yuki',
    description: '分享 Web3 学习记录，以及一些认真生活的证据。',
    avatarUrl: 'https://api.dicebear.com/9.x/lorelei/svg?seed=Yuki&backgroundColor=ffdfbf',
    siteUrl: 'https://example.com/yuki',
  },
]

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

export const friendApplyPlaneItem = {
  id: 'friend-apply',
  type: 'apply',
  name: '申请友链',
  description: '提交你的友链申请',
  x: 326,
  y: 392,
  rotate: 3,
  scale: 0.94,
} as const

export const planeCopies = [-1, 0, 1].flatMap(copyY =>
  [-1, 0, 1].map(copyX => ({
    x: copyX,
    y: copyY,
  })),
)
