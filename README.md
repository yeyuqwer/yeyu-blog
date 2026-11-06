# yeyu-blog

个人开发的全栈博客项目，部署在 Vercel。

博客地址：[叶鱼 | 业余](https://www.useyeyu.cc)

> 国内访问速度不确定，可能需要网络环境支持。

## 功能

- 前台：中英文主页、博客、友链
- 内容：Markdown 渲染、代码高亮、标签分类、博客评论与回复
- 后台：博客、标签、友链、评论管理
- 登录：Better Auth、GitHub OAuth、Google OAuth、SIWE 钱包登录
- 上传：UploadThing 图片上传
- 个性化：主题切换、天空背景控制、背景音乐

## 技术栈

- Next.js 16 / React 19 / TypeScript 7
- Tailwind CSS 4 / shadcn/ui / Base UI / Motion
- Better Auth / Viem / SIWE
- Drizzle ORM / PostgreSQL / node-postgres
- TanStack Query / TanStack Table / Zustand
- UploadThing / Unified / Remark / Rehype / rehype-highlight
- Biome / Lefthook / lint-staged / Commitlint / czg

## 截图展示

![首页深色主题](.github/assets/home-dark.png)

![首页浅色主题](.github/assets/home-light.png)

![后台首页](.github/assets/admin-dashboard.png)

## 本地运行

确保你已安装：

- Git
- Node.js 22.22.1 或更高版本。应用依赖要求 Node.js 22，提交钩子使用的 `lint-staged` 将本地最低版本提高到 22.22.1。
- pnpm 9.13.2，与 `package.json` 的 `packageManager` 一致
- PostgreSQL 数据库，使用本地数据库、Neon 或 Vercel Storage 都可以

### 获取项目代码

先 fork 仓库到你自己的账号，再 clone 你 fork 后的仓库：

```shell
git clone {REPO}
```

### 安装依赖

```shell
pnpm install
```

### 配置环境变量

复制一份开发环境变量文件：

```shell
cp .env.example .env.development
```

按 `.env.example` 填写下面这些变量：

```env
SITE_URL=http://localhost:3000

BETTER_AUTH_SECRET=

ADMIN_EMAILS="admin@example.com editor@example.com"
ADMIN_WALLET_ADDRESS=""

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

UPLOADTHING_TOKEN=
DATABASE_URL=

SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
MAIL_FROM="叶鱼博客 <notice@example.com>"
MAIL_TO=
```

Gmail 应用专用密码可以不写空格，代码发送前也会自动移除空白。

`BETTER_AUTH_SECRET` 可以用下面的命令生成：

```shell
openssl rand -base64 32
```

当前服务端环境变量校验要求 GitHub 和 Google 两组 OAuth 都填写。`ADMIN_EMAILS` 支持使用空格或英文逗号分隔多个邮箱；`ADMIN_WALLET_ADDRESS` 是可选项，不需要钱包登录后台时可以留空。SMTP 配置需要整组填写或全部留空；`MAIL_TO` 是站长通知收件人，多个邮箱用英文逗号分隔。

### 配置数据库

项目使用 PostgreSQL。创建数据库后，把连接地址填到当前环境实际使用的环境变量文件中。
`drizzle.config.ts` 从 `serverEnv` 获取经过校验的 `DATABASE_URL`。

首次将现有开发数据库纳入 Drizzle 管理时，生成 schema baseline：

```shell
pnpm exec drizzle-kit pull --config=drizzle.config.ts --init
```

### 配置 OAuth

GitHub OAuth App：

- Homepage URL：`http://localhost:3000`
- Authorization callback URL：`http://localhost:3000/api/auth/callback/github`

Google OAuth Client：

- Authorized JavaScript origins：`http://localhost:3000`
- Authorized redirect URI：`http://localhost:3000/api/auth/callback/google`

部署到线上时，把上面的 `localhost` 替换成你的线上域名。

### 配置图片上传

前往 [UploadThing](https://uploadthing.com/) 创建 app，把 API Token 填到：

```env
UPLOADTHING_TOKEN=
```

### 启动开发服务

```shell
pnpm dev
```

前台地址：`http://localhost:3000`

后台地址：`http://localhost:3000/admin`

## 未使用代码检查

```shell
pnpm knip
```

`knip.json` 补充了静态分析无法自动识别的入口，并保留必要的公共接口：

- `doctor.config.ts`、`next-sitemap.config.js` 和 `drizzle.config.ts` 是工具配置入口。
- `ui/shadcn/**` 保留基础组件的公共导出和类型，只忽略 `exports`、`types`，仍检查未使用文件和依赖。
- `server-only` 由当前 Next.js 内置别名解析，忽略其未声明依赖提示，不移除服务端边界标记。

业务代码不在忽略范围内；没有引用的文件和导出仍需清理。

## 部署

推荐部署到 Vercel。部署前确认：

- Vercel 项目的 Node.js 版本满足依赖要求，建议使用 26.x 并与本地开发环境保持一致
- Vercel 环境变量已按 `.env.example` 配置完整
- 线上数据库已经执行过对应的 Drizzle migration
- GitHub / Google OAuth callback URL 已改成线上域名
- `SITE_URL` 是线上站点地址

## 修改网站信息

- `config/seo/index.ts`：站点 metadata 和 SEO 信息
- `config/env/parse-server-env.ts`、`config/env/server-env.ts`：服务端环境变量校验与读取
- `config/img/avatar.webp`：首页头像图片
- `ui/(main)/(home)/profile-section.tsx`：首页个人简介
- `ui/(main)/layout/contact-me/index.tsx`：底部联系方式
- `ui/(main)/(home)/tech-stack.tsx`：首页技术栈展示
- `lib/core/auth/guard.ts`、`lib/core/auth/utils.ts`：后台管理员权限判断
- `ui/components/modal/main/login-modal/index.tsx`：登录弹窗

## 设计参考

- [fuxiaochen](https://github.com/aifuxi/fuxiaochen)
- [Shiro](https://github.com/Innei/Shiro)
- [Arthals' Ink](https://arthals.ink/)
- [grtblog](https://github.com/grtsinry43/grtblog)
- [Arthals-Ink](https://github.com/zhuozhiyongde/Arthals-Ink)
- [Anthony Fu](https://github.com/antfu/antfu.me)
- [Victor Williams](https://www.victorwilliams.me/)
- [Vercel Fonts](https://vercel.com/font)
- [WendRevival](https://x.com/WendRevival/status/2021680550226829780)
