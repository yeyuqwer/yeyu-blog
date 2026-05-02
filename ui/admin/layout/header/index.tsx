'use client'

import type { ComponentProps, FC } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAdminPendingCountQuery } from '@/hooks/api/admin'
import { formatPendingCount } from '@/lib/utils/common/format-pending-count'
import { cn } from '@/lib/utils/common/shadcn'
import { Button } from '@/ui/shadcn/button'
import { ModeToggle } from '@/ui/shadcn/mode-toggle'
import { AdminLogo } from './admin-logo'
import { AvatarDropdownMenu } from './avatar-dropdown-menu'
import { AdminRoutes } from './constant'

export const AdminNavbar: FC<ComponentProps<'header'>> = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { data: pendingCountData } = useAdminPendingCountQuery()

  const pendingCountByPath: Partial<Record<(typeof AdminRoutes)[number]['path'], number>> = {
    '/admin/comment': pendingCountData?.commentPendingCount ?? 0,
    '/admin/friend-link': pendingCountData?.friendLinkPendingCount ?? 0,
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-dashed px-6 backdrop-blur-lg">
      <nav className="flex gap-4">
        {/* 左侧logo区域, 回到首页 */}
        <AdminLogo />
        {/* 路由 */}
        {AdminRoutes.map(route => {
          const isActive = route.pattern.test(pathname)
          const pendingCount = pendingCountByPath[route.path] ?? 0
          const shouldShowPendingBadge = pendingCount > 0 && !isActive

          return (
            <div key={route.path} className="relative inline-flex overflow-visible">
              <Button
                asChild
                className={cn('rounded-lg text-base', shouldShowPendingBadge && 'pr-5')}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
              >
                <Link
                  href={route.path}
                  prefetch={false}
                  onFocus={() => {
                    router.prefetch(route.path)
                  }}
                  onPointerEnter={() => {
                    router.prefetch(route.path)
                  }}
                >
                  {route.pathName}
                </Link>
              </Button>
              {shouldShowPendingBadge ? (
                <span className="pointer-events-none absolute right-0 bottom-0 z-10 inline-flex min-w-5 translate-x-1/3 translate-y-1/3 items-center justify-center rounded-full bg-destructive px-1.5 py-0.5 font-medium text-[10px] text-white leading-none shadow-xs">
                  {formatPendingCount(pendingCount)}
                </span>
              ) : null}
            </div>
          )
        })}
      </nav>
      <section className="flex items-center gap-4">
        <ModeToggle />
        <AvatarDropdownMenu />
      </section>
    </header>
  )
}
