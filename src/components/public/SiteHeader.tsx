import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

export type SiteHeaderProps = {
  siteName: string
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Register', href: '/register' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader({ siteName }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container-custom">
        <div className="header-content">
          <div
            className="logo-section"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Trophy aria-hidden size={24} color="#22c55e" />
            <span className="logo-text">{siteName}</span>
          </div>
          <nav aria-label="Primary navigation">
            <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith('/') ? (
                    <Link to={item.href} style={{ color: '#1f2937', fontWeight: 600 }}>
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} style={{ color: '#1f2937', fontWeight: 600 }}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  style={{ color: '#6b7280', fontWeight: 600 }}
                  aria-label="Admin sign in"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
