import { Link } from 'react-router-dom'

export type SiteFooterProps = {
  description: string
  copyright: string
}

const quickLinks = [
  { label: 'Programs', href: '/#programs' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Khel 2026', href: '/khel2026' },
  { label: 'Donate', href: '/donate' },
]

export function SiteFooter({ description, copyright }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container-custom site-footer__grid">
        <div>
          <h2 className="site-footer__title">Khelgram Foundation</h2>
          <p className="site-footer__description">{description}</p>
        </div>
        <div>
          <h3 className="site-footer__heading">Quick links</h3>
          <ul className="site-footer__links">
            {quickLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link to={link.href}>{link.label}</Link>
                ) : (
                  <a href={link.href}>{link.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="site-footer__heading">Contact</h3>
          <ul className="site-footer__links">
            <li>
              <a href="mailto:hello@khelgram.org">hello@khelgram.org</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-custom site-footer__bottom">
        <p>
          {copyright}{' '}
          <Link to="/admin" aria-label="Admin sign in">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  )
}
