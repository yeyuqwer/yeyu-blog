import type { Metadata } from 'next'
import { clientEnv } from '@/config/env/client-env'

// * --------------- 以下配置您可以自定义 ---------------

// * -- 管理员邮箱数组，配置了才能登录成功操作数据 --
// ! 需要去 .env 中配置
export const ADMIN_EMAILS = clientEnv.NEXT_PUBLIC_ADMIN_EMAILS.split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0)

// * -- 可选，管理员钱包地址，配置了才能通过钱包签名登录 --
// ! 需要去 .env 中配置
export const ADMIN_WALLET_ADDRESS = clientEnv.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS?.toLowerCase()

// * 元数据，SEO，网页关键字。。。
export const metadata: Metadata = {
  title: `叶鱼 | 业余`,
  description: '记录前端开发、技术文章与生活思考的博客站点',
  keywords: [
    '前端开发',
    '技术博客',
    'React',
    'Next.js',
    'vue',
    'javascript',
    'typescript',
    '阅读',
    '叶鱼',
  ],
  authors: [{ name: '叶鱼', url: 'https://useyeyu.cc' }],
  creator: '叶鱼',
}

// * 首页动画加载的文字，建议不要超过 5 个字，不然长度太长，当然，你也可以去修改样式~
export const INITIAL_WELCOME_TEXT = '业余'

// * 配置评论系统的官方文档 https://giscus.app/zh-CN
export const COMMENT_CARD_REPO = 'yeyuqwer/yeyu-blog-comment'

// ! 需要去 .env 中配置
export const COMMENT_CARD_REPO_ID = clientEnv.NEXT_PUBLIC_COMMENT_CARD_REPO_ID
