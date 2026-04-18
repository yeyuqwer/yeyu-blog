export const brandThemeStorageKey = 'yeyu-brand-theme'
export const brandThemeAttribute = 'data-brand-theme'

export const brandThemeOptions = [
  {
    id: 'mint',
    label: '薄荷绿',
    cssFile: 'mint.css',
  },
  {
    id: 'camellia',
    label: '茶花红',
    cssFile: 'camellia.css',
  },
] as const

export type BrandThemeId = (typeof brandThemeOptions)[number]['id']

export const defaultBrandTheme: BrandThemeId = 'mint'

const brandThemeIds = brandThemeOptions.map(option => option.id)

export function isBrandThemeId(value: string | null): value is BrandThemeId {
  return value != null && brandThemeIds.includes(value as BrandThemeId)
}

export function getStoredBrandTheme(): BrandThemeId | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(brandThemeStorageKey)
  return isBrandThemeId(raw) ? raw : null
}

export function getDomBrandTheme(): BrandThemeId | null {
  if (typeof document === 'undefined') return null
  const raw = document.documentElement.getAttribute(brandThemeAttribute)
  return isBrandThemeId(raw) ? raw : null
}

export function applyBrandTheme(theme: BrandThemeId) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(brandThemeAttribute, theme)
}

export function setBrandTheme(theme: BrandThemeId) {
  applyBrandTheme(theme)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(brandThemeStorageKey, theme)
  }
}

export function resolveBrandTheme(): BrandThemeId {
  return getStoredBrandTheme() ?? getDomBrandTheme() ?? defaultBrandTheme
}
