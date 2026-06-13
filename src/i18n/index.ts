import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { enTranslations } from './locales/en'
import { hiTranslations } from './locales/hi'

const LANGUAGE_STORAGE_KEY = 'khelgram_language'

export function getStoredLanguage(): 'en' | 'hi' {
  try {
    const stored = localStorage?.getItem?.(LANGUAGE_STORAGE_KEY)
    return stored === 'hi' ? 'hi' : 'en'
  } catch {
    return 'en'
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    hi: { translation: hiTranslations },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (language) => {
  try {
    localStorage?.setItem?.(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Ignore storage errors in non-browser environments.
  }
})

export default i18n
