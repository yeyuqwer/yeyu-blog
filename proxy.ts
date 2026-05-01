import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { brandThemeRequestHeader, getRandomBrandTheme } from '@/lib/styles/themes/constant'

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(brandThemeRequestHeader, getRandomBrandTheme())

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      has: [
        {
          type: 'header',
          key: 'accept',
          value: '.*text/html.*',
        },
      ],
    },
  ],
}
