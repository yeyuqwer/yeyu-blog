export const brandThemeAttribute = 'data-brand-theme'
export const brandThemeRequestHeader = 'x-yeyu-brand-theme'

export const brandThemeOptions = [
  {
    id: 'mint',
    label: '薄荷绿',
    cssFile: 'mint.css',
  },
  {
    id: 'mist',
    label: '雾薄荷',
    cssFile: 'mist.css',
  },
  {
    id: 'camellia',
    label: '茶花红',
    cssFile: 'camellia.css',
  },
  {
    id: 'indigo',
    label: '星夜蓝',
    cssFile: 'indigo.css',
  },
  {
    id: 'leaf',
    label: '新叶绿',
    cssFile: 'leaf.css',
  },
  {
    id: 'lemon',
    label: '麦穗黄',
    cssFile: 'lemon.css',
  },
] as const

export type BrandThemeId = (typeof brandThemeOptions)[number]['id']

export const defaultBrandTheme: BrandThemeId = 'mint'

export const brandThemeIds = brandThemeOptions.map(option => option.id)

export function getRandomBrandTheme(): BrandThemeId {
  const randomIndex = Math.floor(Math.random() * brandThemeIds.length)
  return brandThemeIds[randomIndex]!
}

export function isBrandThemeId(value: string | null): value is BrandThemeId {
  return value != null && brandThemeIds.includes(value as BrandThemeId)
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
}

export function resolveBrandTheme(): BrandThemeId {
  return getDomBrandTheme() ?? defaultBrandTheme
}
