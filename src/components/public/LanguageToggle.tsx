import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const setLanguage = (language: 'en' | 'hi') => {
    void i18n.changeLanguage(language)
  }

  return (
    <div
      aria-label={t('language.toggleLabel')}
      style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={i18n.language === 'en'}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          padding: '0.25rem 0.5rem',
          background: i18n.language === 'en' ? '#e5e7eb' : '#fff',
          cursor: 'pointer',
        }}
      >
        {t('language.english')}
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={i18n.language === 'hi'}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          padding: '0.25rem 0.5rem',
          background: i18n.language === 'hi' ? '#e5e7eb' : '#fff',
          cursor: 'pointer',
        }}
      >
        {t('language.hindi')}
      </button>
    </div>
  )
}
