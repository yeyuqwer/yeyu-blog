import type { ComponentProps, FC } from 'react'
import Link from 'next/link'

const ExternalLinks: { name: string; url: string }[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/yeyuqwer',
  },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/1859558916',
  },
  // * 掘金现在水文太多了，也没出多少新的优秀的小册了...
  // {
  //   name: '掘金',
  //   url: 'https://juejin.cn/user/64204896208252',
  // },
  // * 以前觉得，这种境外帐号很敏感，不想自找麻烦
  // * 后来发现，咱又不乱说话，良民desu~😋
  {
    name: 'Twitter',
    url: 'https://x.com/yeyuTvT',
  },
  {
    name: 'Gmail',
    url: 'mailto:nearjilt@gmail.com',
  },
]

export const ContactMe: FC<ComponentProps<'div'>> = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center gap-2 md:gap-4">
      <h3>联系</h3>
      <p className="flex gap-4 underline">
        {ExternalLinks.map(link => (
          <Link
            className="text-mint-indicator hover:text-mint-primary dark:text-[#888888] dark:hover:text-white"
            href={link.url}
            key={link.url}
            target="_blank"
          >
            {link.name}
          </Link>
        ))}
      </p>
    </main>
  )
}
