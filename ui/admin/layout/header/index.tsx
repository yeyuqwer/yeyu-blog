'use client'

import type { ComponentProps, FC } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/ui/shadcn/button'
import { ModeToggle } from '@/ui/shadcn/mode-toggle'
import { AdminLogo } from './admin-logo'
import { AvatarDropdownMenu } from './avatar-dropdown-menu'
import { AdminRoutes } from './constant'

export const AdminNavbar: FC<ComponentProps<'header'>> = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-dashed px-6 backdrop-blur-lg">
      <nav className="flex gap-4">
        {/* 左侧logo区域, 回到首页 */}
        <AdminLogo />
        {/* 路由 */}
        {AdminRoutes.map(route => (
          <Link href={route.path} key={route.path}>
            <Button
              className="cursor-pointer rounded-lg text-base"
              variant={route.pattern.test(pathname) ? 'default' : 'ghost'}
              size="sm"
            >
              {route.pathName}
            </Button>
          </Link>
        ))}
      </nav>
      <section className="flex items-center gap-4">
        <ModeToggle />
        <AvatarDropdownMenu />
      </section>
    </header>
  )
}
