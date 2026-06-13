import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trophy } from 'lucide-react'
import { LanguageToggle } from '@/components/public/LanguageToggle'

export type SiteHeaderProps = {
  siteName: string
}

const navItems: Array<{
  key: string
  labelKey: string
  href: string
  route?: boolean
}> = [
  { key: 'about', labelKey: 'about', href: '#about' },
  { key: 'programs', labelKey: 'programs', href: '#programs' },
  { key: 'impact', labelKey: 'impact', href: '#impact' },
  { key: 'khel2026', labelKey: 'khel2026', href: '/khel2026', route: true },
  { key: 'contact', labelKey: 'contact', href: '#contact' },
]

export function SiteHeader({ siteName }: SiteHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="site-header">
      <div className="container-custom">
        <div className="header-content">
          <Link
            to="/"
            className="logo-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Trophy aria-hidden size={24} color="#22c55e" />
            <span className="logo-text">{siteName}</span>
          </Link>
          <nav aria-label="Primary navigation">
            <ul
              style={{
                display: 'flex',
                gap: '1rem',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                alignItems: 'center',
              }}
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.route ? (
                    <Link to={item.href} style={{ color: '#1f2937', fontWeight: 600 }}>
                      {t(`nav.${item.labelKey}`)}
                    </Link>
                  ) : (
                    <a href={item.href} style={{ color: '#1f2937', fontWeight: 600 }}>
                      {t(`nav.${item.labelKey}`)}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <LanguageToggle />
              </li>
              <li>
                <Link
                  to="/admin"
                  style={{ color: '#6b7280', fontWeight: 600 }}
                  aria-label={t('nav.admin')}
                >
                  {t('nav.admin')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
