'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { getRoutePathname } from '@/lib/i18n/get-route-pathname'

export default function BlogLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <main key={getRoutePathname(pathname)} className="flex flex-col px-4">
      {children}
    </main>
  )
}
