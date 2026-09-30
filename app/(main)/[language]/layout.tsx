import type { Metadata } from 'next'
import { seoMetadata } from '@/config/seo'
import { languages } from '@/lib/i18n/config'
import { getRouteLanguage } from '@/lib/i18n/get-route-language'

// Allow new blog slugs after deployment; getRouteLanguage still validates the language.
export const dynamicParams = true

export function generateStaticParams() {
  return languages.map(language => ({ language }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>
}): Promise<Metadata> {
  const language = getRouteLanguage((await params).language)

  return seoMetadata[language].root
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ language: string }>
}) {
  getRouteLanguage((await params).language)

  return children
}
