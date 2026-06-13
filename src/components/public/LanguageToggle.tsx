import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const setLanguage = (language: 'en' | 'hi') => {
    void i18n.changeLanguage(language)
  }

  return (
    <div className="language-toggle" aria-label={t('language.toggleLabel')} role="group">
      <button
        type="button"
        className={`language-toggle__pill ${i18n.language === 'en' ? 'language-toggle__pill--active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <span className="language-toggle__divider" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        className={`language-toggle__pill ${i18n.language === 'hi' ? 'language-toggle__pill--active' : ''}`}
        onClick={() => setLanguage('hi')}
        aria-pressed={i18n.language === 'hi'}
      >
        हिं
      </button>
    </div>
  )
}
