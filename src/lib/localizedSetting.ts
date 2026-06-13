import type { TFunction } from 'i18next'

export function localizedSetting(
  settingsMap: Record<string, string>,
  key: string,
  fallback: string,
  language: string,
): string {
  if (language === 'hi') {
    const hindiValue = settingsMap[`${key}_hi`]
    if (hindiValue) {
      return hindiValue
    }
  }

  return settingsMap[key] ?? fallback
}

export function localizedNavLabel(t: TFunction, key: string, cmsValue?: string) {
  const translated = t(`nav.${key}`, { defaultValue: '' })
  return translated || cmsValue || key
}
