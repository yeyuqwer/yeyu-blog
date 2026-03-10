export const BRAND_THEME_STORAGE_KEY = 'yeyu-brand-theme'
export const BRAND_THEME_ATTRIBUTE = 'data-brand-theme'

export const brandThemeOptions = [
  {
    id: 'mint',
    label: '薄荷绿',
    cssFile: 'mint.css',
  },
  {
    id: 'sakura',
    label: '樱花粉',
    cssFile: 'sakura.css',
  },
] as const

export type BrandThemeId = (typeof brandThemeOptions)[number]['id']

export const DEFAULT_BRAND_THEME: BrandThemeId = 'mint'

const brandThemeIds = brandThemeOptions.map(option => option.id)

export function isBrandThemeId(value: string | null): value is BrandThemeId {
  return value != null && brandThemeIds.includes(value as BrandThemeId)
}

export function getStoredBrandTheme(): BrandThemeId | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(BRAND_THEME_STORAGE_KEY)
  return isBrandThemeId(raw) ? raw : null
}

export function getDomBrandTheme(): BrandThemeId | null {
  if (typeof document === 'undefined') return null
  const raw = document.documentElement.getAttribute(BRAND_THEME_ATTRIBUTE)
  return isBrandThemeId(raw) ? raw : null
}

export function applyBrandTheme(theme: BrandThemeId) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(BRAND_THEME_ATTRIBUTE, theme)
}

export function setBrandTheme(theme: BrandThemeId) {
  applyBrandTheme(theme)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(BRAND_THEME_STORAGE_KEY, theme)
  }
}

export function resolveBrandTheme(): BrandThemeId {
  return getStoredBrandTheme() ?? getDomBrandTheme() ?? DEFAULT_BRAND_THEME
}
