import { Trophy } from 'lucide-react'

export type SiteHeaderProps = {
  siteName: string
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Register', href: '#register' },
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
                  <a href={item.href} style={{ color: '#1f2937', fontWeight: 600 }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
