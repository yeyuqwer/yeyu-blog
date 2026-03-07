import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://useyeyu.cc'),

  title: {
    default: '叶鱼 & 业余',
    template: '%s & 叶鱼',
  },

  description: '业余全栈开发，生活记录',

  keywords: [
    '叶鱼',
    '业余',
    '前端开发',
    '全栈开发',
    '技术博客',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'JavaScript',
    'TypeScript',
    'Web Development',
  ],

  authors: [
    {
      name: '叶鱼',
      url: 'https://useyeyu.cc',
    },
  ],

  creator: '叶鱼',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
  },
}
