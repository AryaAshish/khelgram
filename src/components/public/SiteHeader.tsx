import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { LanguageToggle } from '@/components/public/LanguageToggle'
import { Button } from '@/components/ui/button'

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
  { key: 'contact', labelKey: 'contact', href: '#contact' },
]

export function SiteHeader({ siteName }: SiteHeaderProps) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="site-header">
      <div className="container-custom">
        <div className="header-content">
          <Link to="/" className="logo-section" onClick={closeMobile}>
            <img src="/brand/wordmark.svg" alt="" className="logo-wordmark" aria-hidden="true" />
            <span className="logo-text">{siteName}</span>
          </Link>

          <button
            type="button"
            className="site-header__menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>

          <nav
            id="primary-navigation"
            aria-label="Primary navigation"
            className={`site-nav ${mobileOpen ? 'site-nav--open' : ''}`}
          >
            <ul className="site-nav__list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="site-nav__link" onClick={closeMobile}>
                    {t(`nav.${item.labelKey}`)}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/get-involved" className="site-nav__link" onClick={closeMobile}>
                  Get Involved
                </Link>
              </li>
              <li className="site-nav__cta">
                <Link to="/khel2026" onClick={closeMobile}>
                  <Button variant="festival" className="site-nav__khel-pill">
                    {t('nav.khel2026')}
                  </Button>
                </Link>
              </li>
              <li>
                <LanguageToggle />
              </li>
              <li>
                <Link
                  to="/admin"
                  className="site-nav__admin"
                  aria-label={t('nav.admin')}
                  onClick={closeMobile}
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
